<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 页面标题 -->
      <div class="col-12">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h5">💰 商务认款</div>
            <div class="text-subtitle2">确认商务付款信息</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 认款信息展示 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">认款信息</div>
            <div v-if="loading" class="text-center q-pa-md">
              <q-spinner size="2em" color="secondary" />
              <div class="q-mt-sm">加载中...</div>
            </div>
            <div v-else-if="paymentInfo" class="q-gutter-md">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>认款ID</q-item-label>
                    <q-item-label caption>{{ paymentInfo.id }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>金额</q-item-label>
                    <q-item-label caption class="text-h6 text-positive">
                      ¥{{ paymentInfo.amount }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>收款方</q-item-label>
                    <q-item-label caption>{{ paymentInfo.recipient }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>付款方</q-item-label>
                    <q-item-label caption>{{ paymentInfo.payer }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>状态</q-item-label>
                    <q-item-label caption>
                      <q-chip
                        :color="getStatusColor(paymentInfo.status)"
                        text-color="white"
                        size="sm"
                      >
                        {{ getStatusText(paymentInfo.status) }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>创建时间</q-item-label>
                    <q-item-label caption>{{ formatDate(paymentInfo.createdAt) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div v-else class="text-grey text-center q-pa-md">
              未找到认款信息
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 认款确认表单 -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">确认认款</div>
            <q-form @submit="handleConfirm" class="q-gutter-md">
              <q-input
                v-model="confirmForm.remark"
                label="备注信息"
                type="textarea"
                outlined
                placeholder="请输入备注信息..."
                rows="3"
              />
              
              <q-select
                v-model="confirmForm.paymentMethod"
                :options="paymentMethods"
                label="付款方式"
                outlined
                :rules="[val => !!val || '请选择付款方式']"
              />
              
              <q-input
                v-model="confirmForm.transactionId"
                label="交易流水号"
                outlined
                placeholder="请输入交易流水号..."
              />
              
              <q-checkbox
                v-model="confirmForm.agreed"
                label="我已确认以上信息无误"
                :rules="[val => val || '请确认信息']"
              />
              
              <div class="row q-gutter-sm">
                <q-btn
                  type="submit"
                  color="positive"
                  :loading="submitting"
                  :disable="!confirmForm.agreed || !paymentInfo"
                  label="确认认款"
                  icon="check_circle"
                />
                <q-btn
                  color="secondary"
                  @click="resetForm"
                  label="重置"
                  icon="refresh"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- 操作历史 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">操作历史</div>
            <q-timeline color="secondary">
              <q-timeline-entry
                v-for="(log, index) in operationLogs"
                :key="index"
                :title="log.action"
                :subtitle="formatDate(log.timestamp)"
                :icon="getLogIcon(log.action)"
              >
                <div>{{ log.description }}</div>
                <div v-if="log.details" class="text-caption text-grey">
                  {{ log.details }}
                </div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTelegramStore } from '@/stores/telegram'
import { businessPaymentAPI } from '@/services/api'

const $q = useQuasar()
const route = useRoute()
const telegramStore = useTelegramStore()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const paymentInfo = ref<any>(null)
const operationLogs = ref<any[]>([])

// 表单数据
const confirmForm = ref({
  remark: '',
  paymentMethod: null,
  transactionId: '',
  agreed: false
})

// 付款方式选项
const paymentMethods = [
  { label: '银行转账', value: 'bank_transfer' },
  { label: '支付宝', value: 'alipay' },
  { label: '微信支付', value: 'wechat_pay' },
  { label: '现金', value: 'cash' }
]

// 获取认款ID
const paymentId = computed(() => route.params.id as string)

// 真实API调用
const getPaymentInfo = async (id: string) => {
  try {
    // 从 Telegram 获取 token 和 adminId
    const token = telegramStore.user?.id?.toString() || 'default_token'
    const adminId = id // 使用传入的ID作为adminId
    const response = await businessPaymentAPI.getInfo(token, adminId)
    
    // 处理你的接口返回格式
    if (response.success && response.data) {
      const data = response.data
      if (data.code === 1) {
        return data.data // 返回交易信息
      } else {
        throw new Error(data.msg || '获取认款信息失败')
      }
    } else {
      throw new Error(response.error || '获取认款信息失败')
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || '获取认款信息失败')
  }
}

const confirmPayment = async (data: any) => {
  try {
    // 从 Telegram 获取 token
    const token = telegramStore.user?.id?.toString() || 'default_token'
    const response = await businessPaymentAPI.confirm(data, token)
    
    // 处理你的接口返回格式
    if (response.success && response.data) {
      const data = response.data
      if (data.code === 1) {
        return {
          success: true,
          message: '认款确认成功',
          data: data.data || {}
        }
      } else {
        throw new Error(data.msg || '确认失败')
      }
    } else {
      throw new Error(response.error || '确认失败，请重试')
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || '确认失败，请重试')
  }
}

// 加载操作日志
const loadOperationLogs = async (id: string) => {
  try {
    const response = await businessPaymentAPI.getLogs(id)
    operationLogs.value = response.data || []
  } catch (error) {
    console.error('加载操作日志失败:', error)
  }
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    confirmed: 'positive',
    rejected: 'negative',
    completed: 'info'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts = {
    pending: '待确认',
    confirmed: '已确认',
    rejected: '已拒绝',
    completed: '已完成'
  }
  return texts[status as keyof typeof texts] || '未知'
}

// 获取日志图标
const getLogIcon = (action: string) => {
  const icons = {
    created: 'add_circle',
    confirmed: 'check_circle',
    rejected: 'cancel',
    updated: 'edit'
  }
  return icons[action as keyof typeof icons] || 'info'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// 加载认款信息
const loadPaymentInfo = async () => {
  if (!paymentId.value) {
    $q.notify({
      message: '缺少认款ID',
      color: 'negative'
    })
    return
  }

  loading.value = true
  
  try {
    const info = await getPaymentInfo(paymentId.value)
    paymentInfo.value = info
    
    // 加载操作日志
    await loadOperationLogs(paymentId.value)
  } catch (error) {
    console.error('加载失败:', error)
    $q.notify({
      message: error instanceof Error ? error.message : '加载认款信息失败',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

// 处理确认提交
const handleConfirm = async () => {
  if (!confirmForm.value.agreed) {
    $q.notify({
      message: '请确认信息无误',
      color: 'warning'
    })
    return
  }

  submitting.value = true
  
  try {
    telegramStore.hapticImpact('medium')
    
    const result = await confirmPayment({
      paymentId: paymentId.value,
      ...confirmForm.value
    })
    
    if (result.success) {
      // 更新状态
      if (paymentInfo.value) {
        paymentInfo.value.status = 'confirmed'
      }
      
      // 添加操作日志
      operationLogs.value.unshift({
        action: 'confirmed',
        description: '认款已确认',
        timestamp: new Date().toISOString(),
        details: `付款方式: ${confirmForm.value.paymentMethod}`
      })
      
      // 显示成功通知
      telegramStore.showNotification('认款确认成功！', 'success')
      
      // 重置表单
      resetForm()
    }
  } catch (error) {
    console.error('确认失败:', error)
    telegramStore.showNotification('确认失败，请重试', 'error')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  confirmForm.value = {
    remark: '',
    paymentMethod: null,
    transactionId: '',
    agreed: false
  }
  telegramStore.hapticImpact('light')
}

// 初始化
onMounted(() => {
  loadPaymentInfo()
  
  // 设置主按钮
  telegramStore.showMainButton('确认认款', handleConfirm)
  
  // 设置返回按钮
  telegramStore.showBackButton(() => {
    telegramStore.hideBackButton()
  })
})
</script>
