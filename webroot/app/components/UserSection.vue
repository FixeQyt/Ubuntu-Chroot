<template>
  <div class="form-group-spaced">
    <div class="form-row">
      <div class="form-row-inline">
        <label for="user-select" class="row-label row-label-no-margin"
          >User:</label
        >
        <select
          id="user-select"
          class="user-select"
          :value="selectedUser"
          :disabled="userSelectDisabled"
          @change="$emit('update:selectedUser', $event.target.value)"
        >
          <option value="root">root</option>
          <option v-for="u in users" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>
      <button
        id="copy-login"
        class="btn outline small"
        title="Copy login command"
        :disabled="copyLoginDisabled"
        @click="$emit('copyLoginCommand')"
      >
        Copy login command
      </button>
    </div>

    <div class="form-row">
      <label class="row-label row-label-no-margin">Run at boot:</label>
      <label class="toggle-inline">
        <input
          id="boot-toggle"
          type="checkbox"
          :checked="runAtBoot"
          @change="
            $emit(
              'update:runAtBoot',
              ($event.target as HTMLInputElement).checked,
            )
          "
        />
        <span>Enable</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  users: string[];
  selectedUser: string;
  userSelectDisabled: boolean;
  copyLoginDisabled: boolean;
  runAtBoot: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  "update:selectedUser": [value: string];
  "update:runAtBoot": [value: boolean];
  copyLoginCommand: [];
}>();
</script>

<style scoped>
.form-group-spaced {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.form-row-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-label {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

.row-label-no-margin {
  margin: 0;
}

.user-select {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  background: var(--card);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.user-select:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.user-select:hover:not(:disabled) {
  border-color: rgba(0, 0, 0, 0.15);
}

.user-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .user-select {
  border-color: rgba(255, 255, 255, 0.08);
  background: var(--card);
}

[data-theme="dark"] .user-select:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .user-select:disabled {
  background: rgba(255, 255, 255, 0.03);
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

.toggle-inline {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

[data-theme="dark"] .btn.outline {
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text);
}
</style>
