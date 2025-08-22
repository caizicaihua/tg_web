import { useTelegramStore } from '@/stores/telegram'

/**
 * 认证服务 - 统一管理token
 */
export class AuthService {
  /**
   * 获取认证token
   * 优先级：Telegram start_param > URL参数 > null
   */
  static getToken(): string | null {
    // 优先从Telegram Web App获取token
    const telegramStore = useTelegramStore()
    const startParam = telegramStore.startParam
    
    if (startParam) {
      return startParam
    }
    
    // 如果没有start_param，尝试从URL参数获取（兼容性）
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('token')
  }

  /**
   * 检查是否有有效的token
   */
  static hasToken(): boolean {
    return !!this.getToken()
  }

  /**
   * 获取token状态信息
   */
  static getTokenStatus() {
    const token = this.getToken()
    return {
      hasToken: !!token,
      token: token,
      source: token ? (useTelegramStore().startParam ? 'telegram' : 'url') : 'none'
    }
  }

  /**
   * 验证token有效性（可以在这里添加token格式验证等）
   */
  static validateToken(token: string): boolean {
    // 基本验证：token不为空且长度合理
    return !!token && token.length > 0 && token.length < 1000
  }
}

// 导出便捷函数
export const getAuthToken = AuthService.getToken
export const hasAuthToken = AuthService.hasToken
export const getTokenStatus = AuthService.getTokenStatus
export const validateToken = AuthService.validateToken

export default AuthService
