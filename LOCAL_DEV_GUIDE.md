# 🚀 本地开发指南

## 📋 快速开始

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 访问地址
- **本地访问**: http://localhost:5173
- **局域网访问**: http://你的IP地址:5173

### 3. 获取本机 IP
```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I
```

## 🧪 测试功能

### 1. 主页面
访问 http://localhost:5173 查看主页面

### 2. 测试面板
访问 http://localhost:5173/test 查看测试面板

### 3. 模拟环境
- 测试面板会自动检测是否在 Telegram 环境中
- 在浏览器中会使用模拟数据
- 所有 Telegram Web App API 都会被模拟

## 📱 移动端测试

### 1. 手机浏览器测试
1. 确保手机和电脑在同一网络
2. 在手机浏览器中访问：http://你的IP地址:5173/test
3. 测试响应式布局和触摸操作

### 2. 开发调试
1. 在手机 Chrome 中访问 `chrome://inspect`
2. 在电脑 Chrome 中打开 `chrome://inspect`
3. 连接设备进行调试

## 🔧 开发工具

### 1. 浏览器开发者工具
```javascript
// 检查模拟环境
console.log(window.Telegram?.WebApp)

// 查看用户信息
console.log(window.Telegram?.WebApp?.initDataUnsafe?.user)
```

### 2. 热重载
- 修改代码后会自动刷新
- 支持 Vue 组件的热重载
- 支持 TypeScript 的类型检查

### 3. 代码检查
```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 📊 测试清单

### 基础功能
- [ ] 页面正常加载
- [ ] 用户信息显示
- [ ] 主题适配
- [ ] 响应式布局

### 模拟功能
- [ ] 主按钮显示/隐藏
- [ ] 返回按钮显示/隐藏
- [ ] 触觉反馈
- [ ] 通知系统
- [ ] 主题切换

### 移动端
- [ ] 触摸操作
- [ ] 滚动流畅
- [ ] 性能表现

## 🐛 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :5173

# 修改端口（在 vite.config.ts 中）
port: 3000
```

### 2. 依赖问题
```bash
# 重新安装依赖
npm install

# 清除缓存
npm cache clean --force
```

### 3. 移动端无法访问
- 确保手机和电脑在同一网络
- 检查防火墙设置
- 使用正确的 IP 地址

## 🎯 开发流程

### 1. 开发阶段
1. 启动开发服务器：`npm run dev`
2. 在浏览器中开发和测试
3. 使用测试面板验证功能
4. 在移动端测试响应式

### 2. 测试阶段
1. 部署到服务器进行真实测试
2. 在 Telegram 中测试完整功能
3. 收集用户反馈

### 3. 生产阶段
1. 构建生产版本：`npm run build`
2. 部署到服务器
3. 配置 Telegram Bot

## 📝 注意事项

1. **本地开发**：使用 HTTP，无需 HTTPS
2. **生产环境**：必须使用 HTTPS（Telegram 要求）
3. **模拟数据**：本地开发使用模拟的用户数据
4. **真实数据**：生产环境使用真实的 Telegram 用户数据

---

**�� 现在你可以轻松进行本地开发了！**
