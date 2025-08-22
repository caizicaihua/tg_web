# 🧪 本地测试指南

## ✅ 当前状态

你的 HTTPS 开发服务器已经启动：
- **本地地址**: https://localhost:5175
- **局域网地址**: https://192.168.31.31:5175

## 📋 测试步骤

### 1. 浏览器测试

首先在浏览器中测试基础功能：

1. **打开浏览器**，访问 https://localhost:5175
2. **检查页面**是否正常加载
3. **测试功能**：
   - 用户信息显示
   - 主题切换
   - 按钮响应
   - 触觉反馈

### 2. 创建 Telegram Bot

#### 步骤 1: 创建 Bot
1. 在 Telegram 中找到 [@BotFather](https://t.me/botfather)
2. 发送 `/newbot` 命令
3. 设置 Bot 名称和用户名
4. 保存获得的 Bot Token

#### 步骤 2: 配置 Web App
1. 发送 `/newapp` 给 BotFather
2. 选择你的 Bot
3. 设置 Web App 信息：
   - 标题: "我的 Web App"
   - 描述: "测试应用"
   - URL: `https://192.168.31.31:5175`

### 3. 运行测试 Bot

#### 安装依赖
```bash
# 安装 Bot 依赖
npm install node-telegram-bot-api

# 或者使用提供的 package.json
cp test-bot-package.json package.json
npm install
```

#### 配置 Bot Token
编辑 `test-bot.js` 文件：
```javascript
const token = 'YOUR_BOT_TOKEN'; // 替换为你的 Bot Token
```

#### 启动 Bot
```bash
node test-bot.js
```

### 4. 测试 Web App

#### 在 Telegram 中测试
1. 找到你的 Bot
2. 发送 `/start` 命令
3. 点击 "🚀 打开 Web App" 按钮
4. 测试各项功能

#### 测试功能清单
- [ ] 页面正常加载
- [ ] 用户信息显示
- [ ] 主题适配
- [ ] 主按钮功能
- [ ] 返回按钮功能
- [ ] 触觉反馈
- [ ] 通知显示

## 🔧 调试工具

### 1. 浏览器开发者工具
```javascript
// 在控制台中测试
console.log(window.Telegram.WebApp.initDataUnsafe.user)
console.log(window.Telegram.WebApp.themeParams)
console.log(window.Telegram.WebApp.platform)
```

### 2. 移动端调试
1. 在手机 Chrome 中访问 `chrome://inspect`
2. 在电脑 Chrome 中打开 `chrome://inspect`
3. 连接设备进行调试

### 3. 网络调试
```bash
# 检查 HTTPS 连接
curl -k https://localhost:5175

# 检查证书
openssl s_client -connect localhost:5175 -servername localhost
```

## 🐛 常见问题

### 1. 页面无法加载
**解决方案**：
- 检查开发服务器是否运行
- 确认端口号是否正确
- 检查防火墙设置

### 2. 证书不受信任
**解决方案**：
- 点击"高级" → "继续访问"
- 或者重新运行 `mkcert -install`

### 3. 移动端无法访问
**解决方案**：
- 确保手机和电脑在同一网络
- 使用正确的 IP 地址
- 检查防火墙设置

### 4. Telegram Web App 无法打开
**解决方案**：
- 确认 URL 是 HTTPS
- 检查 Bot 配置
- 查看浏览器控制台错误

## 📱 移动端测试

### 1. 手机浏览器测试
1. 在手机浏览器中访问 https://192.168.31.31:5175
2. 测试响应式布局
3. 测试触摸操作

### 2. Telegram 内测试
1. 在 Telegram 中打开 Web App
2. 测试所有功能
3. 检查性能表现

## 🎯 测试重点

### 功能测试
- ✅ 用户信息获取
- ✅ 主题适配
- ✅ 按钮响应
- ✅ 数据传递

### 性能测试
- ✅ 加载速度
- ✅ 响应时间
- ✅ 内存使用
- ✅ 网络请求

### 兼容性测试
- ✅ 不同设备
- ✅ 不同浏览器
- ✅ 不同网络环境

## 📊 测试报告

完成测试后，记录以下信息：

### 测试环境
- 设备: [设备型号]
- 系统: [操作系统版本]
- 浏览器: [浏览器版本]
- 网络: [网络类型]

### 测试结果
- 功能测试: [通过/失败]
- 性能测试: [通过/失败]
- 兼容性测试: [通过/失败]

### 发现的问题
- [问题描述]
- [解决方案]
- [优先级]

---

**🎉 开始你的本地测试吧！**
