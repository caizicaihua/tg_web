#!/bin/bash

# 简单的后台运行脚本
# 用于快速启动监听服务

# 配置信息
PROJECT_PATH="/data/www/tg_web"
LOG_FILE="/data/logs/tg-web-watch.log"
PID_FILE="/tmp/tg-web-watch.pid"

# 检查是否已经在运行
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️  服务已经在运行 (PID: $PID)"
        echo "📋 使用以下命令停止服务："
        echo "   kill $PID"
        echo "   或者运行: ./stop-watch-daemon.sh"
        exit 1
    else
        echo "🧹 清理过期的 PID 文件"
        rm -f "$PID_FILE"
    fi
fi

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

# 启动服务
echo "🚀 启动监听部署服务..."
nohup "$PROJECT_PATH/watch-and-deploy.sh" > "$LOG_FILE" 2>&1 &

# 保存 PID
echo $! > "$PID_FILE"

echo "✅ 服务已启动 (PID: $!)"
echo "📝 日志文件: $LOG_FILE"
echo "📋 使用以下命令管理服务："
echo "   查看状态: ps -p $!"
echo "   查看日志: tail -f $LOG_FILE"
echo "   停止服务: kill $!"
echo "   或者运行: ./stop-watch-daemon.sh"
