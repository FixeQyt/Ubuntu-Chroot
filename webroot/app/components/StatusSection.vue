<template>
  <section class="card">
    <h2 class="title">
      Ubuntu Chroot
      <span
        id="debug-indicator"
        :class="
          debugMode
            ? 'debug-indicator-tiny'
            : 'debug-indicator-tiny debug-indicator-hidden'
        "
        >DEBUG</span
      >
    </h2>

    <div class="row status-row">
      <div class="status-pill">
        <span id="status-dot" :class="statusDotClass" aria-hidden></span>
        <span id="status-text">{{ statusText }}</span>
      </div>
    </div>

    <div class="btn-box card btn-box-spaced">
      <div class="btn-row">
        <button
          id="start-btn"
          class="btn"
          :disabled="startDisabled"
          @click="$emit('start')"
        >
          Start
        </button>
        <button
          id="stop-btn"
          class="btn stop"
          :disabled="stopDisabled"
          @click="$emit('stop')"
        >
          Stop
        </button>
        <button
          id="restart-btn"
          class="btn"
          :disabled="restartDisabled"
          @click="$emit('restart')"
        >
          Restart
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  statusText: string;
  startDisabled: boolean;
  stopDisabled: boolean;
  restartDisabled: boolean;
  debugMode: boolean;
}

const props = defineProps<Props>();

const statusDotClass = computed(() => {
  switch (props.statusText) {
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

defineEmits<{
  start: [];
  stop: [];
  restart: [];
}>();
</script>

<style scoped>
.card {
  background: var(--card);
  border-radius: var(--surface-radius);
  padding: 16px;
  box-shadow: 0 6px 20px rgba(6, 8, 14, 0.06);
  box-sizing: border-box;
  min-width: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.title {
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
}

.debug-indicator-tiny {
  display: inline-block;
  background: #fbbf24;
  color: #92400e;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  margin-left: 8px;
  border-radius: 2px;
  border: 1px solid #d97706;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
  white-space: nowrap;
  vertical-align: text-top;
  flex-shrink: 0;
}

.debug-indicator-hidden {
  display: none;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.status-row {
  align-items: center;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  display: inline-block;
}

.dot-on {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.18);
}

.dot-off {
  background: #ef4444;
  opacity: 0.95;
}

.dot-unknown {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.12);
}

.btn-box {
  background: var(--card);
  border-radius: 10px;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.btn-box-spaced {
  margin-top: 12px;
  padding: 10px;
}

.btn-row {
  display: flex;
  gap: 10px;
}

.btn-row .btn {
  flex: 1;
  text-align: center;
}

.btn-row .btn.stop {
  flex: 1;
}

.btn {
  background: var(--accent);
  color: white;
  border: 0;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: none;
}

.btn.stop {
  background: #dc2626 !important;
}

.btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  transition:
    transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.12s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.15s ease,
    border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  box-shadow: none;
  transform: none;
  will-change: transform, box-shadow;
}

.btn:active,
.btn:focus {
  transform: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.btn:active {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

.btn:not(:focus):not(.btn-pressed):not(.btn-released) {
  -webkit-tap-highlight-color: transparent;
}

.btn[disabled] {
  box-shadow: none !important;
  transform: none !important;
  cursor: not-allowed;
}

.btn[disabled]:hover {
  box-shadow: none !important;
  transform: none !important;
}

.btn.btn-pressed {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  transform: scale(0.97) !important;
}

.btn.btn-released {
  box-shadow: none !important;
  transform: none !important;
}

.btn:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-1px) !important;
}

.btn:not(.btn-pressed):not(.btn-released):not(:hover):not([disabled]) {
  box-shadow: none !important;
  transform: none !important;
}

.btn.stop:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3) !important;
  background: #b91c1c !important;
  transform: translateY(-2px) !important;
}

.btn.stop:not(:hover):not(.btn-pressed):not(.btn-released) {
  box-shadow: none !important;
}

.actions button {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn {
  min-height: 36px;
}

@media (max-width: 719px) {
  .title {
    font-size: 1.05rem;
  }

  .btn-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }

  .btn-row .btn {
    width: 100%;
    min-width: 0;
    padding: 8px 6px;
    font-size: 14px;
  }

  .btn-box {
    padding: 8px;
  }

  .btn-row .btn.stop {
    flex: 1;
  }
}

[data-theme="dark"] .card {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

[data-theme="dark"] .btn-box {
  background: var(--card);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .debug-indicator-tiny {
  background: #f59e0b;
  color: #92400e;
  border-color: #d97706;
}
</style>
