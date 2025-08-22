# Telegram Web App - Vue 3 + Quasar

这是一个基于 Vue 3 + TypeScript + Vite + Quasar 的 Telegram Web App 项目模板。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 现代化的构建工具
- **Pinia** - Vue 3 官方状态管理库
- **Vue Router 4** - Vue 3 官方路由
- **Quasar** - 移动优先的 Vue 框架
- **@twa-dev/sdk** - Telegram Web App 官方 SDK

## 📦 项目结构

```
tg_web/
├── src/                    # 源代码
│   ├── components/         # 通用组件
│   │   └── TelegramTestPanel.vue  # Telegram 测试面板
│   ├── views/             # 页面组件
│   │   ├── HomeView.vue   # 主页面
│   │   └── TestView.vue   # 测试页面
│   ├── stores/            # Pinia 状态管理
│   │   └── telegram.ts    # Telegram 相关状态
│   ├── utils/             # 工具函数
│   │   ├── telegram.ts    # Telegram Web App 工具类
│   │   └── telegram-mock.ts # 模拟 Telegram 环境
│   ├── router/            # 路由配置
│   ├── assets/            # 静态资源
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── docs/                  # 项目文档
│   ├── LOCAL_DEV_GUIDE.md # 本地开发指南
│   ├── TESTING_GUIDE.md   # 测试指南
│   ├── AUTO_DEPLOY_GUIDE.md # 自动部署指南
│   └── QUICKSTART.md      # 快速开始指南
├── examples/              # 示例代码
│   ├── bot-example.js     # Bot 示例
│   └── package.json       # Bot 依赖
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # 部署配置
├── deploy.sh              # 手动部署脚本
├── auto-deploy.sh         # 自动部署脚本
├── server-deploy.sh       # 服务器部署脚本
├── setup-auto-deploy.sh   # 部署环境设置脚本
├── nginx.conf             # Nginx 配置
├── test-bot.js            # 测试 Bot
└── README.md              # 项目说明
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

访问地址：
- 本地：http://localhost:5173
- 测试面板：http://localhost:5173/test
- 局域网：http://你的IP地址:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run serve
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
- ✅ 模拟环境支持

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

#### TelegramTestPanel (`src/components/TelegramTestPanel.vue`)
专门的测试面板，提供：

- 环境检测
- 用户信息显示
- API 功能测试
- 实时日志输出

## 🎨 UI 组件

项目使用 Quasar 作为 UI 框架，提供了：

- 页面组件 (q-page)
- 卡片组件 (q-card)
- 按钮组件 (q-btn)
- 头像组件 (q-avatar)
- 标签组件 (q-chip)
- 分割线组件 (q-separator)
- 列表组件 (q-list)
- 图标组件 (q-icon)

### Quasar 优势

- 🎯 **移动优先**：专为移动端设计
- 📱 **原生功能**：支持原生应用功能
- 🎨 **Material Design**：现代化的设计语言
- ⚡ **高性能**：优化的渲染性能
- 🔧 **开发工具**：丰富的开发工具

## 🌙 主题支持

项目支持 Telegram 的明暗主题：

- 自动检测系统主题
- 支持 Telegram 主题变量
- 响应式主题切换
- Quasar 主题系统集成

## 🧪 测试环境

### 模拟环境
项目包含完整的模拟环境，支持：

- 本地开发测试
- 模拟用户数据
- 模拟 Telegram API
- 实时功能测试

### 测试面板
访问 `/test` 路由查看测试面板：

- 环境信息显示
- 用户信息展示
- API 功能测试
- 实时日志输出

## 📋 使用说明

### 1. 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问测试面板
# http://localhost:5173/test
```

### 2. 在 Telegram Bot 中设置 Web App

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

### 3. 部署到服务器

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到你的服务器
3. 确保服务器支持 HTTPS（Telegram Web App 要求）

### 4. 配置 Bot

在 BotFather 中设置你的 Web App：

1. 发送 `/newapp` 或 `/setmenubutton`
2. 选择你的 bot
3. 设置 Web App URL
4. 配置 Web App 信息

## 🔧 自定义配置

### 修改主题颜色

在 `src/main.ts` 中修改 Quasar 配置：

```typescript
app.use(Quasar, {
  config: {
    brand: {
      primary: '#2481cc',
      secondary: '#64baf0',
      accent: '#999999',
      dark: '#1a1a1a',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
  }
})
```

### 添加新功能

1. 在 `src/utils/telegram.ts` 中添加新的方法
2. 在 `src/stores/telegram.ts` 中添加对应的状态管理
3. 在组件中使用新的功能

## 🚀 自动化部署

项目包含完整的自动化部署系统：

### 本地自动部署
```bash
npm run deploy:auto
```

### 监听文件变化
```bash
npm run deploy:watch
```

### GitHub Actions
项目包含 `.github/workflows/deploy.yml` 配置，支持：

- 自动构建
- 自动部署
- 服务器配置

## 📚 相关文档

- [Vue 3 官方文档](https://vuejs.org/)
- [Quasar 官方文档](https://quasar.dev/)
- [Telegram Web App 文档](https://core.telegram.org/bots/webapps)
- [@twa-dev/sdk 文档](https://docs.twa.dev/)

## 📖 项目文档

- [本地开发指南](docs/LOCAL_DEV_GUIDE.md)
- [测试指南](docs/TESTING_GUIDE.md)
- [自动部署指南](docs/AUTO_DEPLOY_GUIDE.md)
- [快速开始指南](docs/QUICKSTART.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
