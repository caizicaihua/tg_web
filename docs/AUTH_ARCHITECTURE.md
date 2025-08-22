# 认证架构文档

## 概述

本项目采用统一的认证架构，所有 API 请求都会自动携带认证 token，无需在每个页面中重复处理。

## 认证流程

### 1. Token 获取优先级

```typescript
// 优先级：Telegram start_param > URL参数 > null
const token = getAuthToken()
```

1. **Telegram Web App start_param**（推荐）
   - 通过 BotFather 设置 Web App 的 `start_parameter`
   - 用户通过 `/start your_token` 启动 Web App

2. **URL 参数**（兼容性）
   - 通过 URL 查询参数传递：`?token=your_token`
   - 主要用于开发和测试

### 2. 自动认证

所有 API 请求都会自动添加认证信息：

```typescript
// 请求拦截器自动处理
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    // 添加到请求头
    config.headers.Authorization = `Bearer ${token}`
    // 同时添加到请求体（兼容后端）
    if (config.data && typeof config.data === 'object') {
      config.data.token = token
    }
  }
  return config
})
```

## 文件结构

```
src/services/
├── auth.ts          # 认证服务 - 统一管理token
└── api.ts           # API服务 - 自动处理认证
```

## 使用方法

### 在页面中使用

```typescript
import { getAuthToken, getTokenStatus } from '@/services/api'

// 获取token
const token = getAuthToken()

// 获取token状态信息
const status = getTokenStatus()
// 返回：{ hasToken: boolean, token: string, source: 'telegram' | 'url' | 'none' }

// 检查token是否存在
if (getAuthToken()) {
  // token存在，可以发送请求
}
```

### API 调用

```typescript
import { productAPI } from '@/services/api'

// 无需手动传递token，会自动添加
// 无需手动处理code状态，会自动处理
const response = await productAPI.validate('产品信息')

// 成功时直接获取数据
const data = response.data

// 失败时会自动抛出错误，包含后端的msg信息
try {
  const response = await productAPI.validate('产品信息')
  // 处理成功情况
} catch (error) {
  // error.message 包含后端的错误信息
  console.error(error.message)
}
```

## 认证服务 API

### AuthService 类

```typescript
class AuthService {
  // 获取认证token
  static getToken(): string | null
  
  // 检查是否有有效的token
  static hasToken(): boolean
  
  // 获取token状态信息
  static getTokenStatus(): {
    hasToken: boolean
    token: string | null
    source: 'telegram' | 'url' | 'none'
  }
  
  // 验证token有效性
  static validateToken(token: string): boolean
}
```

### 便捷函数

```typescript
// 获取token
const token = getAuthToken()

// 检查token存在
const hasToken = hasAuthToken()

// 获取状态
const status = getTokenStatus()

// 验证token
const isValid = validateToken(token)
```

## 响应处理

### 统一的状态码处理

所有 API 响应都会在响应拦截器中统一处理：

```typescript
// 响应拦截器自动处理
apiClient.interceptors.response.use((response) => {
  const data = response.data
  
  // 统一处理业务状态码
  if (data && typeof data.code !== 'undefined') {
    if (data.code === 1) {
      // 成功状态，直接返回数据
      return data
    } else if (data.code === -1) {
      // 业务错误，抛出错误信息
      const errorMessage = data.msg || data.message || '操作失败'
      return Promise.reject(new Error(errorMessage))
    } else {
      // 其他状态码，抛出错误
      const errorMessage = data.msg || data.message || `未知错误 (code: ${data.code})`
      return Promise.reject(new Error(errorMessage))
    }
  }
  
  // 如果没有code字段，直接返回数据
  return data
})
```

### 状态码说明

- **`code: 1`**：成功状态，正常返回数据
- **`code: -1`**：业务错误，自动抛出 `msg` 字段的错误信息
- **其他值**：未知错误，抛出相应的错误信息

### 错误处理

当 token 不存在或无效时：

1. **API 层面**：请求拦截器会记录警告
2. **响应层面**：401 错误会被自动处理
3. **UI 层面**：页面会显示相应的错误信息

### 错误信息

```typescript
// 认证失败时的错误信息
'缺少访问令牌，请检查Telegram Web App配置'

// 业务错误时的错误信息
'产品信息验证失败' // 来自后端的 msg 字段
```

## 配置说明

### Telegram Web App 配置

在 BotFather 中设置：

```
/setmenubutton
```

设置 `start_parameter` 为你的认证 token。

### 环境变量

```env
# API 基础URL
VITE_API_BASE_URL=https://bx.jbtls.xyz
```

## 最佳实践

1. **优先使用 Telegram start_param**：更安全，用户体验更好
2. **URL 参数作为备用**：便于开发和测试
3. **统一错误处理**：所有认证错误都通过认证服务处理
4. **状态显示**：在 UI 中显示 token 状态和来源

## 安全考虑

1. **Token 验证**：在认证服务中可以添加 token 格式验证
2. **HTTPS 要求**：生产环境必须使用 HTTPS
3. **Token 过期处理**：可以在响应拦截器中处理 token 过期
4. **敏感信息**：避免在客户端存储敏感信息

## 扩展功能

### 添加 Token 验证

```typescript
// 在 auth.ts 中添加自定义验证
static validateToken(token: string): boolean {
  // 添加你的验证逻辑
  return !!token && token.length > 0 && /^[a-zA-Z0-9_-]+$/.test(token)
}
```

### 添加 Token 刷新

```typescript
// 在响应拦截器中处理 token 过期
if (error.response?.status === 401) {
  // 处理 token 过期逻辑
  console.error('Token已过期，需要重新认证')
}
```
