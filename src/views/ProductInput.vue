<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 页面标题 -->
      <div class="col-12">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h5">📝 产品录入</div>
            <div class="text-subtitle2">输入产品信息并提交</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 产品录入表单 -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">产品信息</div>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input
                v-model="productData"
                label="产品信息"
                type="textarea"
                outlined
                :rules="[val => !!val || '请输入产品信息']"
                placeholder="请输入产品信息..."
                rows="4"
              />
              
              <div class="row q-gutter-sm">
                <q-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disable="!productData"
                  label="验证并提交"
                  icon="send"
                />
                <q-btn
                  color="secondary"
                  @click="clearForm"
                  label="清空"
                  icon="clear"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- 结果显示 -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">验证结果</div>
            <div v-if="loading" class="text-center q-pa-md">
              <q-spinner size="2em" color="primary" />
              <div class="q-mt-sm">正在验证...</div>
            </div>
            <div v-else-if="validationResult" class="q-mt-md">
              <q-banner
                :class="validationResult.success ? 'bg-positive' : 'bg-negative'"
                class="text-white"
              >
                <template v-slot:avatar>
                  <q-icon :name="validationResult.success ? 'check_circle' : 'error'" />
                </template>
                {{ validationResult.message }}
              </q-banner>
              
              <div v-if="validationResult.data" class="q-mt-md">
                <div class="text-subtitle2">返回数据：</div>
                <pre class="bg-grey-2 q-pa-sm rounded">{{ JSON.stringify(validationResult.data, null, 2) }}</pre>
              </div>
            </div>
            <div v-else class="text-grey text-center q-pa-md">
              暂无验证结果
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 提交历史 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">提交历史</div>
            <q-list separator>
              <q-item v-for="(item, index) in submitHistory" :key="index">
                <q-item-section>
                  <q-item-label>{{ item.productData }}</q-item-label>
                  <q-item-label caption>
                    {{ new Date(item.timestamp).toLocaleString() }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    :color="item.success ? 'positive' : 'negative'"
                    text-color="white"
                    size="sm"
                  >
                    {{ item.success ? '成功' : '失败' }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useTelegramStore } from '@/stores/telegram'
import { productAPI } from '@/services/api'

const $q = useQuasar()
const telegramStore = useTelegramStore()

// 响应式数据
const productData = ref('')
const loading = ref(false)
const validationResult = ref<any>(null)
const submitHistory = ref<any[]>([])

// 真实API调用
const validateProduct = async (data: string) => {
  try {
    // 从 Telegram 获取 token
    const token = telegramStore.user?.id?.toString() || 'default_token'
    const response = await productAPI.validate(data, token)
    
    // 处理你的接口返回格式
    if (response.success && response.data) {
      const data = response.data
      if (data.code === 1 || data.status === 1) {
        return {
          success: true,
          message: '产品信息验证成功',
          data: data.data || data.res_data || {}
        }
      } else {
        return {
          success: false,
          message: data.msg || data.message || '验证失败',
          data: null
        }
      }
    } else {
      return {
        success: false,
        message: response.error || '验证失败，请重试',
        data: null
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '验证失败，请重试',
      data: null
    }
  }
}

const submitProduct = async (data: string) => {
  try {
    // 从 Telegram 获取 token
    const token = telegramStore.user?.id?.toString() || 'default_token'
    const response = await productAPI.submit({ productData: data }, token)
    
    // 处理你的接口返回格式
    if (response.success && response.data) {
      const data = response.data
      if (data.code === 1 || data.status === 1) {
        return {
          success: true,
          message: '产品信息提交成功',
          data: data.data || data.res_data || {}
        }
      } else {
        throw new Error(data.msg || data.message || '提交失败')
      }
    } else {
      throw new Error(response.error || '提交失败，请重试')
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || '提交失败，请重试')
  }
}

// 加载提交历史
const loadHistory = async () => {
  try {
    const response = await productAPI.getHistory()
    submitHistory.value = response.data || []
  } catch (error) {
    console.error('加载历史失败:', error)
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!productData.value) {
    $q.notify({
      message: '请输入产品信息',
      color: 'negative'
    })
    return
  }

  loading.value = true
  
  try {
    // 触觉反馈
    telegramStore.hapticImpact('medium')
    
    // 验证产品信息
    const validation = await validateProduct(productData.value)
    validationResult.value = validation
    
    if (validation.success) {
      // 提交产品信息
      const submitResult = await submitProduct(productData.value)
      
      // 添加到历史记录
      submitHistory.value.unshift({
        productData: productData.value,
        success: true,
        timestamp: new Date().toISOString(),
        result: submitResult
      })
      
      // 显示成功通知
      telegramStore.showNotification('产品信息提交成功！', 'success')
      
      // 清空表单
      productData.value = ''
      validationResult.value = null
    } else {
      // 显示错误通知
      telegramStore.showNotification(validation.message, 'error')
    }
  } catch (error) {
    console.error('提交失败:', error)
    telegramStore.showNotification('提交失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}

// 清空表单
const clearForm = () => {
  productData.value = ''
  validationResult.value = null
  telegramStore.hapticImpact('light')
}

// 初始化
onMounted(() => {
  // 加载历史记录
  loadHistory()
  
  // 设置主按钮
  telegramStore.showMainButton('提交', handleSubmit)
  
  // 设置返回按钮
  telegramStore.showBackButton(() => {
    telegramStore.hideBackButton()
    // 可以添加返回逻辑
  })
})
</script>

<style scoped>
pre {
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}
</style>
