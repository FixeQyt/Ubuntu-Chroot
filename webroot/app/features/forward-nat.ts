export type ForwardNatDeps = {
  // UI element map (optional, but preferred)
  els?: {
    forwardNatIface?: HTMLSelectElement | null;
    forwardNatPopup?: HTMLElement | null;
    startForwardingBtn?: HTMLElement | null;
    stopForwardingBtn?: HTMLElement | null;
  };

  // Small state refs (optional, if provided they are updated by the module)
  forwardingActive?: { value: boolean };

  // persistent storage helpers
  Storage: {
    get: (key: string, defaultValue?: any) => any;
    set: (key: string, value: any) => void;
    getJSON?: <T = any>(key: string, defaultValue?: T | null) => T | null;
    setJSON?: (key: string, value: any) => void;
  };

  // State manager (if present) for saving flags
  StateManager?: {
    get?: (name: string) => boolean;
    set?: (name: string, value: boolean) => void;
  };

  // Script paths
  FORWARD_NAT_SCRIPT: string;

  // Utilities provided by the main app
  appendConsole: (text: string, cls?: string) => void;
  runCmdSync: (cmd: string) => Promise<string>;
  runCmdAsync?: (cmd: string, onComplete?: (res: any) => void) => string | null;

  // Flow & UI management
  withCommandGuard?: (id: string, fn: () => Promise<void>) => Promise<void>;
  prepareActionExecution?: (
    headerText: string,
    progressText: string,
    progressType?: "spinner" | "dots",
  ) => Promise<{ progressLine: HTMLElement; interval: any }>;
  ProgressIndicator?: {
    create: (
      text: string,
      type?: "spinner" | "dots",
      el?: HTMLElement | null,
    ) => { progressLine: HTMLElement; interval?: any } | null;
    remove: (
      handle?: { progressLine: HTMLElement; interval?: any } | null,
    ) => void;
    update: (
      handle?: { progressLine: HTMLElement; interval?: any } | null,
      text?: string,
    ) => void;
  };
  disableAllActions?: (disabled: boolean) => void;
  disableSettingsPopup?: (disabled: boolean, chrootExists?: boolean) => void;
  PopupManager?: {
    open: (popup: HTMLElement | null | undefined) => void;
    close: (popup: HTMLElement | null | undefined) => void;
  };
  ButtonState?: {
    setButtonPair?: (
      startBtn?: HTMLElement | null,
      stopBtn?: HTMLElement | null,
      isActive?: boolean,
    ) => void;
  };

  // Flags used by other modules or core (optional)
  rootAccessConfirmed?: { value: boolean };
  activeCommandId?: { value: string | null };
  updateStatus?: (s: string) => void;
  refreshStatus?: () => Promise<void>;

  // Optional delays
  ANIMATION_DELAYS?: Record<string, number>;
};

let deps: ForwardNatDeps | null = null;

/**
 * Initialize the feature with dependencies.
 */
export function init(d: ForwardNatDeps) {
  deps = d;
}

/**
 * Load forwarding state from persistent store (StateManager or Storage).
 */
export function loadForwardingStatus() {
  if (!deps) return;
  if (deps.forwardingActive && deps.StateManager && deps.StateManager.get) {
    deps.forwardingActive.value = deps.StateManager.get("forwarding");
  } else {
    // Fallback to Storage boolean
    try {
      const val = deps.Storage.get("forwarding_active");
      deps.forwardingActive = deps.forwardingActive || { value: false };
      deps.forwardingActive.value = String(val) === "true";
    } catch {
      // ignore
    }
  }
}

/**
 * Save forwarding state to persistent store.
 */
export function saveForwardingStatus() {
  if (!deps) return;
  const value =
    deps.forwardingActive && deps.forwardingActive.value ? true : false;
  if (deps.StateManager && deps.StateManager.set) {
    deps.StateManager.set("forwarding", value);
  } else {
    try {
      deps.Storage.set("forwarding_active", value ? "true" : "false");
    } catch {
      // ignore
    }
  }
}

/**
 * Populate the forward-nat interface select UI with a list of interface strings.
 * The `interfacesRaw` array contains elements like: "wlan0:10.0.0.1" or "eth0".
 */
