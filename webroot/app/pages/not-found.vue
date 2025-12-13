<template>
  <div class="not-found-page">
    <div class="error-container">
      <h1>Chroot Environment Not Found</h1>
      <p>The Ubuntu chroot environment was not found on your device.</p>
      <p>
        This could mean the module was not properly installed or the files were
        removed.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
}

.error-container {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  text-align: center;
  color: #ffffff;
}

h1 {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
}

.error-details p {
  color: #cccccc;
}
</style>
