#!/bin/bash

# Telegram Web App 部署脚本

echo "🚀 开始构建 Telegram Web App..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于 dist/ 目录"
    echo ""
    echo "📋 部署步骤："
    echo "1. 将 dist/ 目录的内容上传到你的服务器"
    echo "2. 确保服务器支持 HTTPS"
    echo "3. 在 BotFather 中设置 Web App URL"
    echo ""
    echo "🌐 示例 URL: https://your-domain.com"
    echo ""
    echo "📱 在 Telegram Bot 中使用："
    echo "bot.sendMessage(chatId, '打开 Web App', {"
    echo "  reply_markup: {"
    echo "    inline_keyboard: [[{"
    echo "      text: '打开 Web App',"
    echo "      web_app: { url: 'https://your-domain.com' }"
    echo "    }]]"
    echo "  }"
    echo "})"
else
    echo "❌ 构建失败！"
    exit 1
fi
