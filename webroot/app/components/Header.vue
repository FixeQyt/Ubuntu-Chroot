<template>
  <header class="top">
    <div class="brand">
      <img
        src="/assets/logo.png"
        alt="Ubuntu Chroot Manager"
        class="header-logo"
      />
    </div>
    <div class="controls">
      <button
        id="forward-nat-btn"
        class="theme-btn"
        title="Forward the Chroot Traffic to any interface"
        @click="$emit('openForwardNatPopup')"
      >
        <Icon name="forward-nat" />
      </button>
      <button
        id="hotspot-btn"
        class="theme-btn"
        title="Hotspot"
        @click="$emit('openHotspotPopup')"
      >
        <Icon name="hotspot" />
      </button>
      <button
        id="settings-btn"
        class="theme-btn"
        title="Options"
        @click="
          onBeforeOpenSettings?.();
          $emit('openSettingsPopup');
        "
      >
        <Icon name="settings" />
      </button>
      <button
        id="theme-toggle"
        class="theme-btn"
        :aria-pressed="isDark"
        title="Toggle theme"
        @click="toggleTheme"
      >
        <Icon name="sun" class="icon icon-sun" />
        <Icon name="moon" class="icon icon-moon" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Icon from "@/components/Icon.vue";

interface Props {
  onBeforeOpenSettings?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  onBeforeOpenSettings: undefined,
});

/**
 * Theme handling:
 * - Detects system preference and localStorage value on mount
 * - Uses data-theme attribute on <html> to switch
 * - Persists choice in localStorage under 'chroot_theme'
 */
const isDark = ref(false);

onMounted(() => {
  try {
    // Check localStorage first, fallback to system preference
    const stored = localStorage.getItem("chroot_theme");
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;

    isDark.value = stored === "dark" ? true : !stored && prefersDark;
    document.documentElement.setAttribute(
      "data-theme",
      isDark.value ? "dark" : "",
    );
  } catch (e) {
    // Keep default (light) on error
  }
});

watch(isDark, (val) => {
  try {
    localStorage.setItem("chroot_theme", val ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", val ? "dark" : "");
  } catch (e) {
    // ignore storage failures
  }
});

function toggleTheme() {
  isDark.value = !isDark.value;
}
</script>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: calc(var(--top-inset) + 8px) 12px 8px;
  background: var(--bg);
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.brand {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
}

.controls {
  flex: 0 0 auto;
}

.header-logo {
  height: 32px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

[data-theme="dark"] .header-logo {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5)) brightness(1.2)
    contrast(1.1);
}

.theme-btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(15, 23, 32, 0.1);
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--text);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: none !important;
  transition: box-shadow 0.15s ease;
}

.theme-btn .icon {
  opacity: 1;
  transition:
    transform 0.18s,
    opacity 0.18s;
}

.theme-btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08) !important;
}

.theme-btn:not(:focus) {
  box-shadow: none !important;
}

.theme-btn:active {
  box-shadow: none !important;
}

:root .icon-moon {
  display: none;
}

[data-theme="dark"] .icon-moon {
  display: inline-block;
}

[data-theme="dark"] .icon-sun {
  display: none;
}

.theme-btn svg {
  display: block;
  width: 18px;
  height: 18px;
}

[data-theme="dark"] .theme-btn {
  border-color: rgba(255, 255, 255, 0.08);
}

.top {
  border-bottom-color: rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .top {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

@media (max-width: 719px) {
  .top .controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}
</style>
