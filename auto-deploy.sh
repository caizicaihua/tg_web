#!/bin/bash

# 自动部署脚本
# 本地修改代码后自动部署到服务器

# 配置信息
SERVER_HOST="your-server.com"
SERVER_USER="your-username"
SERVER_PATH="/var/www/tg-web"
LOCAL_PATH="$(pwd)"

echo "🚀 开始自动部署..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 检测到未提交的更改，正在提交..."
    git add .
    git commit -m "Auto deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git push origin main

# 等待部署完成
echo "⏳ 等待服务器部署完成..."
sleep 10

# 检查部署状态
echo "🔍 检查部署状态..."
curl -s -o /dev/null -w "%{http_code}" https://$SERVER_HOST

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问地址: https://$SERVER_HOST"
    echo "📱 Telegram Web App URL: https://$SERVER_HOST"
else
    echo "❌ 部署失败，请检查服务器状态"
fi
