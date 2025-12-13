import { useRuntimeConfig } from "#imports";

export default defineNuxtPlugin(() => {
  if (!process.client || typeof window === "undefined") {
    return;
  }

  const bridgeCheck = () => {
    return (
      !!(window as any).cmdExec &&
      (typeof (window as any).cmdExec.execute === "function" ||
        typeof (window as any).cmdExec.executeAsync === "function")
    );
  };

  // If there's already a bridge, don't mess with it
  if (bridgeCheck()) {
    if (typeof console !== "undefined" && console.debug) {
      console.debug(
        "loadLegacyCmdExec: native cmdExec already present — skipping loader.",
      );
    }
    return;
  }

  const runtimeConfig = useRuntimeConfig?.() as any;
  const baseUrl =
    runtimeConfig && runtimeConfig.app && runtimeConfig.app.baseURL
      ? String(runtimeConfig.app.baseURL)
      : "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const scriptUrl = `${normalizedBase}/command-executor.js`;

  if (
    document.querySelector(`script[src="${scriptUrl}"]`) ||
    document.querySelector('script[src*="command-executor.js"]')
  ) {
    // Script already present; start polling for injected bridge
    const existingScript =
      document.querySelector(`script[src="${scriptUrl}"]`) ||
      document.querySelector('script[src*="command-executor.js"]');
    if (typeof console !== "undefined" && console.debug) {
      console.debug(
        "loadLegacyCmdExec: command-executor script already included in DOM.",
      );
    }
    // We'll ensure the bridge becomes available
  } else {
    const scriptEl = document.createElement("script");
    scriptEl.src = scriptUrl;
    scriptEl.async = true;
    scriptEl.defer = true;
    scriptEl.type = "text/javascript";
    scriptEl.onload = () => {
      if (typeof console !== "undefined" && console.debug) {
        console.debug(`loadLegacyCmdExec: loaded ${scriptUrl}`);
      }
    };
    scriptEl.onerror = (e) => {
      if (typeof console !== "undefined" && console.warn) {
        console.warn(`loadLegacyCmdExec: failed to load ${scriptUrl}`, e);
      }
    };
    (document.head || document.body || document.documentElement).appendChild(
      scriptEl,
    );
  }

  const MAX_WAIT_MS = 10_000; // 10s polling window
  const INTERVAL_MS = 250;
  let elapsed = 0;
  const checkInterval = setInterval(() => {
    if (bridgeCheck()) {
      clearInterval(checkInterval);
      if (typeof console !== "undefined" && console.debug) {
        try {
          const method = (window as any).cmdExec?.execMethod || "none";
          console.debug(
            "loadLegacyCmdExec: cmdExec bridge detected (execMethod=%s).",
            method,
          );
        } catch {
          console.debug("loadLegacyCmdExec: cmdExec bridge detected.");
        }
      }
      return;
    }
    elapsed += INTERVAL_MS;
    if (elapsed >= MAX_WAIT_MS) {
      clearInterval(checkInterval);
      if (typeof console !== "undefined" && console.warn) {
        console.warn(
          "loadLegacyCmdExec: cmdExec bridge not detected after 10s.",
        );
      }
    }
  }, INTERVAL_MS);
});
