<template>
  <footer class="foot">
    <Icon name="github" size="20" />
    <a href="https://github.com/ravindu644/Ubuntu-Chroot" target="_blank"
      >Ubuntu Chroot</a
    >
    <span class="separator">•</span>
    <a href="https://github.com/ravindu644" target="_blank">ravindu644</a>
  </footer>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";
</script>

<style scoped>
.foot {
  margin-top: auto;
  padding-top: 14px;
  padding-bottom: calc(12px + var(--bottom-inset));
  color: var(--muted);
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.foot a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}

.foot a:hover {
  color: var(--accent);
  text-decoration: underline;
}

.foot .separator {
  color: var(--muted);
  font-weight: 400;
}

@media (max-width: 719px) {
  .foot {
    padding-top: 16px;
    padding-bottom: calc(16px + var(--bottom-inset));
  }
}
</style>
