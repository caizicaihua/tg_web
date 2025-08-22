#!/bin/bash

# 文件变化监听和自动部署脚本
# 每30秒检查一次Git仓库更新，有更新时自动重新构建

# 配置信息
PROJECT_PATH="/data/www/tg_web"
LOG_FILE="/data/logs/tg-web-watch.log"
CHECK_INTERVAL=30  # 检查间隔（秒）
LAST_COMMIT_FILE="/tmp/last_commit_hash"

echo "$(date): 🚀 启动文件监听和自动部署服务..." >> $LOG_FILE
echo "🚀 启动文件监听和自动部署服务..."
echo "📁 项目路径: $PROJECT_PATH"
echo "⏱️  检查间隔: ${CHECK_INTERVAL}秒"
echo "📝 日志文件: $LOG_FILE"
echo ""

# 进入项目目录
cd $PROJECT_PATH

# 获取当前提交哈希
get_current_commit() {
    git rev-parse HEAD 2>/dev/null
}

# 获取远程最新提交哈希
get_remote_commit() {
    git fetch origin main >/dev/null 2>&1
    git rev-parse origin/main 2>/dev/null
}

# 执行部署
deploy_project() {
    echo "$(date): 🔄 检测到更新，开始部署..." >> $LOG_FILE
    echo "🔄 检测到更新，开始部署..."
    
    # 拉取最新代码
    echo "$(date): 📥 拉取最新代码..." >> $LOG_FILE
    git pull origin main
    
    # 安装依赖
    echo "$(date): 📦 安装依赖..." >> $LOG_FILE
    npm ci --production
    
    # 构建项目
    echo "$(date): 🔨 构建项目..." >> $LOG_FILE
    if npm run build; then
        echo "$(date): ✅ 构建成功" >> $LOG_FILE
        
        # 设置权限
        echo "$(date): 🔐 设置权限..." >> $LOG_FILE
        chown -R www:www $PROJECT_PATH
        chmod -R 755 $PROJECT_PATH/dist
        
        # 验证部署结果
        if [ -f "$PROJECT_PATH/dist/index.html" ]; then
            echo "$(date): ✅ 部署成功！" >> $LOG_FILE
            echo "✅ 部署成功！"
        else
            echo "$(date): ❌ 部署失败！index.html 不存在" >> $LOG_FILE
            echo "❌ 部署失败！"
        fi
    else
        echo "$(date): ❌ 构建失败！" >> $LOG_FILE
        echo "❌ 构建失败！"
    fi
    
    echo "$(date): 🎯 部署完成" >> $LOG_FILE
    echo "🎯 部署完成"
    echo ""
}

# 初始化：记录当前提交哈希
CURRENT_COMMIT=$(get_current_commit)
if [ -n "$CURRENT_COMMIT" ]; then
    echo "$CURRENT_COMMIT" > $LAST_COMMIT_FILE
    echo "$(date): 📝 初始化当前提交哈希: ${CURRENT_COMMIT:0:8}" >> $LOG_FILE
    echo "📝 初始化当前提交哈希: ${CURRENT_COMMIT:0:8}"
else
    echo "$(date): ❌ 无法获取当前提交哈希" >> $LOG_FILE
    echo "❌ 无法获取当前提交哈希"
    exit 1
fi

echo "$(date): 👀 开始监听文件变化..." >> $LOG_FILE
echo "👀 开始监听文件变化..."
echo "按 Ctrl+C 停止监听"
echo ""

# 主循环：监听文件变化
while true; do
    # 获取远程最新提交
    REMOTE_COMMIT=$(get_remote_commit)
    
    if [ -n "$REMOTE_COMMIT" ]; then
        # 读取上次记录的提交哈希
        if [ -f "$LAST_COMMIT_FILE" ]; then
            LAST_COMMIT=$(cat $LAST_COMMIT_FILE)
        else
            LAST_COMMIT=""
        fi
        
        # 检查是否有新提交
        if [ "$REMOTE_COMMIT" != "$LAST_COMMIT" ]; then
            echo "$(date): 🔍 检测到新提交: ${REMOTE_COMMIT:0:8}" >> $LOG_FILE
            echo "🔍 检测到新提交: ${REMOTE_COMMIT:0:8}"
            
            # 执行部署
            deploy_project
            
            # 更新记录的提交哈希
            echo "$REMOTE_COMMIT" > $LAST_COMMIT_FILE
        else
            # 记录心跳（可选，避免日志文件过大）
            if [ $(( $(date +%s) % 300 )) -eq 0 ]; then  # 每5分钟记录一次
                echo "$(date): 💓 监听中... 当前提交: ${CURRENT_COMMIT:0:8}" >> $LOG_FILE
            fi
        fi
    else
        echo "$(date): ⚠️ 无法获取远程提交信息" >> $LOG_FILE
    fi
    
    # 等待指定时间
    sleep $CHECK_INTERVAL
done
