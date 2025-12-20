<template>
  <div class="not-found-page">
    <div class="error-container">
      <div class="icon-container">
        <Icon name="warning" size="64" class="error-icon" />
      </div>
      <h1>Chroot Environment Not Found</h1>
      <p>The Ubuntu chroot environment was not found on your device.</p>
      <p>
        This could mean the module was not properly installed or the files were
        removed.
      </p>
      <div class="actions">
        <button class="retry-btn" @click="retry">Retry Check</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";

const emit = defineEmits(["retry"]);

const retry = () => {
  emit("retry");
};
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
  animation: fadeIn 0.5s ease-out;
}

.error-container {
  background: rgba(42, 42, 42, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  text-align: center;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.6s ease-out;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ff6b6b;
  animation: pulse 2s infinite;
}

h1 {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

p {
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.actions {
  margin-top: 2rem;
}

.retry-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.retry-btn:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
