import axios from 'axios'
import { getAuthToken } from './auth'

// API 基础配置 - 使用你的现有接口
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bx.jbtls.xyz'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 统一处理token认证
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      // 将token添加到请求头中
      config.headers.Authorization = `Bearer ${token}`
      // 同时添加到请求体中（兼容你的后端接口）
      if (config.data && typeof config.data === 'object') {
        config.data.token = token
      }
    } else {
      console.warn('未找到认证token')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理业务逻辑
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data
    
    // 统一处理业务状态码
    if (data && typeof data.code !== 'undefined') {
      if (data.code === 1) {
        // 成功状态，直接返回数据
        return data
      } else if (data.code === -1) {
        // 业务错误，抛出错误信息
        const errorMessage = data.msg || data.message || '操作失败'
        console.error('业务错误:', errorMessage)
        return Promise.reject(new Error(errorMessage))
      } else {
        // 其他状态码，抛出错误
        const errorMessage = data.msg || data.message || `未知错误 (code: ${data.code})`
        console.error('API错误:', errorMessage)
        return Promise.reject(new Error(errorMessage))
      }
    }
    
    // 如果没有code字段，直接返回数据
    return data
  },
  (error) => {
    console.error('API Error:', error)
    
    // 处理HTTP错误
    if (error.response?.status === 401) {
      console.error('认证失败，请检查token')
      return Promise.reject(new Error('认证失败，请检查token'))
    } else if (error.response?.status === 404) {
      return Promise.reject(new Error('接口不存在'))
    } else if (error.response?.status >= 500) {
      return Promise.reject(new Error('服务器错误，请稍后重试'))
    } else if (error.response?.data?.msg) {
      // 服务器返回的错误信息
      return Promise.reject(new Error(error.response.data.msg))
    } else if (error.message) {
      // 网络错误或其他错误
      return Promise.reject(new Error(error.message))
    } else {
      return Promise.reject(new Error('网络请求失败'))
    }
  }
)

// 产品录入相关接口
export const productAPI = {
  // 验证产品信息 (对应 /tg_api/app_add)
  validate: (data: string) => {
    return apiClient.post('/tg_api/app_add', {
      text: data
    })
  },
  
  // 提交产品信息 (对应 /tg_api/app_add_submit)
  submit: (data: any) => {
    return apiClient.post('/tg_api/app_add_submit', data)
  },
  
  // 获取提交历史 (暂时使用验证接口的返回数据)
  getHistory: (params?: any) => {
    return Promise.resolve({ data: [] })
  }
}

// 商务认款相关接口
export const businessPaymentAPI = {
  // 获取认款信息 (对应 /tg_api/get_trade_info)
  getInfo: (adminId: string) => {
    return apiClient.post('/tg_api/get_trade_info', {
      admin_id: adminId
    })
  },
  
  // 确认认款 (对应 /tg_api/update_app_info)
  confirm: (data: any) => {
    return apiClient.post('/tg_api/update_app_info', data)
  },
  
  // 获取操作历史 (暂时返回空数组)
  getLogs: (id: string) => {
    return Promise.resolve({ data: [] })
  }
}

// 商务流水相关接口
export const businessTransactionAPI = {
  // 获取流水列表 (对应 /tg_api/get_trade_list)
  getList: (adminId: string, page: number = 1, limit: number = 100) => {
    return apiClient.post('/tg_api/get_trade_list', {
      admin_id: adminId,
      page: page,
      limit: limit
    })
  },
  
  // 获取统计信息 (从流水列表中计算)
  getStatistics: (adminId: string) => {
    return apiClient.post('/tg_api/get_trade_list', {
      admin_id: adminId,
      page: 1,
      limit: 1000 // 获取更多数据用于统计
    })
  },
  
  // 获取详情 (暂时返回空对象)
  getDetail: (id: string) => {
    return Promise.resolve({ data: {} })
  },
  
  // 更新交易 (暂时返回成功)
  update: (id: string, data: any) => {
    return Promise.resolve({ success: true, message: '更新成功' })
  }
}

// 通用接口
export const commonAPI = {
  // 上传文件
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // 获取配置
  getConfig: () => {
    return apiClient.get('/config')
  }
}

// 导出认证相关函数，供页面使用
export { getAuthToken, hasAuthToken, getTokenStatus } from './auth'

export default apiClient
