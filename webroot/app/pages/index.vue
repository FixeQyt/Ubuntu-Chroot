<template>
  <div class="app">
    <Header
      @openForwardNatPopup="openForwardNatPopup"
      @openHotspotPopup="openHotspotPopup"
      @openSettingsPopup="openSettingsPopup"
    />

    <main class="panel">
      <StatusSection
        :statusText="statusText"
        :startDisabled="startDisabled"
        :stopDisabled="stopDisabled"
        :restartDisabled="restartDisabled"
        @start="start"
        @stop="stop"
        @restart="restart"
      />

      <UserSection
        :users="users"
        :selectedUser="selectedUser"
        :userSelectDisabled="userSelectDisabled"
        :copyLoginDisabled="copyLoginDisabled"
        :runAtBoot="runAtBoot"
        @update:selectedUser="selectedUser = $event"
        @update:runAtBoot="runAtBoot = $event"
        @copyLoginCommand="copyLoginCommand"
      />

      <ConsoleSection
        :consoleRef="consoleRef"
        @copyConsole="copyConsole"
        @clearConsole="clearConsole"
        @refreshStatusManual="refreshStatusManual"
      />
    </main>

    <SettingsPopup
      :postExecScript="postExecScript"
      :debugMode="debugMode"
      :androidOptimize="androidOptimize"
      @close="closeSettingsPopup"
      @update:postExecScript="postExecScript = $event"
      @update:debugMode="debugMode = $event"
      @update:androidOptimize="androidOptimize = $event"
      @savePostExecScript="savePostExecScript"
      @clearPostExecScript="clearPostExecScript"
      @updateChroot="updateChroot"
      @backupChroot="backupChroot"
      @restoreChroot="restoreChroot"
      @uninstallChroot="uninstallChroot"
    />

    <SparseSettingsPopup
      @close="closeSparseSettingsPopup"
      @trimSparseImage="trimSparseImage"
      @resizeSparseImage="resizeSparseImage"
    />

    <HotspotPopup
      :hotspotWarningVisible="hotspotWarningVisible"
      :hotspotIfaces="hotspotIfaces"
      :hotspotIface="hotspotIface"
      :hotspotSsid="hotspotSsid"
      :hotspotPassword="hotspotPassword"
      :hotspotBand="hotspotBand"
      :hotspotChannel="hotspotChannel"
      :hotspotChannels="hotspotChannels"
      @close="closeHotspotPopup"
      @dismissHotspotWarning="dismissHotspotWarning"
      @update:hotspotIface="hotspotIface = $event"
      @update:hotspotSsid="hotspotSsid = $event"
      @update:hotspotPassword="hotspotPassword = $event"
      @update:hotspotBand="hotspotBand = $event"
      @update:hotspotChannel="hotspotChannel = $event"
      @toggleHotspotPassword="toggleHotspotPassword"
      @startHotspot="startHotspot"
      @stopHotspot="stopHotspot"
    />

    <ForwardNatPopup
      :forwardNatIfaces="forwardNatIfaces"
      :forwardNatIface="forwardNatIface"
      @close="closeForwardNatPopup"
      @update:forwardNatIface="forwardNatIface = $event"
      @startForwarding="startForwarding"
      @stopForwarding="stopForwarding"
    />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import useNativeCmd from "@/composables/useNativeCmd";
import useConsole from "@/composables/useConsole";
import { Storage, StateManager } from "@/composables/useStateManager";
import ProgressIndicator from "@/services/progressIndicator";
import Header from "@/components/Header.vue";
import StatusSection from "@/components/StatusSection.vue";
import UserSection from "@/components/UserSection.vue";
import ConsoleSection from "@/components/ConsoleSection.vue";
import SettingsPopup from "@/components/SettingsPopup.vue";
import SparseSettingsPopup from "@/components/SparseSettingsPopup.vue";
import HotspotPopup from "@/components/HotspotPopup.vue";
import ForwardNatPopup from "@/components/ForwardNatPopup.vue";
import Footer from "@/components/Footer.vue";

const CHROOT_DIR = "/data/local/ubuntu-chroot";
const PATH_CHROOT_SH = `${CHROOT_DIR}/chroot.sh`;
const HOTSPOT_SCRIPT = `${CHROOT_DIR}/start-hotspot`;
const FORWARD_NAT_SCRIPT = `${CHROOT_DIR}/forward-nat.sh`;
const OTA_UPDATER = `${CHROOT_DIR}/ota/updater.sh`;
const BOOT_FILE = `${CHROOT_DIR}/boot-service`;
const DOZE_OFF_FILE = `${CHROOT_DIR}/.doze_off`;

