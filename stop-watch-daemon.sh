#!/bin/bash

# 停止监听部署服务

PID_FILE="/tmp/tg-web-watch.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "🛑 停止监听部署服务 (PID: $PID)..."
        kill $PID
        
        # 等待进程结束
        for i in {1..10}; do
            if ! ps -p $PID > /dev/null 2>&1; then
                echo "✅ 服务已停止"
                rm -f "$PID_FILE"
                exit 0
            fi
            sleep 1
        done
        
        # 强制杀死进程
        echo "⚠️  强制停止服务..."
        kill -9 $PID
        rm -f "$PID_FILE"
        echo "✅ 服务已强制停止"
    else
        echo "⚠️  服务未运行"
        rm -f "$PID_FILE"
    fi
else
    echo "⚠️  PID 文件不存在，服务可能未运行"
fi
