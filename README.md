# Telegram Web App - Vue 3

这是一个基于 Vue 3 + TypeScript + Vite 的 Telegram Web App 项目模板。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 现代化的构建工具
- **Pinia** - Vue 3 官方状态管理库
- **Vue Router 4** - Vue 3 官方路由
- **Naive UI** - Vue 3 组件库
- **@twa-dev/sdk** - Telegram Web App 官方 SDK

## 📦 项目结构

```
src/
├── components/          # 通用组件
├── views/              # 页面组件
├── stores/             # Pinia 状态管理
│   └── telegram.ts     # Telegram 相关状态
├── utils/              # 工具函数
│   └── telegram.ts     # Telegram Web App 工具类
├── router/             # 路由配置
├── assets/             # 静态资源
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## 🛠️ 开发环境设置

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码格式化

```bash
npm run format
```

### 代码检查

```bash
npm run lint
```

## 📱 Telegram Web App 功能

### 已实现功能

- ✅ 用户信息获取和显示
- ✅ 聊天信息获取
- ✅ 启动参数处理
- ✅ 主题适配（明暗主题）
- ✅ 主按钮和返回按钮
- ✅ 触觉反馈
- ✅ 通知显示
- ✅ 平台信息获取

### 核心组件

#### TelegramService (`src/utils/telegram.ts`)
Telegram Web App SDK 的封装类，提供以下功能：

- 用户信息获取
- 聊天信息获取
- 按钮控制（主按钮、返回按钮）
- 触觉反馈
- 通知显示
- 主题设置
- 应用关闭

#### TelegramStore (`src/stores/telegram.ts`)
基于 Pinia 的状态管理，管理：

- 用户状态
- 聊天状态
- 应用配置
- 主题设置

## 🎨 UI 组件

项目使用 Naive UI 作为 UI 组件库，提供了：

- 卡片组件 (NCard)
- 按钮组件 (NButton)
- 头像组件 (NAvatar)
- 标签组件 (NTag)
- 分割线组件 (NDivider)
- 文本组件 (NText)
- 图标组件 (NIcon)

## 🌙 主题支持

项目支持 Telegram 的明暗主题：

- 自动检测系统主题
- 支持 Telegram 主题变量
- 响应式主题切换

## 📋 使用说明

### 1. 在 Telegram Bot 中设置 Web App

```javascript
// 设置 Web App 信息
bot.setMyCommands([
  {
    command: 'start',
    description: '启动 Web App'
  }
])

// 发送 Web App 按钮
bot.sendMessage(chatId, '点击按钮打开 Web App', {
  reply_markup: {
    inline_keyboard: [[
      {
        text: '打开 Web App',
        web_app: {
          url: 'https://your-domain.com'
        }
      }
    ]]
  }
})
```

### 2. 部署到服务器

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到你的服务器
3. 确保服务器支持 HTTPS（Telegram Web App 要求）

### 3. 配置 Bot

在 BotFather 中设置你的 Web App：

1. 发送 `/newapp` 或 `/setmenubutton`
2. 选择你的 bot
3. 设置 Web App URL
4. 配置 Web App 信息

## 🔧 自定义配置

### 修改主题颜色

在 `src/App.vue` 中修改 CSS 变量：

```css
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-hint-color: #999999;
  --tg-theme-link-color: #2481cc;
  --tg-theme-button-color: #2481cc;
  --tg-theme-button-text-color: #ffffff;
}
```

### 添加新功能

1. 在 `src/utils/telegram.ts` 中添加新的方法
2. 在 `src/stores/telegram.ts` 中添加对应的状态管理
3. 在组件中使用新的功能

## 📚 相关文档

- [Vue 3 官方文档](https://vuejs.org/)
- [Telegram Web App 文档](https://core.telegram.org/bots/webapps)
- [@twa-dev/sdk 文档](https://docs.twa.dev/)
- [Naive UI 文档](https://www.naiveui.com/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
