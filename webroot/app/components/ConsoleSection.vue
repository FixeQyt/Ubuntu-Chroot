<template>
  <section class="card console-card">
    <div class="console-header">
      <span class="console-title">Console</span>
      <button
        id="copy-console"
        class="btn outline small console-copy-btn"
        title="Copy console logs"
        @click="logBuffer.copyLogs()"
      >
        <Icon name="copy" size="16" />
      </button>
    </div>
    <pre id="console" class="console" ref="consoleEl"></pre>
    <div class="console-actions">
      <button
        id="clear-console"
        class="btn outline small"
        @click="logBuffer.clearConsole()"
      >
        Clear
      </button>
      <button
        id="refresh-status"
        class="btn small"
        @click="$emit('refreshStatusManual')"
      >
        Refresh
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Icon from "@/components/Icon.vue";
import useConsole from "@/composables/useConsole";

interface Props {
  logBuffer: ReturnType<typeof useConsole>;
}

const props = defineProps<Props>();

const { logBuffer } = props;

const consoleEl = ref<HTMLElement | null>(null);

onMounted(() => {
  if (logBuffer && logBuffer.consoleRef) {
    logBuffer.consoleRef.value = consoleEl.value;
  } else {
    (logBuffer as any).consoleRef = consoleEl;
  }
});

onUnmounted(() => {
  // Clear the ref value so the composable can detach listeners/cleanup.
  if (logBuffer && logBuffer.consoleRef) {
    logBuffer.consoleRef.value = null;
  }
});

defineEmits<{
  refreshStatusManual: [];
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

.console-card {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  max-height: 100%;
}

.console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.console-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--muted);
}

.console-copy-btn {
  background: transparent;
  border: 1px solid rgba(15, 23, 32, 0.08);
  color: var(--text);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition:
    transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.12s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.15s ease,
    border-color 0.15s ease;
  padding: 0;
  min-height: auto;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  box-shadow: none;
  transform: none;
  will-change: transform, box-shadow;
}

.console-copy-btn:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(15, 23, 32, 0.15);
}

.console-copy-btn:active,
.console-copy-btn:focus {
  background: transparent !important;
  border-color: rgba(15, 23, 32, 0.08) !important;
  transform: none !important;
  outline: none !important;
}

.console-copy-btn.btn-pressed {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  transform: scale(0.96) !important;
  background: transparent !important;
  border-color: rgba(15, 23, 32, 0.08) !important;
}

.console-copy-btn.btn-released {
  box-shadow: none !important;
  transform: none !important;
}

.console-copy-btn:not(:hover):not(.btn-pressed):not(.btn-released) {
  box-shadow: none !important;
  transform: none !important;
}

.console-copy-btn svg {
  width: 16px;
  height: 16px;
}

[data-theme="dark"] .console-copy-btn {
  border-color: rgba(255, 255, 255, 0.08);
  outline: none;
}

[data-theme="dark"]
  .console-copy-btn:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .console-copy-btn:active,
[data-theme="dark"] .console-copy-btn:focus {
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transform: none !important;
  outline: none !important;
}

[data-theme="dark"]
  .console-copy-btn:not(:hover):not(.btn-pressed):not(.btn-released) {
  box-shadow: none !important;
  transform: none !important;
}

.console {
  flex: 1 1 0;
  background: var(--console-bg);
  border-radius: 10px;
  padding: 12px;
  min-height: 0;
  max-height: 100%;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  transform: translateZ(0);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.console-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
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

.btn.small {
  padding: 6px 8px;
  font-size: 13px;
}

.btn.outline {
  background: transparent;
  border: 1px solid rgba(15, 23, 32, 0.08);
  color: var(--text);
  box-shadow: none !important;
}

.btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.console::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.console::-webkit-scrollbar-track {
  background: transparent;
}

.console::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition:
    opacity 0.3s ease,
    background 0.2s ease;
}

.console::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .console::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  transition:
    opacity 0.3s ease,
    background 0.2s ease;
}

[data-theme="dark"] .console::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

[data-theme="dark"] .console::-webkit-scrollbar-corner {
  background: transparent;
}

.console-scrollbar-hidden {
  scrollbar-color: transparent transparent; /* Firefox */
}

.console-scrollbar-hidden::-webkit-scrollbar-thumb {
  background: transparent !important;
  opacity: 0;
}

.console > div {
  margin: 2px 0;
  padding: 2px 0;
}

.console .err {
  color: #ef4444;
  font-weight: 500;
}

.console .warn {
  color: #f59e0b;
  font-weight: 500;
}

.console .success {
  color: #22c55e;
  font-weight: 500;
}

.console .info {
  color: var(--accent);
  font-weight: 500;
}

.console .progress-indicator {
  color: #3b82f6;
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

[data-theme="dark"] .console .err {
  color: #fb7185;
}

[data-theme="dark"] .console .warn {
  color: #fbbf24;
}

[data-theme="dark"] .console .success {
  color: #4ade80;
}

[data-theme="dark"] .console .info {
  color: #60a5fa;
}

[data-theme="dark"] .console .progress-indicator {
  color: #60a5fa;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 8px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.console > div.log-fade-in {
  animation: fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  will-change: opacity, transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

@keyframes chunkFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.console > div.log-chunk-fade {
  animation: chunkFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  will-change: opacity;
  backface-visibility: hidden;
}

.console > div.log-immediate {
  animation: none;
  opacity: 1;
}

.console > div.progress-indicator.log-immediate {
  animation: pulse 1.5s ease-in-out infinite !important;
  opacity: 1;
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

.console-actions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  width: 100%;
}

.console-actions .btn {
  flex: 1;
  min-width: 0;
}

@media (min-width: 720px) {
  .console-card {
    min-height: 300px;
    flex: 1 1 auto;
    overflow: hidden;
  }
}

@media (max-width: 719px) {
  .console {
    min-height: 0;
    overflow: auto;
  }

  .console-card {
    flex: 1 1 auto;
    overflow: hidden;
  }
}

[data-theme="dark"] .card {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

[data-theme="dark"] .btn.outline {
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text);
}
</style>
