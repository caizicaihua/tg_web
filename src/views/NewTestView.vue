<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 页面标题 -->
      <div class="col-12">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">🧪 新测试页面</div>
            <div class="text-subtitle2">测试各种功能和组件</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 环境信息 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">🌍 环境信息</div>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>当前时间</q-item-label>
                  <q-item-label caption>{{ currentTime }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>用户代理</q-item-label>
                  <q-item-label caption>{{ userAgent }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>屏幕尺寸</q-item-label>
                  <q-item-label caption>{{ screenSize }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Telegram 环境</q-item-label>
                  <q-item-label caption>
                    <q-chip :color="isTelegramEnv ? 'positive' : 'negative'" text-color="white">
                      {{ isTelegramEnv ? '是' : '否' }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- 功能测试 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">🔧 功能测试</div>
            <div class="q-gutter-sm">
              <q-btn 
                color="primary" 
                icon="notifications" 
                label="测试通知"
                @click="testNotification"
              />
              <q-btn 
                color="secondary" 
                icon="vibration" 
                label="触觉反馈"
                @click="testHaptic"
              />
              <q-btn 
                color="accent" 
                icon="palette" 
                label="切换主题"
                @click="toggleTheme"
              />
              <q-btn 
                color="warning" 
                icon="refresh" 
                label="刷新数据"
                @click="refreshData"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 组件测试 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">🧩 组件测试</div>
            
            <!-- 表单测试 -->
            <div class="q-mb-md">
              <q-input 
                v-model="testForm.name" 
                label="姓名" 
                outlined 
                class="q-mb-sm"
              />
              <q-input 
                v-model="testForm.email" 
                label="邮箱" 
                type="email" 
                outlined 
                class="q-mb-sm"
              />
              <q-select 
                v-model="testForm.category" 
                :options="categories" 
                label="分类" 
                outlined 
                class="q-mb-sm"
              />
              <q-btn 
                color="primary" 
                label="提交表单" 
                @click="submitForm"
              />
            </div>

            <!-- 列表测试 -->
            <div class="q-mb-md">
              <q-list bordered separator>
                <q-item v-for="item in testList" :key="item.id" clickable v-ripple>
                  <q-item-section avatar>
                    <q-avatar :color="item.color" text-color="white">
                      {{ item.icon }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn 
                      flat 
                      round 
                      color="primary" 
                      icon="edit"
                      @click="editItem(item)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- 对话框测试 -->
            <div class="q-gutter-sm">
              <q-btn 
                color="info" 
                label="显示对话框" 
                @click="showDialog = true"
              />
              <q-btn 
                color="warning" 
                label="显示确认框" 
                @click="showConfirm"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 性能测试 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">⚡ 性能测试</div>
            <div class="q-gutter-sm">
              <q-btn 
                color="deep-purple" 
                label="生成大量数据" 
                @click="generateData"
                :loading="generating"
              />
              <q-btn 
                color="teal" 
                label="测试动画" 
                @click="testAnimation"
              />
              <q-btn 
                color="orange" 
                label="内存测试" 
                @click="testMemory"
              />
            </div>
            <div v-if="performanceData" class="q-mt-md">
              <q-linear-progress 
                :value="performanceData.progress" 
                color="primary" 
                class="q-mb-sm"
              />
              <div class="text-caption">
                进度: {{ Math.round(performanceData.progress * 100) }}%
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 网络测试 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">🌐 网络测试</div>
            <div class="q-gutter-sm">
              <q-btn 
                color="blue" 
                label="测试网络连接" 
                @click="testNetwork"
                :loading="networkTesting"
              />
              <q-btn 
                color="green" 
                label="获取用户信息" 
                @click="getUserInfo"
              />
              <q-btn 
                color="purple" 
                label="测试 API" 
                @click="testAPI"
              />
            </div>
            <div v-if="networkResult" class="q-mt-md">
              <q-chip :color="networkResult.success ? 'positive' : 'negative'" text-color="white">
                {{ networkResult.message }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 日志输出 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">📝 测试日志</div>
            <q-scroll-area style="height: 200px">
              <div class="q-pa-sm">
                <div 
                  v-for="(log, index) in testLogs" 
                  :key="index" 
                  class="log-item q-mb-xs"
                >
                  <span class="text-caption text-grey">{{ log.time }}</span>
                  <span :class="log.type === 'error' ? 'text-negative' : 'text-primary'">
                    {{ log.message }}
                  </span>
                </div>
              </div>
            </q-scroll-area>
            <div class="q-mt-sm">
              <q-btn 
                flat 
                color="grey" 
                label="清空日志" 
                @click="clearLogs"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 对话框 -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">测试对话框</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          这是一个测试对话框，用于验证对话框组件是否正常工作。
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat label="确定" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useTelegramStore } from '@/stores/telegram'

const $q = useQuasar()
const telegramStore = useTelegramStore()

// 响应式数据
const currentTime = ref('')
const userAgent = ref('')
const screenSize = ref('')
const isTelegramEnv = ref(false)
const showDialog = ref(false)
const generating = ref(false)
const networkTesting = ref(false)
interface PerformanceData {
  progress: number
}

interface NetworkResult {
  success: boolean
  message: string
}

interface TestLog {
  time: string
  message: string
  type: 'info' | 'error'
}

const performanceData = ref<PerformanceData | null>(null)
const networkResult = ref<NetworkResult | null>(null)
const testLogs = ref<TestLog[]>([])

// 表单数据
const testForm = ref({
  name: '',
  email: '',
  category: null
})

const categories = [
  '技术', '设计', '产品', '运营', '其他'
]

// 测试列表
const testList = ref([
  {
    id: 1,
    title: '测试项目 1',
    description: '这是一个测试项目',
    icon: '🚀',
    color: 'primary'
  },
  {
    id: 2,
    title: '测试项目 2',
    description: '另一个测试项目',
    icon: '⚡',
    color: 'secondary'
  },
  {
    id: 3,
    title: '测试项目 3',
    description: '第三个测试项目',
    icon: '🎯',
    color: 'accent'
  }
])

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// 添加日志
const addLog = (message: string, type: 'info' | 'error' = 'info') => {
  testLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
  
  // 限制日志数量
  if (testLogs.value.length > 100) {
    testLogs.value = testLogs.value.slice(0, 100)
  }
}

// 测试通知
const testNotification = () => {
  addLog('测试通知功能')
  $q.notify({
    message: '这是一个测试通知',
    color: 'positive',
    icon: 'check_circle'
  })
}

// 测试触觉反馈
const testHaptic = () => {
  addLog('测试触觉反馈')
  try {
    if (telegramStore.isReady) {
      telegramStore.hapticImpact('medium')
    } else {
      addLog('Telegram 环境未就绪', 'error')
    }
  } catch (error) {
    addLog(`触觉反馈失败: ${error}`, 'error')
  }
}

// 切换主题
const toggleTheme = () => {
  addLog('切换主题')
  $q.dark.toggle()
}

// 刷新数据
const refreshData = () => {
  addLog('刷新数据')
  updateTime()
  screenSize.value = `${window.innerWidth} x ${window.innerHeight}`
}

// 提交表单
const submitForm = () => {
  addLog(`提交表单: ${JSON.stringify(testForm.value)}`)
  $q.notify({
    message: '表单提交成功',
    color: 'positive'
  })
}

// 编辑项目
const editItem = (item: any) => {
  addLog(`编辑项目: ${item.title}`)
  $q.notify({
    message: `编辑项目: ${item.title}`,
    color: 'info'
  })
}

// 显示确认框
const showConfirm = () => {
  $q.dialog({
    title: '确认操作',
    message: '你确定要执行这个操作吗？',
    cancel: true,
    persistent: true
  }).onOk(() => {
    addLog('用户确认了操作')
  }).onCancel(() => {
    addLog('用户取消了操作')
  })
}

// 生成大量数据
const generateData = async () => {
  generating.value = true
  performanceData.value = { progress: 0 }
  
  for (let i = 0; i <= 100; i++) {
    await new Promise(resolve => setTimeout(resolve, 50))
    performanceData.value.progress = i / 100
  }
  
  addLog('生成了大量测试数据')
  generating.value = false
  performanceData.value = null
}

// 测试动画
const testAnimation = () => {
  addLog('测试动画效果')
  $q.notify({
    message: '动画测试',
    color: 'purple',
    icon: 'animation',
    timeout: 2000
  })
}

// 测试内存
const testMemory = () => {
  addLog('测试内存使用')
  const memory = (performance as any).memory
  if (memory) {
    addLog(`内存使用: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`)
  }
}

// 测试网络连接
const testNetwork = async () => {
  networkTesting.value = true
  addLog('测试网络连接')
  
  try {
    const response = await fetch('https://httpbin.org/get')
    if (response.ok) {
      networkResult.value = {
        success: true,
        message: '网络连接正常'
      }
      addLog('网络连接测试成功')
    } else {
      throw new Error('网络响应异常')
    }
  } catch (error) {
    networkResult.value = {
      success: false,
      message: '网络连接失败'
    }
    addLog(`网络连接测试失败: ${error}`, 'error')
  }
  
  networkTesting.value = false
}

// 获取用户信息
const getUserInfo = () => {
  addLog('获取用户信息')
  if (telegramStore.user) {
    addLog(`用户: ${telegramStore.user.first_name} ${telegramStore.user.last_name || ''}`)
  } else {
    addLog('无法获取用户信息', 'error')
  }
}

// 测试 API
const testAPI = () => {
  addLog('测试 API 调用')
  // 这里可以添加具体的 API 测试
  $q.notify({
    message: 'API 测试完成',
    color: 'info'
  })
}

// 清空日志
const clearLogs = () => {
  testLogs.value = []
  addLog('日志已清空')
}

// 初始化
onMounted(() => {
  addLog('新测试页面已加载')
  
  // 更新环境信息
  updateTime()
  userAgent.value = navigator.userAgent
  screenSize.value = `${window.innerWidth} x ${window.innerHeight}`
  isTelegramEnv.value = telegramStore.isReady
  
  // 定时更新时间
  const timeInterval = setInterval(updateTime, 1000)
  
  // 监听窗口大小变化
  const handleResize = () => {
    screenSize.value = `${window.innerWidth} x ${window.innerHeight}`
  }
  window.addEventListener('resize', handleResize)
  
  // 清理函数
  onUnmounted(() => {
    clearInterval(timeInterval)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
.log-item {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
}

.log-item span:first-child {
  margin-right: 8px;
}
</style>