const cmd = useNativeCmd();
const consoleApi = useConsole();

const consoleRef = consoleApi.consoleRef;

const statusText = ref<string>("unknown");
const startDisabled = ref<boolean>(true);
const stopDisabled = ref<boolean>(true);
const restartDisabled = ref<boolean>(true);
const userSelectDisabled = ref<boolean>(true);
const copyLoginDisabled = ref<boolean>(true);

const users = ref<string[]>([]);
const selectedUser = ref<string>("root");

const runAtBoot = ref<boolean>(false);
const debugMode = ref<boolean>(StateManager.get("debug"));
const androidOptimize = ref<boolean>(true);

const hotspotWarningVisible = ref<boolean>(true);
const hotspotIfaces = ref<Array<{ value: string; label: string }>>([]);
const hotspotIface = ref<string>("");
const hotspotSsid = ref<string>("");
const hotspotPassword = ref<string>("");
const hotspotBand = ref<string>("2");
const hotspotChannel = ref<string>("6");
const hotspotChannels = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

const forwardNatIfaces = ref<Array<{ value: string; label: string }>>([]);
const forwardNatIface = ref<string>("");

/* Popup refs removed; DOM queries are used instead to control popups. */

const postExecScript = ref<string>("");

const statusDotClass = computed(() => {
  switch (statusText.value) {
    case "running":
      return "dot dot-on";
    case "stopped":
      return "dot dot-off";
    case "starting":
      return "dot dot-on";
    case "stopping":
      return "dot dot-off";
    case "not_found":
      return "dot dot-off";
    default:
      return "dot dot-unknown";
  }
});

function appendConsole(text: string, cls?: string) {
  consoleApi.append(text, cls);
}

async function fetchUsers(silent = false) {
  if (!cmd.isAvailable.value) return;
  try {
    const out = await cmd.runCommandSync(`sh ${PATH_CHROOT_SH} list-users`);
    const list = String(out || "").trim();
    users.value = list ? list.split(",").filter(Boolean) : [];
    const saved = Storage.get("chroot_selected_user");
    if (saved && users.value.includes(saved)) selectedUser.value = saved;
    if (!silent)
      appendConsole(
        `Found ${users.value.length} regular user(s) in chroot`,
        "info",
      );
  } catch (e: any) {
    if (!silent)
      appendConsole(`Could not fetch users from chroot: ${e.message}`, "warn");
    users.value = [];
  }
}

async function copyLoginCommand() {
  const user = selectedUser.value || "root";
  Storage.set("chroot_selected_user", user);

  let chrootCmd = "ubuntu-chroot";
  try {
    const check = await cmd.runCommandSync(
      'command -v ubuntu-chroot 2>/dev/null || echo ""',
    );
    if (!String(check || "").trim()) {
      chrootCmd = `sh ${PATH_CHROOT_SH}`;
    }
  } catch {
    chrootCmd = `sh ${PATH_CHROOT_SH}`;
  }

  const loginCommand = `su -c "${chrootCmd} start ${user} -s"`;
  try {
    await navigator.clipboard.writeText(loginCommand);
    appendConsole(`Login command for user '${user}' copied to clipboard`);
  } catch {
    appendConsole(loginCommand);
  }
}

async function checkRootAccess(silent = false) {
  if (!cmd.isAvailable.value) {
    if (!silent)
      appendConsole(
        "No root bridge detected — running offline. Actions disabled.",
      );
    startDisabled.value = true;
    stopDisabled.value = true;
    restartDisabled.value = true;
    userSelectDisabled.value = true;
    copyLoginDisabled.value = true;
    return false;
  }
  try {
    await cmd.runCommandSync('echo "test"');
    if (!silent) appendConsole("Root access available", "info");
    return true;
  } catch (e: any) {
    if (!silent)
      appendConsole(
        `Failed to detect root execution method: ${e.message}`,
        "err",
      );
    return false;
  }
}

