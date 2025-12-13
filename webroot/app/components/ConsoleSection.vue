<template>
  <section class="card console-card">
    <div class="console-header">
      <span class="console-title">Console</span>
      <button
        id="copy-console"
        class="btn outline small console-copy-btn"
        title="Copy console logs"
        @click="$emit('copyConsole')"
      >
        <Icon name="copy" size="16" />
      </button>
    </div>
    <pre id="console" class="console" ref="consoleRef"></pre>
    <div class="console-actions">
      <button
        id="clear-console"
        class="btn outline small"
        @click="$emit('clearConsole')"
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
import { ref } from "vue";
import Icon from "@/components/Icon.vue";

interface Props {
  consoleRef: any;
}

const props = defineProps<Props>();

defineEmits<{
  copyConsole: [];
  clearConsole: [];
  refreshStatusManual: [];
}>();
</script>

<style scoped></style>
