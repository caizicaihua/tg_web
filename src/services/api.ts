import axios from 'axios'

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

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 产品录入相关接口
export const productAPI = {
  // 验证产品信息 (对应 /tg_api/app_add)
  validate: (data: string, token: string) => {
    return apiClient.post('/tg_api/app_add', {
      token: token,
      text: data
    })
  },
  
  // 提交产品信息 (对应 /tg_api/app_add_submit)
  submit: (data: any, token: string) => {
    return apiClient.post('/tg_api/app_add_submit', {
      token: token,
      ...data
    })
  },
  
  // 获取提交历史 (暂时使用验证接口的返回数据)
  getHistory: (params?: any) => {
    return Promise.resolve({ data: [] })
  }
}

// 商务认款相关接口
export const businessPaymentAPI = {
  // 获取认款信息 (对应 /tg_api/get_trade_info)
  getInfo: (token: string, adminId: string) => {
    return apiClient.post('/tg_api/get_trade_info', {
      token: token,
      admin_id: adminId
    })
  },
  
  // 确认认款 (对应 /tg_api/update_app_info)
  confirm: (data: any, token: string) => {
    return apiClient.post('/tg_api/update_app_info', {
      token: token,
      ...data
    })
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

export default apiClient
