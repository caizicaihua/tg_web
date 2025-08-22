<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { QCard, QBtn, QAvatar, QChip, QSeparator, QIcon, QSpace } from 'quasar'

const telegramStore = useTelegramStore()
const loading = ref(true)

onMounted(() => {
  // 初始化Telegram Web App
  telegramStore.initialize()
  
  // 显示主按钮
  telegramStore.showMainButton('设置', () => {
    telegramStore.hapticImpact('medium')
    telegramStore.showNotification('设置功能开发中...', 'success')
  })
  
  loading.value = false
})
</script>

<template>
  <div class="home-container">
    <q-card class="main-card">
      <div class="q-card__section q-card__section--h">
        <div class="row items-center justify-between">
          <div class="text-h6">Telegram Web App</div>
          <q-btn round flat icon="close" @click="telegramStore.closeApp" />
        </div>
      </div>
      
      <div v-if="loading" class="loading">
        <span>正在加载...</span>
      </div>
      
      <div v-else>
        <!-- 用户信息 -->
        <div v-if="telegramStore.user" class="user-info">
          <q-space align="center" justify="center">
            <q-avatar 
              v-if="telegramStore.user.photo_url"
              :src="telegramStore.user.photo_url" 
              size="56px"
            />
            <q-avatar v-else size="56px">
              <q-icon name="person" />
            </q-avatar>
            <div class="user-details">
              <span class="text-bold">{{ telegramStore.userName }}</span>
              <div v-if="telegramStore.user.username" class="username">
                <span class="text-grey">@{{ telegramStore.user.username }}</span>
              </div>
            </div>
          </q-space>
          <div class="user-tags">
            <q-chip v-if="telegramStore.isPremium" color="warning" text-color="white" size="sm">Premium</q-chip>
            <q-chip color="info" text-color="white" size="sm">ID: {{ telegramStore.user.id }}</q-chip>
          </div>
        </div>
        <q-separator />
        <!-- 聊天信息 -->
        <div v-if="telegramStore.chat" class="chat-info">
          <span class="text-bold">聊天信息</span>
          <div class="chat-details">
            <span class="text-grey">类型: {{ telegramStore.chat.type }}</span>
            <span v-if="telegramStore.chat.title" class="text-grey">标题: {{ telegramStore.chat.title }}</span>
          </div>
        </div>
        <q-separator />
        <!-- 启动参数 -->
        <div v-if="telegramStore.startParam" class="start-param">
          <span class="text-bold">启动参数</span>
          <div class="param-value">
            <span class="text-grey">{{ telegramStore.startParam }}</span>
          </div>
        </div>
        <q-separator />
        <!-- 平台信息 -->
        <div class="platform-info">
          <span class="text-bold">平台信息</span>
          <div class="platform-details">
            <span class="text-grey">平台: {{ telegramStore.platform }}</span>
            <span class="text-grey">版本: {{ telegramStore.version }}</span>
            <span class="text-grey">主题: {{ telegramStore.theme }}</span>
          </div>
        </div>
        <q-separator />
        <!-- 功能按钮 -->
        <div class="actions">
          <q-space vertical>
            <q-btn color="primary" unelevated class="q-mb-sm" @click="telegramStore.hapticImpact('medium')" label="触觉反馈" />
            <q-btn color="info" unelevated class="q-mb-sm" @click="telegramStore.showNotification('这是一条测试消息', 'success')" label="显示通知" />
            <q-btn color="warning" unelevated class="q-mb-sm" @click="telegramStore.showBackButton(() => telegramStore.hideBackButton())" label="显示返回按钮" />
          </q-space>
        </div>
      </div>
  </q-card>
  </div>
</template>

<style scoped>
.home-container {
  padding: 16px;
  min-height: 100vh;
  background: var(--tg-theme-bg-color, #ffffff);
}

.main-card {
  max-width: 600px;
  margin: 0 auto;
  box-shadow: var(--q-shadow-2);
}

.loading {
  text-align: center;
  padding: 40px 0;
}

.user-info {
  text-align: center;
  padding: 20px 0;
}

.user-details {
  text-align: left;
}

.username {
  margin-top: 4px;
}

.user-tags {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.chat-info,
.start-param,
.platform-info {
  padding: 16px 0;
}

.chat-details,
.param-value,
.platform-details {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.actions {
  padding: 16px 0;
}
</style>
