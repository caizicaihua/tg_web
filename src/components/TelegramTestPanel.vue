<template>
  <div class="telegram-test-panel">
    <q-card class="test-panel">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">🧪 Telegram Web App 测试面板</div>
        <q-chip :color="isTelegramEnv ? 'positive' : 'warning'" text-color="white" size="sm">
          {{ isTelegramEnv ? '真实环境' : '模拟环境' }}
        </q-chip>
      </q-card-section>

      <q-card-section>
        <q-space vertical>
          <!-- 环境信息 -->
          <q-separator />
          <div class="text-subtitle2 q-mb-sm">环境信息</div>
          
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>运行环境</q-item-label>
                <q-item-label>{{ isTelegramEnv ? 'Telegram 内' : '浏览器' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>平台</q-item-label>
                <q-item-label>{{ webAppInfo.platform }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>版本</q-item-label>
                <q-item-label>{{ webAppInfo.version }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>主题</q-item-label>
                <q-item-label>{{ webAppInfo.colorScheme }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- 用户信息 -->
          <q-separator />
          <div class="text-subtitle2 q-mb-sm">用户信息</div>
          
          <div v-if="user" class="user-info">
            <q-space align="center" justify="center">
              <q-avatar 
                :src="user.photo_url" 
                size="48px"
              />
              <div class="user-details">
                <div class="text-weight-bold">{{ userName }}</div>
                <div class="text-caption">
                  <span class="text-grey">ID: {{ user.id }}</span>
                  <span v-if="user.username" class="text-grey q-ml-sm">@{{ user.username }}</span>
                </div>
              </div>
            </q-space>
            
            <div class="user-tags q-mt-sm">
              <q-chip v-if="user.is_premium" color="warning" text-color="white" size="sm">Premium</q-chip>
              <q-chip color="info" text-color="white" size="sm">{{ user.language_code }}</q-chip>
            </div>
          </div>

          <!-- 功能测试 -->
          <q-separator />
          <div class="text-subtitle2 q-mb-sm">功能测试</div>
          
          <q-space vertical>
            <!-- 主按钮测试 -->
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">主按钮</div>
                <q-space>
                  <q-btn @click="testMainButton('显示主按钮', 'primary')" color="primary" size="sm">
                    显示主按钮
                  </q-btn>
                  <q-btn @click="testMainButton('隐藏主按钮', 'default')" color="grey" size="sm">
                    隐藏主按钮
                  </q-btn>
                  <q-btn @click="testMainButton('设置文本', 'info')" color="info" size="sm">
                    设置文本
                  </q-btn>
                </q-space>
              </q-card-section>
            </q-card>

            <!-- 返回按钮测试 -->
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">返回按钮</div>
                <q-space>
                  <q-btn @click="testBackButton('显示返回按钮')" color="secondary" size="sm">
                    显示返回按钮
                  </q-btn>
                  <q-btn @click="testBackButton('隐藏返回按钮')" color="grey" size="sm">
                    隐藏返回按钮
                  </q-btn>
                </q-space>
              </q-card-section>
            </q-card>

            <!-- 触觉反馈测试 -->
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">触觉反馈</div>
                <q-space>
                  <q-btn @click="testHaptic('light')" color="teal" size="sm">轻触</q-btn>
                  <q-btn @click="testHaptic('medium')" color="teal" size="sm">中等</q-btn>
                  <q-btn @click="testHaptic('heavy')" color="teal" size="sm">重触</q-btn>
                  <q-btn @click="testHaptic('rigid')" color="teal" size="sm">刚性</q-btn>
                  <q-btn @click="testHaptic('soft')" color="teal" size="sm">柔软</q-btn>
                </q-space>
              </q-card-section>
            </q-card>

            <!-- 通知测试 -->
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">通知</div>
                <q-space>
                  <q-btn @click="testNotification('success')" color="positive" size="sm">
                    成功通知
                  </q-btn>
                  <q-btn @click="testNotification('warning')" color="warning" size="sm">
                    警告通知
                  </q-btn>
                  <q-btn @click="testNotification('error')" color="negative" size="sm">
                    错误通知
                  </q-btn>
                </q-space>
              </q-card-section>
            </q-card>

            <!-- 主题测试 -->
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">主题</div>
                <q-space>
                  <q-btn @click="testTheme('light')" color="grey-3" text-color="black" size="sm">
                    浅色主题
                  </q-btn>
                  <q-btn @click="testTheme('dark')" color="dark" size="sm">
                    深色主题
                  </q-btn>
                  <q-btn @click="testTheme('custom')" color="purple" size="sm">
                    自定义主题
                  </q-btn>
                </q-space>
              </q-card-section>
            </q-card>

            <!-- 其他功能 -->
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">其他功能</div>
                <q-space>
                  <q-btn @click="testExpand" color="orange" size="sm">展开</q-btn>
                  <q-btn @click="testClose" color="red" size="sm">关闭</q-btn>
                  <q-btn @click="testAlert" color="blue" size="sm">显示弹窗</q-btn>
                  <q-btn @click="testConfirm" color="indigo" size="sm">确认对话框</q-btn>
                </q-space>
              </q-card-section>
            </q-card>
          </q-space>

          <!-- 日志输出 -->
          <q-separator />
          <div class="text-subtitle2 q-mb-sm">控制台日志</div>
          
          <q-card flat bordered>
            <q-card-section class="q-pa-sm">
              <div class="log-output">
                <div v-for="(log, index) in logs" :key="index" class="log-item">
                  <span class="log-time">{{ log.time }}</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
              </div>
              <q-btn @click="clearLogs" color="grey" size="sm" class="q-mt-sm">
                清空日志
              </q-btn>
            </q-card-section>
          </q-card>
        </q-space>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { isTelegramEnvironment } from '@/utils/telegram-mock'

const telegramStore = useTelegramStore()
const logs = ref<Array<{ time: string; message: string }>>([])

// 计算属性
const isTelegramEnv = computed(() => isTelegramEnvironment())
const user = computed(() => telegramStore.user)
const userName = computed(() => telegramStore.userName)
const webAppInfo = computed(() => ({
  platform: telegramStore.platform || 'web',
  version: telegramStore.version || '6.0',
  colorScheme: telegramStore.theme || 'light'
}))

// 添加日志
function addLog(message: string) {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ time, message })
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

// 清空日志
function clearLogs() {
  logs.value = []
}

// 测试主按钮
function testMainButton(action: string, type: string) {
  addLog(`测试主按钮: ${action}`)
  
  switch (action) {
    case '显示主按钮':
      telegramStore.showMainButton('测试按钮', () => {
        addLog('主按钮被点击')
      })
      break
    case '隐藏主按钮':
      telegramStore.hideMainButton()
      break
    case '设置文本':
      telegramStore.showMainButton('新文本', () => {
        addLog('主按钮被点击')
      })
      break
  }
}

// 测试返回按钮
function testBackButton(action: string) {
  addLog(`测试返回按钮: ${action}`)
  
  if (action === '显示返回按钮') {
    telegramStore.showBackButton(() => {
      addLog('返回按钮被点击')
    })
  } else {
    telegramStore.hideBackButton()
  }
}

// 测试触觉反馈
function testHaptic(style: string) {
  addLog(`测试触觉反馈: ${style}`)
  telegramStore.hapticImpact(style as any)
}

// 测试通知
function testNotification(type: string) {
  addLog(`测试通知: ${type}`)
  telegramStore.showNotification(`这是一个${type}通知`, type as any)
}

// 测试主题
function testTheme(theme: string) {
  addLog(`测试主题: ${theme}`)
  
  if (theme === 'light') {
    telegramStore.setThemeParams({
      bg_color: '#ffffff',
      text_color: '#000000'
    })
  } else if (theme === 'dark') {
    telegramStore.setThemeParams({
      bg_color: '#1a1a1a',
      text_color: '#ffffff'
    })
  } else {
    telegramStore.setThemeParams({
      bg_color: '#ff6b6b',
      text_color: '#ffffff'
    })
  }
}

// 测试展开
function testExpand() {
  addLog('测试展开')
  // 这里可以调用 Telegram Web App 的 expand 方法
}

// 测试关闭
function testClose() {
  addLog('测试关闭')
  telegramStore.closeApp()
}

// 测试弹窗
function testAlert() {
  addLog('测试弹窗')
  telegramStore.showNotification('这是一个测试弹窗', 'success')
}

// 测试确认对话框
function testConfirm() {
  addLog('测试确认对话框')
  // 这里可以调用 Telegram Web App 的 showConfirm 方法
}

onMounted(() => {
  addLog('测试面板已加载')
  addLog(`当前环境: ${isTelegramEnv.value ? 'Telegram' : '浏览器'}`)
})
</script>

<style scoped>
.telegram-test-panel {
  padding: 16px;
}

.test-panel {
  max-width: 800px;
  margin: 0 auto;
}

.user-info {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f9f9f9;
}

.user-details {
  text-align: left;
}

.user-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.log-output {
  max-height: 200px;
  overflow-y: auto;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  font-family: monospace;
  font-size: 12px;
}

.log-item {
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
}

.log-time {
  color: #666;
  min-width: 80px;
}

.log-message {
  color: #333;
}
</style>
