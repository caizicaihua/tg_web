import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Telegram Web App 特定配置
  build: {
    // 确保构建输出适合 Telegram Web App
    target: 'es2015',
    rollupOptions: {
      output: {
        // 确保文件名简洁
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // 开发服务器配置
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
