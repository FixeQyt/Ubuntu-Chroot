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
/* Styles are global */
</style>
