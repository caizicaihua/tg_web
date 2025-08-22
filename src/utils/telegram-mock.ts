// Telegram Web App 模拟环境
// 用于本地开发和测试

export interface MockTelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface MockTelegramChat {
  id: number
  type: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  photo_url?: string
}

// 模拟 Telegram Web App 对象
export const mockTelegramWebApp = {
  // 用户信息
  initDataUnsafe: {
    user: {
      id: 123456789,
      first_name: '测试用户',
      last_name: 'Test',
      username: 'testuser',
      language_code: 'zh',
      is_premium: true,
      photo_url: 'https://via.placeholder.com/150'
    } as MockTelegramUser,
    chat: {
      id: -987654321,
      type: 'private',
      title: '测试聊天',
      username: 'testchat'
    } as MockTelegramChat,
    start_param: 'test_param'
  },

  // 主题参数
  themeParams: {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    link_color: '#2481cc',
    button_color: '#2481cc',
    button_text_color: '#ffffff'
  },

  // 平台信息
  platform: 'web',
  version: '6.0',
  colorScheme: 'light',

  // 方法
  ready() {
    console.log('Telegram Web App ready')
  },

  expand() {
    console.log('Telegram Web App expand')
  },

  close() {
    console.log('Telegram Web App close')
  },

  // 主按钮
  MainButton: {
    text: '',
    color: '',
    textColor: '',
    isVisible: false,
    isActive: false,
    isProgressVisible: false,

    setText(text: string) {
      this.text = text
      console.log('MainButton setText:', text)
    },

    onClick(callback: () => void) {
      console.log('MainButton onClick registered')
    },

    show() {
      this.isVisible = true
      console.log('MainButton show')
    },

    hide() {
      this.isVisible = false
      console.log('MainButton hide')
    },

    enable() {
      this.isActive = true
      console.log('MainButton enable')
    },

    disable() {
      this.isActive = false
      console.log('MainButton disable')
    },

    showProgress() {
      this.isProgressVisible = true
      console.log('MainButton showProgress')
    },

    hideProgress() {
      this.isProgressVisible = false
      console.log('MainButton hideProgress')
    }
  },

  // 返回按钮
  BackButton: {
    isVisible: false,

    onClick(callback: () => void) {
      console.log('BackButton onClick registered')
    },

    show() {
      this.isVisible = true
      console.log('BackButton show')
    },

    hide() {
      this.isVisible = false
      console.log('BackButton hide')
    }
  },

  // 触觉反馈
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') {
      console.log('HapticFeedback impactOccurred:', style)
    },

    notificationOccurred(type: 'error' | 'success' | 'warning') {
      console.log('HapticFeedback notificationOccurred:', type)
    },

    selectionChanged() {
      console.log('HapticFeedback selectionChanged')
    }
  },

  // 通知
  showAlert(message: string, callback?: () => void) {
    console.log('showAlert:', message)
    if (callback) callback()
  },

  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    console.log('showConfirm:', message)
    if (callback) callback(true)
  },

  showPopup(params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text: string
    }>
  }, callback?: (buttonId: string) => void) {
    console.log('showPopup:', params)
    if (callback) callback('ok')
  },

  // 主题设置
  setThemeParams(params: any) {
    console.log('setThemeParams:', params)
  },

  setHeaderColor(color: string) {
    console.log('setHeaderColor:', color)
  },

  setBackgroundColor(color: string) {
    console.log('setBackgroundColor:', color)
  },

  // 版本检查
  isVersionAtLeast(version: string): boolean {
    return true
  },

  // 关闭 Web App
  close() {
    console.log('Telegram Web App close')
  }
}

// 检查是否在 Telegram 环境中
export function isTelegramEnvironment(): boolean {
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp &&
         window.Telegram.WebApp.initDataUnsafe?.user
}

// 获取 Telegram Web App 实例
export function getTelegramWebApp() {
  if (isTelegramEnvironment()) {
    return window.Telegram.WebApp
  } else {
    console.log('⚠️ 使用模拟的 Telegram Web App 环境')
    return mockTelegramWebApp
  }
}

// 全局声明
declare global {
  interface Window {
    Telegram?: {
      WebApp: any
    }
  }
}
