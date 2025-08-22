#!/bin/bash

# 自动部署设置脚本
# 一键配置自动部署环境

echo "🚀 设置自动部署环境..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p .github/workflows
mkdir -p scripts

# 设置文件权限
echo "🔐 设置文件权限..."
chmod +x auto-deploy.sh
chmod +x server-deploy.sh
chmod +x dev-https.sh

# 检查 Git 仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# 检查远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🌐 请设置 Git 远程仓库："
    echo "git remote add origin https://github.com/your-username/tg-web.git"
fi

# 安装开发依赖
echo "📦 安装开发依赖..."
npm install --save-dev chokidar

# 创建配置文件模板
echo "📝 创建配置文件模板..."

cat > .env.example << EOF
# 服务器配置
SERVER_HOST=your-server.com
SERVER_USER=your-username
SERVER_PATH=/var/www/tg-web

# Telegram Bot 配置
BOT_TOKEN=your-bot-token
WEB_APP_URL=https://your-server.com

# 开发配置
DEV_PORT=5173
HTTPS_PORT=5175
EOF

echo "✅ 自动部署环境设置完成！"
echo ""
echo "📋 下一步："
echo "1. 编辑 .env.example 并重命名为 .env"
echo "2. 配置服务器环境"
echo "3. 设置 GitHub Secrets（如果使用 GitHub Actions）"
echo "4. 运行 'npm run deploy:auto' 进行首次部署"
echo ""
echo "📚 详细说明请查看 AUTO_DEPLOY_GUIDE.md"
