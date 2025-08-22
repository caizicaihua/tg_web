<template>
  <div class="test-container">
    <TelegramTestPanel />
  </div>
</template>

<script setup lang="ts">
import TelegramTestPanel from '@/components/TelegramTestPanel.vue'
</script>

<style scoped>
.test-container {
  min-height: 100vh;
  background: var(--tg-theme-bg-color, #ffffff);
}
</style>