async function refreshStatus() {
  const root = await checkRootAccess(true);
  if (!root) {
    statusText.value = "unknown";
    startDisabled.value = true;
    stopDisabled.value = true;
    restartDisabled.value = true;
    userSelectDisabled.value = true;
    copyLoginDisabled.value = true;
    return;
  }

  try {
    const out = await cmd.runCommandSync(`sh ${PATH_CHROOT_SH} status`);
    appendConsole(`[DEBUG] raw status output: ${String(out || "")}`, "debug");
    const s = String(out || "");
    const running = /Status:\s*RUNNING/i.test(s);

    if (running) {
      statusText.value = "running";
      startDisabled.value = true;
      stopDisabled.value = false;
      restartDisabled.value = false;
      userSelectDisabled.value = false;
      copyLoginDisabled.value = false;
      appendConsole("[DEBUG] UI set to running", "debug");
    } else {
      const chrootExists = !(String(s || "").trim() === "");
      if (!chrootExists) {
        statusText.value = "not_found";
        startDisabled.value = true;
        stopDisabled.value = true;
        restartDisabled.value = true;
        userSelectDisabled.value = true;
        copyLoginDisabled.value = true;
        appendConsole("[DEBUG] UI set to not_found", "debug");
      } else {
        statusText.value = "stopped";
        startDisabled.value = false;
        stopDisabled.value = true;
        restartDisabled.value = true;
        userSelectDisabled.value = true;
        copyLoginDisabled.value = true;
        appendConsole("[DEBUG] UI set to stopped", "debug");
      }
    }
  } catch (e: any) {
    statusText.value = "unknown";
    startDisabled.value = true;
    stopDisabled.value = true;
    restartDisabled.value = true;
    userSelectDisabled.value = true;
    copyLoginDisabled.value = true;
    appendConsole(`Failed to get status: ${e.message}`, "warn");
  }
}

async function refreshStatusManual() {
  try {
    const rootOK = await checkRootAccess(true);
    if (rootOK) {
      await refreshStatus();
      await fetchUsers(true);
    }
    await readBootFile(true);
    await readDozeOffFile(true);
  } catch (e) {
    appendConsole("Refresh failed", "warn");
  }
}

async function doAction(action: "start" | "stop" | "restart") {
  if (!cmd.isAvailable.value) {
    appendConsole("Cannot execute commands: backend unavailable", "err");
    return;
  }

  await consoleApi.scrollToBottom({ behavior: "smooth", waitMs: 200 });
  const actionText =
    action === "start"
      ? "Starting chroot"
      : action === "stop"
        ? "Stopping chroot"
        : "Restarting chroot";
  const progress = ProgressIndicator.create(
    actionText,
    "dots",
    consoleRef.value || document.getElementById("console"),
  );

  try {
    const cmdStr = `sh ${PATH_CHROOT_SH} ${action} --no-shell`;
    const result = await cmd.runCommandAsyncPromise(cmdStr, {
      asRoot: true,
      debug: debugMode.value,
    });
    if (result.success) {
      appendConsole(`✓ ${action} completed successfully`, "success");
      await refreshStatus();
    } else {
      appendConsole(
        `✗ ${action} failed: ${result.error || "Unknown error"}`,
        "err",
      );
    }
  } catch (e: any) {
    appendConsole(`✗ ${action} failed: ${e?.message || String(e)}`, "err");
  } finally {
    ProgressIndicator.remove(progress);
  }
}

async function start() {
  await doAction("start");
}
async function stop() {
  await doAction("stop");
}
async function restart() {
  await doAction("restart");
}

async function readBootFile(silent = false) {
  try {
    const out = await cmd.runCommandSync(
      `cat ${BOOT_FILE} 2>/dev/null || echo 0`,
    );
    runAtBoot.value = String(out || "").trim() === "1";
    if (!silent)
      appendConsole(
        `Run-at-boot: ${runAtBoot.value ? "enabled" : "disabled"}`,
        "info",
      );
  } catch {
    runAtBoot.value = false;
  }
}

async function writeBootFile() {
  try {
    await cmd.runCommandSync(
      `mkdir -p ${CHROOT_DIR} && echo ${runAtBoot.value ? 1 : 0} > ${BOOT_FILE}`,
    );
    appendConsole(
      `Run-at-boot ${runAtBoot.value ? "enabled" : "disabled"}`,
      "success",
    );
  } catch (e: any) {
    appendConsole(`✗ Failed to set run-at-boot: ${e.message}`, "err");
    await readBootFile(true);
  }
}

function toggleBoot() {
  writeBootFile();
}

async function readDozeOffFile(silent = false) {
  try {
    const out = await cmd.runCommandSync(
      `cat ${DOZE_OFF_FILE} 2>/dev/null || echo 1`,
    );
    androidOptimize.value = String(out || "").trim() === "1";
    if (!silent)
      appendConsole(
        `Android optimizations: ${androidOptimize.value ? "enabled" : "disabled"}`,
        "info",
      );
  } catch {
    androidOptimize.value = true;
  }
}

