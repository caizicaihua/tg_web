# API 接口文档

## 基础信息

- **基础URL**: `http://localhost:3000/api` (开发环境)
- **认证方式**: Bearer Token (可选)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 产品录入接口

### 1. 验证产品信息

**接口**: `POST /product/validate`

**请求参数**:
```json
{
  "data": "产品信息字符串"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "验证成功",
  "data": {
    "id": "PROD001",
    "name": "产品名称",
    "status": "validated",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 提交产品信息

**接口**: `POST /product/submit`

**请求参数**:
```json
{
  "productData": "产品信息字符串"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "提交成功",
  "data": {
    "id": "PROD001",
    "submittedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. 获取提交历史

**接口**: `GET /product/history`

**查询参数**:
- `page`: 页码 (可选，默认1)
- `limit`: 每页数量 (可选，默认20)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "PROD001",
      "productData": "产品信息",
      "success": true,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 商务认款接口

### 1. 获取认款信息

**接口**: `GET /business/payment/{id}`

**路径参数**:
- `id`: 认款ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "PAY001",
    "amount": "10000.00",
    "recipient": "收款方名称",
    "payer": "付款方名称",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "description": "认款描述"
  }
}
```

### 2. 确认认款

**接口**: `POST /business/payment/confirm`

**请求参数**:
```json
{
  "paymentId": "PAY001",
  "remark": "备注信息",
  "paymentMethod": "bank_transfer",
  "transactionId": "交易流水号",
  "agreed": true
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "确认成功",
  "data": {
    "confirmedAt": "2024-01-01T00:00:00.000Z",
    "confirmedBy": "用户名称"
  }
}
```

### 3. 获取操作日志

**接口**: `GET /business/payment/{id}/logs`

**路径参数**:
- `id`: 认款ID

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "action": "created",
      "description": "认款信息已创建",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "details": "金额: ¥10000.00"
    }
  ]
}
```

## 商务流水接口

### 1. 获取流水列表

**接口**: `GET /business/transactions`

**查询参数**:
- `page`: 页码 (可选，默认1)
- `rowsPerPage`: 每页数量 (可选，默认20)
- `sortBy`: 排序字段 (可选，默认createdAt)
- `descending`: 是否降序 (可选，默认true)
- `status`: 状态筛选 (可选)
- `type`: 类型筛选 (可选)
- `search`: 搜索关键词 (可选)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "TX001",
      "address": "商务地址",
      "amount": "1000.00",
      "type": "income",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "remark": "备注信息"
    }
  ],
  "total": 100,
  "statistics": {
    "totalIncome": "50000.00",
    "totalExpense": "30000.00",
    "totalCount": 100
  }
}
```

### 2. 获取统计信息

**接口**: `GET /business/transactions/statistics`

**查询参数**:
- `status`: 状态筛选 (可选)
- `type`: 类型筛选 (可选)
- `search`: 搜索关键词 (可选)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalIncome": "50000.00",
    "totalExpense": "30000.00",
    "totalCount": 100
  }
}
```

### 3. 获取交易详情

**接口**: `GET /business/transactions/{id}`

**路径参数**:
- `id`: 交易ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "TX001",
    "address": "商务地址",
    "amount": "1000.00",
    "type": "income",
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "remark": "备注信息"
  }
}
```

### 4. 更新交易

**接口**: `PUT /business/transactions/{id}`

**路径参数**:
- `id`: 交易ID

**请求参数**:
```json
{
  "status": "completed",
  "remark": "更新备注"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 通用接口

### 1. 文件上传

**接口**: `POST /upload`

**请求格式**: `multipart/form-data`

**请求参数**:
- `file`: 文件对象

**响应示例**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/file.jpg",
    "filename": "file.jpg",
    "size": 1024
  }
}
```

### 2. 获取配置

**接口**: `GET /config`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "appName": "Telegram Web App",
    "version": "1.0.0",
    "features": ["product", "payment", "transaction"]
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "message": "错误信息",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 常见错误码

- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

## 认证

### Bearer Token 认证

在请求头中添加：

```
Authorization: Bearer <your-token>
```

### 获取 Token

```javascript
// 从 localStorage 获取
const token = localStorage.getItem('auth_token')

// 设置到请求头
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```
