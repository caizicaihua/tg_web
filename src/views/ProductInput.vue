<template>
  <div class="product-input-container">
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 头部 -->
      <div class="header">
        <h1>📱 产品信息</h1>
        <p>输入产品信息，确保有必填项</p>
      </div>
      
      <!-- 内容区域 -->
      <div class="content">
        <div class="input-group">
          <label class="input-label" for="messageInput">产品信息</label>
          <textarea 
            id="messageInput" 
            v-model="productData"
            class="auto-resize-textarea" 
            placeholder="请输入产品信息，支持多行输入&#10;例如：&#10;客户名称：测试客户&#10;平台：FB&#10;商务：LQT&#10;需求/KPI：15&#10;产品链接：example.com&#10;合作模式：6+1&#10;群名：测试群&#10;投放地区&开户时区：+7 印尼"
            @input="autoResizeTextarea"
            @keydown="handleKeydown"
          ></textarea>
        </div>
        
        <div class="button-group">
          <button 
            id="submitBtn" 
            class="submit-btn" 
            type="button"
            :disabled="loading || !productData"
            @click="handleSubmit"
          >
            <span v-if="!loading">发送信息</span>
            <span v-else>发送中...</span>
            <span class="loading" v-if="loading"></span>
          </button>
        </div>
        
        <!-- 消息提示 -->
        <div id="successMessage" class="success-message" v-if="showSuccess">
          ✅ {{ successMessage }}
        </div>
        
        <div id="errorMessage" class="error-message" v-if="showError">
          ❌ {{ errorMessage }}
        </div>
        
        <!-- Token状态显示 -->
        <div id="tokenStatus" class="token-status">
          <div>Token状态: 
            <span id="tokenInfo" :class="tokenStatusClass">
              {{ tokenStatusText }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <div id="successModal" class="success-modal" v-if="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✅ 解析完毕</h3>
          <p>产品信息是否正确</p>
        </div>
        
        <div class="result-list" id="resultList">
          <div 
            v-for="(value, key) in modalData" 
            :key="key"
            class="result-item"
          >
            <div class="result-label">{{ getFieldLabel(key) }}</div>
            <div class="result-value">{{ value || '-' }}</div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="confirm-btn" type="button" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useTelegramStore } from '@/stores/telegram'
import { productAPI, getAuthToken, getTokenStatus } from '@/services/api'

const $q = useQuasar()
const telegramStore = useTelegramStore()

// 响应式数据
const productData = ref('')
const loading = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showModal = ref(false)
const modalData = ref<any>({})
const tokenStatusText = ref('检查中...')
const tokenStatusClass = ref('')

// 自动调整文本框高度
const autoResizeTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  // 重置高度以获取正确的scrollHeight
  textarea.style.height = 'auto'
  
  // 设置新高度
  const newHeight = Math.max(100, textarea.scrollHeight)
  textarea.style.height = newHeight + 'px'
  
  // 限制最大高度
  if (newHeight > 400) {
    textarea.style.height = '400px'
    textarea.style.overflowY = 'auto'
  } else {
    textarea.style.overflowY = 'hidden'
  }
}

// 处理键盘事件（支持Ctrl+Enter发送）
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    handleSubmit()
  }
}

// 获取字段标签
const getFieldLabel = (key: string) => {
  const labels: { [key: string]: string } = {
    customer_name: '客户名称',
    platform: '平台',
    business: '商务',
    requirement: '需求/KPI',
    product_link: '产品链接',
    cooperation_model: '合作模式',
    group_name: '群名',
    targeting_region: '投放地区&开户时区'
  }
  return labels[key] || key
}

// 显示成功消息
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccess.value = true
  showError.value = false
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

// 显示错误消息
const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showError.value = true
  showSuccess.value = false
  setTimeout(() => {
    showError.value = false
  }, 3000)
}

// 显示成功弹窗
const showSuccessModal = (data: any) => {
  modalData.value = data
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  modalData.value = {}
}

// 使用统一的认证服务
const getToken = getAuthToken