async function writeDozeOffFile() {
  try {
    await cmd.runCommandSync(
      `mkdir -p ${CHROOT_DIR} && echo ${androidOptimize.value ? 1 : 0} > ${DOZE_OFF_FILE}`,
    );
    appendConsole(
      `Android optimizations ${androidOptimize.value ? "enabled" : "disabled"}`,
      "success",
    );
  } catch (e: any) {
    appendConsole(`✗ Failed to set Android optimizations: ${e.message}`, "err");
    await readDozeOffFile(true);
  }
}

async function loadPostExecScript() {
  try {
    const out = await cmd.runCommandSync(
      `cat ${CHROOT_DIR}/post_exec.sh 2>/dev/null || echo ''`,
    );
    postExecScript.value = String(out || "").trim();
  } catch (e) {
    appendConsole(`Failed to load post-exec script: ${String(e)}`, "warn");
    postExecScript.value = "";
  }
}

async function savePostExecScript() {
  try {
    // encode as base64 safely
    const utf8 = new TextEncoder().encode(postExecScript.value || "");
    let binary = "";
    for (let i = 0; i < utf8.length; i += 8192) {
      const slice = utf8.subarray(i, i + 8192);
      binary += String.fromCharCode.apply(null, Array.from(slice));
    }
    const base64 = btoa(binary);
    await cmd.runCommandSync(
      `echo '${base64}' | base64 -d > ${CHROOT_DIR}/post_exec.sh`,
    );
    await cmd.runCommandSync(`chmod 755 ${CHROOT_DIR}/post_exec.sh`);
    appendConsole("Post-exec script saved successfully", "success");
  } catch (e: any) {
    appendConsole(`Failed to save post-exec script: ${e.message}`, "err");
  }
}

async function clearPostExecScript() {
  postExecScript.value = "";
  try {
    await cmd.runCommandSync(`echo '' > ${CHROOT_DIR}/post_exec.sh`);
    appendConsole("Post-exec script cleared successfully", "info");
  } catch (e: any) {
    appendConsole(`Failed to clear post-exec script: ${e.message}`, "err");
  }
}

function openHotspotPopup() {
  const el = document.getElementById("hotspot-popup");
  if (el) el.classList.add("active");
}
function closeHotspotPopup() {
  const el = document.getElementById("hotspot-popup");
  if (el) el.classList.remove("active");
}
function startHotspot() {
  if (
    (window as any).HotspotFeature &&
    (window as any).HotspotFeature.startHotspot
  )
    (window as any).HotspotFeature.startHotspot();
}
function stopHotspot() {
  if (
    (window as any).HotspotFeature &&
    (window as any).HotspotFeature.stopHotspot
  )
    (window as any).HotspotFeature.stopHotspot();
}
function dismissHotspotWarning() {
  hotspotWarningVisible.value = false;
}

function openForwardNatPopup() {
  const el = document.getElementById("forward-nat-popup");
  if (el) el.classList.add("active");
}
function closeForwardNatPopup() {
  const el = document.getElementById("forward-nat-popup");
  if (el) el.classList.remove("active");
}
function startForwarding() {
  if (
    (window as any).ForwardNatFeature &&
    (window as any).ForwardNatFeature.startForwarding
  )
    (window as any).ForwardNatFeature.startForwarding();
}
function stopForwarding() {
  if (
    (window as any).ForwardNatFeature &&
    (window as any).ForwardNatFeature.stopForwarding
  )
    (window as any).ForwardNatFeature.stopForwarding();
}

async function backupChroot() {
  if (
    (window as any).BackupRestoreFeature &&
    (window as any).BackupRestoreFeature.backupChroot
  ) {
    await (window as any).BackupRestoreFeature.backupChroot();
  }
}
async function restoreChroot() {
  if (
    (window as any).BackupRestoreFeature &&
    (window as any).BackupRestoreFeature.restoreChroot
  ) {
    await (window as any).BackupRestoreFeature.restoreChroot();
  }
}
async function uninstallChroot() {
  if (
    (window as any).UninstallFeature &&
    (window as any).UninstallFeature.uninstallChroot
  ) {
    await (window as any).UninstallFeature.uninstallChroot();
  }
}

async function trimSparseImage() {
  if (
    (window as any).ResizeFeature &&
    (window as any).ResizeFeature.trimSparseImage
  ) {
    await (window as any).ResizeFeature.trimSparseImage();
  }
}
async function resizeSparseImage() {
  if (
    (window as any).ResizeFeature &&
    (window as any).ResizeFeature.resizeSparseImage
  ) {
    await (window as any).ResizeFeature.resizeSparseImage();
  }
}

