#!/bin/bash

# 简化的服务器监听部署脚本
# 更容易调试和配置

# 配置信息 - 请根据你的服务器环境修改
PROJECT_PATH="/data/www/tg_web"  # 修改为你的项目路径
LOG_FILE="./watch-deploy-server.log"  # 使用相对路径
CHECK_INTERVAL=30  # 检查间隔（秒）
LAST_COMMIT_FILE="/tmp/last_commit_hash_server"

echo "🚀 启动简化的监听部署服务..."
echo "📁 项目路径: $PROJECT_PATH"
echo "⏱️  检查间隔: ${CHECK_INTERVAL}秒"
echo "📝 日志文件: $LOG_FILE"
echo ""

# 记录启动时间
echo "$(date): 🚀 启动简化的监听部署服务..." >> $LOG_FILE

# 检查项目目录是否存在
if [ ! -d "$PROJECT_PATH" ]; then
    echo "$(date): ❌ 项目目录不存在: $PROJECT_PATH" >> $LOG_FILE
    echo "❌ 项目目录不存在: $PROJECT_PATH"
    echo "💡 请修改脚本中的 PROJECT_PATH 变量"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_PATH" || {
    echo "$(date): ❌ 无法进入项目目录: $PROJECT_PATH" >> $LOG_FILE
    echo "❌ 无法进入项目目录: $PROJECT_PATH"
    exit 1
}

# 检查 Git 仓库
if [ ! -d ".git" ]; then
    echo "$(date): ❌ 不是 Git 仓库" >> $LOG_FILE
    echo "❌ 不是 Git 仓库"
    exit 1
fi

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
    if ! git pull origin main; then
        echo "$(date): ❌ 拉取代码失败" >> $LOG_FILE
        echo "❌ 拉取代码失败"
        return 1
    fi
    
    # 安装依赖
    echo "$(date): 📦 安装依赖..." >> $LOG_FILE
    if ! npm ci --production; then
        echo "$(date): ❌ 安装依赖失败" >> $LOG_FILE
        echo "❌ 安装依赖失败"
        return 1
    fi
    
    # 构建项目
    echo "$(date): 🔨 构建项目..." >> $LOG_FILE
    if npm run build; then
        echo "$(date): ✅ 构建成功" >> $LOG_FILE
        
        # 设置权限（如果可能）
        if command -v chown &> /dev/null; then
            echo "$(date): 🔐 设置权限..." >> $LOG_FILE
            chown -R www:www "$PROJECT_PATH" 2>/dev/null || true
            chmod -R 755 "$PROJECT_PATH/dist" 2>/dev/null || true
        fi
        
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
        return 1
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
            if deploy_project; then
                # 更新记录的提交哈希
                echo "$REMOTE_COMMIT" > $LAST_COMMIT_FILE
            fi
        else
            # 记录心跳（每5分钟）
            if [ $(( $(date +%s) % 300 )) -eq 0 ]; then
                echo "$(date): 💓 监听中... 当前提交: ${CURRENT_COMMIT:0:8}" >> $LOG_FILE
            fi
        fi
    else
        echo "$(date): ⚠️ 无法获取远程提交信息" >> $LOG_FILE
    fi
    
    # 等待指定时间
    sleep $CHECK_INTERVAL
done
