<template>
  <div v-if="visible" class="popup-overlay active" @click="$emit('cancel')">
    <div class="popup-content" @click.stop>
      <div class="popup-header">
        <h3>Update Chroot Environment</h3>
        <button class="close-btn" title="Close" @click="$emit('cancel')">
          ×
        </button>
      </div>
      <div class="popup-body">
        <p>This will apply any available updates to the chroot environment.</p>
        <p>The chroot will be started if it's not running. Continue?</p>
        <div class="script-actions">
          <button class="btn" @click="$emit('confirm')">Yes</button>
          <button class="btn" @click="$emit('cancel')">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<style scoped>
/* Styles are global for popups */
</style>
