// Telegram Bot 示例代码
// 使用 node-telegram-bot-api 库

const TelegramBot = require('node-telegram-bot-api')

// 替换为你的 Bot Token
const token = 'YOUR_BOT_TOKEN'
const bot = new TelegramBot(token, { polling: true })

// Web App URL（部署后替换）
const WEB_APP_URL = 'https://your-domain.com'

// 处理 /start 命令
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const username = msg.from.username || msg.from.first_name
  
  const welcomeMessage = `👋 你好 ${username}！

欢迎使用我们的 Telegram Web App！

点击下面的按钮打开 Web App：`

  const keyboard = {
    inline_keyboard: [[
      {
        text: '🚀 打开 Web App',
        web_app: { url: WEB_APP_URL }
      }
    ]]
  }

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: keyboard
  })
})

// 处理 Web App 数据
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id
  const webAppData = msg.web_app_data.data
  
  console.log('收到 Web App 数据:', webAppData)
  
  // 处理从 Web App 发送的数据
  try {
    const data = JSON.parse(webAppData)
    
    await bot.sendMessage(chatId, `✅ 收到 Web App 数据：
    
📝 内容: ${data.message || '无'}
⏰ 时间: ${new Date().toLocaleString()}`)
    
  } catch (error) {
    console.error('解析 Web App 数据失败:', error)
    await bot.sendMessage(chatId, '❌ 处理数据时出错')
  }
})

// 处理菜单按钮
bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id
  
  const menuMessage = `📱 主菜单

选择以下选项：`

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 打开 Web App',
          web_app: { url: WEB_APP_URL }
        }
      ],
      [
        {
          text: 'ℹ️ 关于',
          callback_data: 'about'
        },
        {
          text: '⚙️ 设置',
          callback_data: 'settings'
        }
      ]
    ]
  }

  await bot.sendMessage(chatId, menuMessage, {
    reply_markup: keyboard
  })
})

// 处理回调查询
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id
  const data = query.data

  switch (data) {
    case 'about':
      await bot.answerCallbackQuery(query.id, { text: '关于我们' })
      await bot.sendMessage(chatId, `ℹ️ 关于

这是一个基于 Vue 3 的 Telegram Web App 示例。

功能包括：
• 用户信息显示
• 主题适配
• 触觉反馈
• 通知系统

技术栈：
• Vue 3 + TypeScript
• Naive UI
• Telegram Web App SDK`)
      break
      
    case 'settings':
      await bot.answerCallbackQuery(query.id, { text: '设置' })
      await bot.sendMessage(chatId, '⚙️ 设置功能开发中...')
      break
      
    default:
      await bot.answerCallbackQuery(query.id, { text: '未知选项' })
  }
})

// 错误处理
bot.on('error', (error) => {
  console.error('Bot 错误:', error)
})

bot.on('polling_error', (error) => {
  console.error('轮询错误:', error)
})

console.log('🤖 Bot 已启动...')
console.log('📱 Web App URL:', WEB_APP_URL)

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭 Bot...')
  bot.stopPolling()
  process.exit(0)
})

module.exports = bot
