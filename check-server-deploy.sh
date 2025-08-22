#!/bin/bash

# 检查服务器部署状态的脚本

echo "🔍 检查服务器部署状态..."

# 检查服务器脚本是否存在
if [ -f "watch-and-deploy.sh" ]; then
    echo "✅ 服务器脚本存在"
else
    echo "❌ 服务器脚本不存在"
fi

# 检查项目路径
PROJECT_PATH="/data/www/tg_web"
if [ -d "$PROJECT_PATH" ]; then
    echo "✅ 项目路径存在: $PROJECT_PATH"
else
    echo "❌ 项目路径不存在: $PROJECT_PATH"
    echo "💡 请修改 watch-and-deploy.sh 中的 PROJECT_PATH"
fi

# 检查日志目录
LOG_DIR="/data/logs"
if [ -d "$LOG_DIR" ]; then
    echo "✅ 日志目录存在: $LOG_DIR"
else
    echo "❌ 日志目录不存在: $LOG_DIR"
    echo "💡 请创建日志目录: mkdir -p $LOG_DIR"
fi

# 检查 Git 仓库状态
if [ -d ".git" ]; then
    echo "✅ Git 仓库存在"
    echo "📝 当前分支: $(git branch --show-current)"
    echo "📝 远程仓库: $(git remote get-url origin)"
else
    echo "❌ Git 仓库不存在"
fi

# 检查 Node.js 和 npm
if command -v node &> /dev/null; then
    echo "✅ Node.js 已安装: $(node --version)"
else
    echo "❌ Node.js 未安装"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm 已安装: $(npm --version)"
else
    echo "❌ npm 未安装"
fi

# 检查监听进程
echo ""
echo "🔍 检查监听进程..."
if pgrep -f "watch-and-deploy" > /dev/null; then
    echo "✅ 监听进程正在运行"
    ps aux | grep watch-and-deploy | grep -v grep
else
    echo "❌ 监听进程未运行"
fi

# 检查日志文件
LOG_FILE="/data/logs/tg-web-watch.log"
if [ -f "$LOG_FILE" ]; then
    echo "✅ 日志文件存在: $LOG_FILE"
    echo "📝 最后几行日志:"
    tail -5 "$LOG_FILE" 2>/dev/null || echo "无法读取日志文件"
else
    echo "❌ 日志文件不存在: $LOG_FILE"
fi

echo ""
echo "🎯 建议的解决步骤:"
echo "1. 确保服务器路径正确: /data/www/tg_web"
echo "2. 创建日志目录: mkdir -p /data/logs"
echo "3. 设置正确权限: chmod +x watch-and-deploy.sh"
echo "4. 启动监听服务: ./watch-and-deploy.sh"
echo "5. 检查日志: tail -f /data/logs/tg-web-watch.log"
