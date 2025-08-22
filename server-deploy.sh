#!/bin/bash

# 服务器端自动部署脚本
# 在服务器上运行，用于接收和部署代码

# 配置信息
PROJECT_PATH="/data/www/tg_web"
BACKUP_PATH="/data/www/backups"
LOG_FILE="/data/logs/tg-web-deploy.log"

echo "$(date): 🚀 开始自动部署..." >> $LOG_FILE

# 创建备份
echo "$(date): 📦 创建备份..." >> $LOG_FILE
if [ ! -d "$BACKUP_PATH" ]; then
    mkdir -p $BACKUP_PATH
fi

if [ -d "$PROJECT_PATH" ]; then
    cp -r $PROJECT_PATH $BACKUP_PATH/tg-web-$(date +%Y%m%d-%H%M%S)
fi

# 进入项目目录
cd $PROJECT_PATH

# 拉取最新代码
echo "$(date): 📥 拉取最新代码..." >> $LOG_FILE
git pull origin main

# 安装依赖
echo "$(date): 📦 安装依赖..." >> $LOG_FILE
npm ci

# 构建项目
echo "$(date): 🔨 构建项目..." >> $LOG_FILE
if ./build-production.sh; then
    echo "$(date): ✅ 构建成功" >> $LOG_FILE
else
    echo "$(date): ❌ 构建失败！" >> $LOG_FILE
    echo "❌ 构建失败！"
    exit 1
fi

# 设置权限
echo "$(date): 🔐 设置权限..." >> $LOG_FILE
chown -R www:www $PROJECT_PATH
chmod -R 755 $PROJECT_PATH/dist

# 清理缓存（可选）
echo "$(date): 🧹 清理缓存..." >> $LOG_FILE
# 如果需要清理 Nginx 缓存，可以取消下面的注释
#nginx -s reload

# 验证部署结果
echo "$(date): 🔍 验证部署结果..." >> $LOG_FILE

# 检查构建文件是否存在
if [ -f "$PROJECT_PATH/dist/index.html" ]; then
    echo "$(date): ✅ 构建文件生成成功" >> $LOG_FILE
    
    # 检查文件修改时间（可选）
    BUILD_TIME=$(stat -c %Y "$PROJECT_PATH/dist/index.html")
    CURRENT_TIME=$(date +%s)
    if [ $((CURRENT_TIME - BUILD_TIME)) -lt 300 ]; then  # 5分钟内
        echo "$(date): ✅ 部署成功！文件已更新" >> $LOG_FILE
        echo "✅ 部署成功！"
    else
        echo "$(date): ⚠️ 文件可能不是最新版本" >> $LOG_FILE
        echo "⚠️ 部署完成，但文件可能不是最新版本"
    fi
else
    echo "$(date): ❌ 构建失败！index.html 不存在" >> $LOG_FILE
    echo "❌ 构建失败，请检查构建日志"
    exit 1
fi
