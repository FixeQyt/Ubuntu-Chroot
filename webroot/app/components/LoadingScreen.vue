<template>
  <div class="loading-screen">
    <div class="loading-dots">
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  background: #e95420;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.loading-screen.hidden {
  opacity: 0;
  pointer-events: none;
  display: none;
}

[data-theme="dark"] .loading-screen {
  background: #0f0f0f;
}

.loading-dots {
  display: flex;
  gap: 12px;
}

.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 15%;
  background: white;
  opacity: 0.3;
  animation: dotFill 3.75s infinite;
}

.loading-dot:nth-child(1) {
  animation-delay: 0s;
}
.loading-dot:nth-child(2) {
  animation-delay: 0.75s;
}
.loading-dot:nth-child(3) {
  animation-delay: 1.5s;
}
.loading-dot:nth-child(4) {
  animation-delay: 2.25s;
}
.loading-dot:nth-child(5) {
  animation-delay: 3s;
}

@keyframes dotFill {
  0%,
  20.1%,
  100% {
    opacity: 0.3;
  }
  0.1%,
  20% {
    opacity: 1;
  }
}
</style>