async function updateChroot() {
  if (!(await checkRootAccess(true))) {
    appendConsole("Cannot update chroot: root access not available", "err");
    return;
  }

  const confirmed = confirm(
    "Update Chroot Environment",
    "This will apply any available updates to the chroot environment.\n\nThe chroot will be started if it's not running. Continue?",
    "Update",
    "Cancel",
  );

  if (!confirmed) return;

  closeSettingsPopup();

  statusText.value = "updating";

  try {
    if (statusText.value !== "running") {
      await start();
      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const cmdStr = `sh ${OTA_UPDATER}`;
    const result = await cmd.runCommandAsyncPromise(cmdStr, {
      asRoot: true,
      debug: debugMode.value,
    });

    if (result.success) {
      appendConsole("✓ Chroot update completed successfully", "success");

      await restart();

      appendConsole("━━━ Update Complete ━━━", "success");
    } else {
      appendConsole("✗ Chroot update failed", "err");
    }
  } catch (e: any) {
    appendConsole(`✗ Update failed: ${e?.message || String(e)}`, "err");
  } finally {
    await refreshStatus();
  }
}

function toggleHotspotPassword() {
  const el = document.getElementById(
    "hotspot-password",
  ) as HTMLInputElement | null;
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
}

function openSettingsPopup() {
  const el = document.getElementById("settings-popup");
  if (el) el.classList.add("active");
  loadPostExecScript().catch(() => {});
}

function closeSettingsPopup() {
  const el = document.getElementById("settings-popup");
  if (el) el.classList.remove("active");
}

function openSparseSettingsPopup() {
  const el = document.getElementById("sparse-settings-popup");
  if (el) el.classList.add("active");
}
function closeSparseSettingsPopup() {
  const el = document.getElementById("sparse-settings-popup");
  if (el) el.classList.remove("active");
}

function copyConsole() {
  consoleApi.copyLogs();
}
function clearConsole() {
  consoleApi.clearConsole();
}

onMounted(async () => {
  // bind & load console now handled by composable
  // DEBUG: Report native bridge availability and overlay count at startup
  try {
    appendConsole(
      `DEBUG: cmd.available=${cmd.isAvailable.value}, execMethod=${cmd.execMethod.value}`,
      "debug",
    );
  } catch (e) {
    console.debug("DEBUG: cmd status check failed", e);
  }
  try {
    const overlayCount = document.querySelectorAll(
      ".popup-overlay.active",
    ).length;
    appendConsole(`DEBUG: popup-overlay active count=${overlayCount}`, "debug");
  } catch (e) {
    // best-effort only
  }

  const rootOK = await checkRootAccess();
  if (rootOK) {
    await refreshStatus();
    await fetchUsers();
  }
  await readBootFile(true).catch(() => {});
  await readDozeOffFile(true).catch(() => {});

  // pre-fetch hotspot & forward-nat interfaces (legacy feature modules may provide)
  setTimeout(() => {
    if (
      (window as any).HotspotFeature &&
      (window as any).HotspotFeature.fetchInterfaces
    ) {
      (window as any).HotspotFeature.fetchInterfaces(false, true).catch(
        () => {},
      );
    }
    if (
      (window as any).ForwardNatFeature &&
      (window as any).ForwardNatFeature.fetchInterfaces
    ) {
      (window as any).ForwardNatFeature.fetchInterfaces(false, true).catch(
        () => {},
      );
    }
  }, 250);
});

watch(
  () => cmd.isAvailable.value,
  async (avail) => {
    // When the native bridge becomes available (injected later by KernelSU),
    // try re-checking root access and refresh status & users.
    if (!avail) return;
    try {
      const rootOK = await checkRootAccess();
      if (rootOK) {
        await refreshStatus();
        await fetchUsers();
      }
      // Refresh boot & doze toggles (silent)
      await readBootFile(true).catch(() => {});
      await readDozeOffFile(true).catch(() => {});
    } catch (e) {
      appendConsole(`Delayed root check failed: ${String(e)}`, "warn");
    }
  },
);

watch(debugMode, (val) => {
  StateManager.set("debug", val);
  appendConsole(val ? "Debug mode enabled" : "Debug mode disabled", "info");
});

watch(androidOptimize, (val) => {
  writeDozeOffFile();
});
</script>

<style scoped></style>
