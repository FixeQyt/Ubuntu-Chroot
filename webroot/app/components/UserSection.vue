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

<style scoped></style>
