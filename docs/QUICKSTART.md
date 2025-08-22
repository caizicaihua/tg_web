# 🚀 快速开始指南

## 1. 项目设置

### 克隆项目
```bash
git clone <your-repo-url>
cd tg_web
```

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 查看项目

## 2. 创建 Telegram Bot

### 步骤 1: 创建 Bot
1. 在 Telegram 中找到 [@BotFather](https://t.me/botfather)
2. 发送 `/newbot` 命令
3. 按照提示设置 Bot 名称和用户名
4. 保存获得的 Bot Token

### 步骤 2: 设置 Web App
1. 发送 `/newapp` 或 `/setmenubutton` 给 BotFather
2. 选择你的 Bot
3. 设置 Web App 标题和描述
4. 上传 Web App 图标（可选）
5. 设置 Web App URL（部署后填写）

## 3. 部署 Web App

### 构建项目
```bash
npm run build
```

### 部署到服务器
1. 将 `dist/` 目录内容上传到你的服务器
2. 确保服务器支持 HTTPS
3. 更新 Bot 中的 Web App URL

### 使用部署脚本
```bash
npm run deploy
```

## 4. 运行 Bot

### 安装 Bot 依赖
```bash
cd examples
npm install
```

### 配置 Bot
编辑 `bot-example.js`：
```javascript
const token = 'YOUR_BOT_TOKEN' // 替换为你的 Bot Token
const WEB_APP_URL = 'https://your-domain.com' // 替换为你的 Web App URL
```

### 启动 Bot
```bash
npm start
```

## 5. 测试

1. 在 Telegram 中找到你的 Bot
2. 发送 `/start` 命令
3. 点击 "打开 Web App" 按钮
4. 测试各项功能

## 6. 自定义开发

### 添加新页面
1. 在 `src/views/` 创建新的 Vue 组件
2. 在 `src/router/index.ts` 添加路由
3. 在 Bot 中添加对应的按钮

### 添加新功能
1. 在 `src/utils/telegram.ts` 添加新方法
2. 在 `src/stores/telegram.ts` 添加状态管理
3. 在组件中使用新功能

### 修改样式
1. 在 `src/App.vue` 修改全局样式
2. 在组件中使用 `scoped` 样式
3. 使用 Naive UI 组件库

## 7. 常见问题

### Q: Web App 无法打开？
A: 确保：
- 服务器支持 HTTPS
- URL 正确配置
- Bot 已正确设置

### Q: 用户信息无法获取？
A: 确保：
- 在 Telegram 环境中运行
- 用户已授权
- SDK 正确初始化

### Q: 样式显示异常？
A: 检查：
- 主题变量是否正确
- CSS 是否正确加载
- 浏览器兼容性

## 8. 下一步

- 阅读 [Telegram Web App 文档](https://core.telegram.org/bots/webapps)
- 查看 [Vue 3 文档](https://vuejs.org/)
- 探索 [Naive UI 组件](https://www.naiveui.com/)
- 加入 Telegram 开发者社区

## 9. 支持

如果遇到问题：
1. 查看项目 README.md
2. 检查控制台错误信息
3. 提交 Issue 到项目仓库
4. 联系开发者

---

🎉 恭喜！你已经成功搭建了一个 Telegram Web App！
