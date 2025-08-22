import WebApp from '@twa-dev/sdk'
import { getTelegramWebApp, isTelegramEnvironment } from './telegram-mock'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramChat {
  id: number
  type: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  photo_url?: string
}

export class TelegramService {
  private static instance: TelegramService
  private webApp: typeof WebApp

  private constructor() {
    // 使用模拟环境或真实环境
    this.webApp = getTelegramWebApp()
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService()
    }
    return TelegramService.instance
  }

  // 获取当前用户信息
  public getUser(): TelegramUser | null {
    return this.webApp.initDataUnsafe?.user || null
  }

  // 获取当前聊天信息
  public getChat(): TelegramChat | null {
    return this.webApp.initDataUnsafe?.chat || null
  }

  // 获取启动参数
  public getStartParam(): string | null {
    return this.webApp.initDataUnsafe?.start_param || null
  }

  // 显示主按钮
  public showMainButton(text: string, callback: () => void): void {
    this.webApp.MainButton.setText(text)
    this.webApp.MainButton.onClick(callback)
    this.webApp.MainButton.show()
  }

  // 隐藏主按钮
  public hideMainButton(): void {
    this.webApp.MainButton.hide()
  }

  // 显示返回按钮
  public showBackButton(callback: () => void): void {
    this.webApp.BackButton.onClick(callback)
    this.webApp.BackButton.show()
  }

  // 隐藏返回按钮
  public hideBackButton(): void {
    this.webApp.BackButton.hide()
  }

  // 显示Haptic反馈
  public hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'): void {
    this.webApp.HapticFeedback.impactOccurred(style)
  }

  // 显示通知
  public showNotification(message: string, type: 'error' | 'success' | 'warning' = 'success'): void {
    this.webApp.showAlert(message)
  }

  // 关闭Web App
  public close(): void {
    this.webApp.close()
  }

  // 设置主题参数
  public setThemeParams(params: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }): void {
    // 注意：setThemeParams 方法在新版本中可能不可用
    // 这里使用其他方式设置主题
    console.log('设置主题参数:', params)
  }

  // 获取主题参数
  public getThemeParams(): any {
    return this.webApp.themeParams
  }

  // 检查是否在Telegram环境中
  public isTelegram(): boolean {
    return this.webApp.isVersionAtLeast('6.0')
  }

  // 获取平台信息
  public getPlatform(): string {
    return this.webApp.platform
  }

  // 获取版本信息
  public getVersion(): string {
    return this.webApp.version
  }
}

// 导出单例实例
export const telegramService = TelegramService.getInstance()
