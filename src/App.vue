<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { onMounted } from 'vue'

const telegramStore = useTelegramStore()

onMounted(() => {
  // 初始化Telegram Web App
  telegramStore.initialize()
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Telegram Web App 主题变量 */
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-hint-color: #999999;
  --tg-theme-link-color: #2481cc;
  --tg-theme-button-color: #2481cc;
  --tg-theme-button-text-color: #ffffff;
}

/* 暗色主题 */
@media (prefers-color-scheme: dark) {
  :root {
    --tg-theme-bg-color: #1a1a1a;
    --tg-theme-text-color: #ffffff;
    --tg-theme-hint-color: #aaaaaa;
    --tg-theme-link-color: #64baf0;
    --tg-theme-button-color: #64baf0;
    --tg-theme-button-text-color: #000000;
  }
}

/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

#app {
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--tg-theme-hint-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--tg-theme-text-color);
}
</style>