function populateInterfaces(interfacesRaw: string[]) {
  if (!deps) return;
  const select = deps.els?.forwardNatIface;
  if (!select) return;

  select.innerHTML = "";
  if (!interfacesRaw || interfacesRaw.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No interfaces found";
    select.appendChild(option);
    select.disabled = true;
    return;
  }

  interfacesRaw.forEach((ifaceRaw) => {
    const trimmed = String(ifaceRaw || "").trim();
    if (!trimmed) return;

    const option = document.createElement("option");
    if (trimmed.includes(":")) {
      const [iface, ip] = trimmed.split(":").map((s) => s.trim());
      option.value = iface;
      option.textContent = `${iface} (${ip})`;
    } else {
      option.value = trimmed;
      option.textContent = trimmed;
    }
    select.appendChild(option);
  });

  select.disabled = false;

  // Try to restore previously selected iface
  try {
    const saved = deps.Storage.get("chroot_selected_interface");
    if (saved) {
      const opt = Array.from(select.options).find((o) => o.value === saved);
      if (opt) select.value = saved;
      else if (select.options.length > 0)
        select.value = select.options[0].value;
    } else if (select.options.length > 0) {
      select.value = select.options[0].value;
    }
  } catch {
    // ignore
  }
}

/**
 * Fetch network interfaces for forwarding. Uses caching (Storage) and prefers cached data unless forced.
 * - forceRefresh: forces fetching from script and updating cache.
 * - backgroundOnly: when true, only updates cache but does not update UI elements.
 */
export async function fetchInterfaces(
  forceRefresh = false,
  backgroundOnly = false,
) {
  if (!deps) return;

  // Ensure root is available
  if (deps.rootAccessConfirmed && !deps.rootAccessConfirmed.value) return;

  const cached: string[] =
    (deps.Storage.getJSON
      ? deps.Storage.getJSON("chroot_forward_nat_interfaces_cache")
      : null) || [];

  if (cached && Array.isArray(cached) && cached.length > 0 && !forceRefresh) {
    if (!backgroundOnly) populateInterfaces(cached);
    return;
  }

  // No cache or forced refresh
  try {
    const cmd = `sh ${deps.FORWARD_NAT_SCRIPT} list-iface`;
    const out = await deps.runCmdSync(cmd);
    const interfacesRaw = String(out || "")
      .trim()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      deps.Storage.setJSON?.(
        "chroot_forward_nat_interfaces_cache",
        interfacesRaw,
      );
    } catch {
      // ignore
    }

    if (!backgroundOnly) populateInterfaces(interfacesRaw);
  } catch (err: any) {
    // Show a polite warning in console unless backgroundOnly
    if (!backgroundOnly) {
      deps.appendConsole?.(
        `Could not fetch interfaces: ${String(err?.message || err)}`,
        "warn",
      );
      const select = deps.els?.forwardNatIface;
      if (select) {
        select.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Failed to load interfaces";
        select.appendChild(option);
        select.disabled = true;
      }
    }
  }
}

/**
 * Opens the forwarding popup and ensures UI has cached interfaces (no heavy background fetch).
 */
export function openForwardNatPopup() {
  if (!deps) return;
  deps.PopupManager?.open?.(deps.els?.forwardNatPopup ?? null);
  // Populate from cache only (no background fetching to avoid lag)
  fetchInterfaces(false, false).catch(() => {});
}

/**
 * Refresh interfaces (force refresh).
 */
export function refreshInterfaces() {
  if (!deps) return;
  fetchInterfaces(true, false).catch(() => {});
}

/**
 * Close forward-nat popup
 */
export function closeForwardNatPopup() {
  if (!deps) return;
  deps.PopupManager?.close?.(deps.els?.forwardNatPopup ?? null);
}

/**
 * Start forwarding on the selected interface. Uses `withCommandGuard` to avoid concurrent operations.
 * Saves the selected interface to Storage, updates active UI state, and sets forwardingActive flag.
 */
export async function startForwarding() {
  if (!deps) return;
  const d = deps;

  // Validate UI props
  const select = d.els?.forwardNatIface;
  const iface = (select?.value || "").trim();
  if (!iface) {
    d.appendConsole?.("Please select a network interface", "err");
    return;
  }

  await d.withCommandGuard?.("forwarding-start", async () => {
    try {
      d.Storage.set("chroot_selected_interface", iface);
    } catch {
      // ignore
    }

    // Close popup & small delay for UI
    d.PopupManager?.close?.(d.els?.forwardNatPopup ?? null);
    const delay = d.ANIMATION_DELAYS?.POPUP_CLOSE ?? 350;
    await new Promise((r) => setTimeout(r, delay));

    d.disableAllActions?.(true);
    d.disableSettingsPopup?.(true);

    const actionText = `Starting forwarding on ${iface}`;
    const progress = d.prepareActionExecution
      ? await d.prepareActionExecution(actionText, actionText, "spinner")
      : null;

    d.activeCommandId && (d.activeCommandId.value = "forwarding-start");

    try {
      // start forwarding using script
      const cmd = `sh ${d.FORWARD_NAT_SCRIPT} -i "${iface}" 2>&1`;
      const out = await d.runCmdSync(cmd);
      if (out) {
        // display output lines
        String(out)
          .split("\n")
          .forEach((l) => {
            if (l && l.trim()) d.appendConsole?.(String(l).trim());
          });
      }

      const success =
        out &&
        (String(out).includes("Localhost routing active") ||
          String(out).includes("Gateway:"));
      if (success) {
        d.appendConsole?.(
          `✓ Forwarding started successfully on ${iface}`,
          "success",
        );
        // Update state
        if (d.forwardingActive) {
          d.forwardingActive.value = true;
        }
        saveForwardingStatus();
        d.ButtonState?.setButtonPair?.(
          d.els?.startForwardingBtn ?? null,
          d.els?.stopForwardingBtn ?? null,
          true,
        );
      } else {
        d.appendConsole?.("✗ Failed to start forwarding", "err");
      }
    } catch (error: any) {
      d.appendConsole?.(
        `✗ Failed to start forwarding: ${String(error?.message || error)}`,
        "err",
      );
    } finally {
      d.ProgressIndicator?.remove?.(progress ?? null);
      if (d.activeCommandId) d.activeCommandId.value = null;
      d.disableAllActions?.(false);
      d.disableSettingsPopup?.(false, true);
      setTimeout(
        () => d.refreshStatus?.(),
        d.ANIMATION_DELAYS?.STATUS_REFRESH ?? 300,
      );
    }
  });
}