// 真实API调用
const validateProduct = async (data: string) => {
  try {
    const response = await productAPI.validate(data)
    
    // API层已经处理了code状态，这里直接处理成功情况
    return {
      success: true,
      message: '产品信息验证成功',
      data: response.data || response.res_data || {}
    }
  } catch (error: any) {
    // API层已经处理了错误，这里直接返回错误信息
    return {
      success: false,
      message: error.message || '验证失败，请重试',
      data: null
    }
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!productData.value.trim()) {
    showErrorMessage('请输入产品信息')
    return
  }

  loading.value = true
  
  try {
    // 触觉反馈
    telegramStore.hapticImpact('medium')
    
    // 验证产品信息
    const validation = await validateProduct(productData.value)
    
    if (validation.success) {
      // 显示成功弹窗
      showSuccessModal(validation.data)
      
      // 显示成功消息
      showSuccessMessage('信息发送成功！')
      
      // 清空表单
      productData.value = ''
      
      // 重置文本框高度
      await nextTick()
      const textarea = document.getElementById('messageInput') as HTMLTextAreaElement
      if (textarea) {
        autoResizeTextarea({ target: textarea } as Event)
      }
    } else {
      // 显示错误消息
      showErrorMessage(validation.message)
    }
  } catch (error) {
    console.error('提交失败:', error)
    showErrorMessage('网络请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  // 设置主按钮
  telegramStore.showMainButton('发送信息', handleSubmit)
  
  // 设置返回按钮
  telegramStore.showBackButton(() => {
    telegramStore.hideBackButton()
  })
  
  // 初始化文本框高度
  nextTick(() => {
    const textarea = document.getElementById('messageInput') as HTMLTextAreaElement
    if (textarea) {
      autoResizeTextarea({ target: textarea } as Event)
    }
  })
  
  // 更新Token状态
  const tokenStatus = getTokenStatus()
  if (tokenStatus.hasToken) {
    tokenStatusText.value = `✅ Token已就绪 (${tokenStatus.source})`
    tokenStatusClass.value = 'token-ready'
  } else {
    tokenStatusText.value = '❌ 未找到Token'
    tokenStatusClass.value = 'token-error'
    showErrorMessage('缺少访问令牌，请检查Telegram Web App配置')
  }
})
</script>

<style scoped>
.product-input-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
}

.main-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.header p {
  font-size: 14px;
  opacity: 0.9;
}

.content {
  padding: 30px 20px;
}

.input-group {
  margin-bottom: 25px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.auto-resize-textarea {
  width: 100%;
  min-height: 100px;
  max-height: 400px;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.auto-resize-textarea:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.auto-resize-textarea::placeholder {
  color: #999;
  font-size: 14px;
}

.button-group {
  text-align: center;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  min-width: 200px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading {
  display: inline-block;
  margin-left: 10px;
}

.loading::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #c3e6cb;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #f5c6cb;
}

.token-status {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
}

.token-ready {
  color: #28a745;
  font-weight: 600;
}

.token-error {
  color: #dc3545;
  font-weight: 600;
}

/* 成功弹窗样式 */
.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  text-align: center;
  margin-bottom: 25px;
}

.modal-header h3 {
  color: #28a745;
  font-size: 20px;
  margin-bottom: 8px;
}

.modal-header p {
  color: #666;
  font-size: 14px;
}

.result-list {
  margin-bottom: 25px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.result-value {
  color: #666;
  font-size: 14px;
  text-align: right;
  max-width: 60%;
  word-break: break-all;
}

.modal-footer {
  text-align: center;
}

.confirm-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.confirm-btn:active {
  transform: translateY(0);
}

/* 手机端适配 */
@media (max-width: 768px) {
  .product-input-container {
    padding: 10px;
    padding-top: 20px;
    padding-bottom: 100px;
  }

  .main-container {
    border-radius: 15px;
  }

  .header {
    padding: 20px 15px;
  }

  .content {
    padding: 15px 12px;
  }

  .auto-resize-textarea {
    padding: 10px;
  }

  .submit-btn {
    padding: 10px 25px;
    min-width: 160px;
  }
}
</style>
