import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { telegramService, type TelegramUser, type TelegramChat } from '@/utils/telegram'

export const useTelegramStore = defineStore('telegram', () => {
  // 状态
  const user = ref<TelegramUser | null>(null)
  const chat = ref<TelegramChat | null>(null)
  const startParam = ref<string | null>(null)
  const isReady = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const platform = ref<string>('')
  const version = ref<string>('')

  // 计算属性
  const isTelegram = computed(() => telegramService.isTelegram())
  const isPremium = computed(() => user.value?.is_premium || false)
  const userName = computed(() => {
    if (!user.value) return ''
    return user.value.last_name 
      ? `${user.value.first_name} ${user.value.last_name}`
      : user.value.first_name
  })

  // 动作
  const initialize = () => {
    try {
      // 获取用户信息
      const currentUser = telegramService.getUser()
      if (currentUser) {
        user.value = currentUser
      }

      // 获取聊天信息
      const currentChat = telegramService.getChat()
      if (currentChat) {
        chat.value = currentChat
      }

      // 获取启动参数
      const param = telegramService.getStartParam()
      if (param) {
        startParam.value = param
      }

      // 获取平台和版本信息
      platform.value = telegramService.getPlatform()
      version.value = telegramService.getVersion()

      // 设置主题
      const themeParams = telegramService.getThemeParams()
      if (themeParams) {
        theme.value = themeParams.bg_color === '#ffffff' ? 'light' : 'dark'
      }

      isReady.value = true
    } catch (error) {
      console.error('Failed to initialize Telegram Web App:', error)
    }
  }

  const showMainButton = (text: string, callback: () => void) => {
    telegramService.showMainButton(text, callback)
  }

  const hideMainButton = () => {
    telegramService.hideMainButton()
  }

  const showBackButton = (callback: () => void) => {
    telegramService.showBackButton(callback)
  }

  const hideBackButton = () => {
    telegramService.hideBackButton()
  }

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    telegramService.hapticImpact(style)
  }

  const showNotification = (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    telegramService.showNotification(message, type)
  }

  const closeApp = () => {
    telegramService.close()
  }

  const setThemeParams = (params: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }) => {
    telegramService.setThemeParams(params)
  }

  return {
    // 状态
    user,
    chat,
    startParam,
    isReady,
    theme,
    platform,
    version,
    
    // 计算属性
    isTelegram,
    isPremium,
    userName,
    
    // 动作
    initialize,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticImpact,
    showNotification,
    closeApp,
    setThemeParams
  }
})