/**
 * Stop forwarding - uses async execution to allow the background script to cleanup, and keeps UI responsive.
 */
export async function stopForwarding() {
  if (!deps) return;
  const d = deps;

  await d.withCommandGuard?.("forwarding-stop", async () => {
    // Close popup & small delay for UI
    try {
      d.PopupManager?.close?.(d.els?.forwardNatPopup ?? null);
    } catch {}
    await new Promise((r) =>
      setTimeout(r, d.ANIMATION_DELAYS?.POPUP_CLOSE ?? 250),
    );

    d.disableAllActions?.(true);
    d.disableSettingsPopup?.(true);

    const actionText = "Stopping forwarding";
    const progress = d.prepareActionExecution
      ? await d.prepareActionExecution(actionText, actionText, "spinner")
      : null;

    d.activeCommandId && (d.activeCommandId.value = "forwarding-stop");

    try {
      const cmd = `sh ${d.FORWARD_NAT_SCRIPT} -k 2>&1`;
      // We prefer runCmdAsync here to let the backend call us back when done
      d.runCmdAsync?.(cmd, (result: any) => {
        // cleanup
        d.ProgressIndicator?.remove?.(progress ?? null);
        // Always clear the state marker, even if there were errors
        if (d.forwardingActive) {
          d.forwardingActive.value = false;
        }
        saveForwardingStatus();
        d.ButtonState?.setButtonPair?.(
          d.els?.startForwardingBtn ?? null,
          d.els?.stopForwardingBtn ?? null,
          false,
        );

        if (result?.success) {
          d.appendConsole?.("✓ Forwarding stopped successfully", "success");
        } else {
          const output = result?.output || result?.error || "";
          if (
            String(output).toLowerCase().includes("warn") ||
            String(output).toLowerCase().includes("warning")
          ) {
            d.appendConsole?.(
              "⚠ Forwarding cleanup completed with warnings",
              "warn",
            );
          } else {
            d.appendConsole?.(
              "⚠ Forwarding stop completed (some rules may not have existed)",
              "warn",
            );
          }
          // show possible debugging output
          if (String(output).trim()) {
            String(output)
              .split("\n")
              .forEach((line) => {
                if (line && line.trim()) d.appendConsole?.(String(line).trim());
              });
          }
        }

        if (d.activeCommandId) d.activeCommandId.value = null;
        d.disableAllActions?.(false);
        d.disableSettingsPopup?.(false, true);
        setTimeout(
          () => d.refreshStatus?.(),
          d.ANIMATION_DELAYS?.STATUS_REFRESH ?? 300,
        );
      });
    } catch (err: any) {
      d.ProgressIndicator?.remove?.(progress ?? null);
      d.appendConsole?.(
        `✗ Failed to stop forwarding: ${String(err?.message || err)}`,
        "err",
      );
      d.disableAllActions?.(false);
      d.disableSettingsPopup?.(false, true);
    }
  });
}

/**
 * Export and attach to window for backward compatibility with legacy app.js style usage.
 */
const ForwardNatFeature = {
  init,
  loadForwardingStatus,
  saveForwardingStatus,
  fetchInterfaces,
  populateInterfaces,
  openForwardNatPopup,
  closeForwardNatPopup,
  refreshInterfaces,
  startForwarding,
  stopForwarding,
};

if (typeof window !== "undefined") {
  try {
    (window as any).ForwardNatFeature = ForwardNatFeature;
  } catch {}
}

export default ForwardNatFeature;
