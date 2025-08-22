#!/bin/bash

# 服务器端自动部署脚本
# 在服务器上运行，用于接收和部署代码

# 配置信息
PROJECT_PATH="/data/www/tg-web"
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
npm ci --production

# 构建项目
echo "$(date): 🔨 构建项目..." >> $LOG_FILE
npm run build

# 设置权限
echo "$(date): 🔐 设置权限..." >> $LOG_FILE
chown -R www-data:www-data $PROJECT_PATH
chmod -R 755 $PROJECT_PATH/dist

# 重启 Nginx
echo "$(date): 🔄 重启 Nginx..." >> $LOG_FILE
systemctl reload nginx

# 检查部署状态
echo "$(date): 🔍 检查部署状态..." >> $LOG_FILE
if curl -s -o /dev/null -w "%{http_code}" https://localhost | grep -q "200"; then
    echo "$(date): ✅ 部署成功！" >> $LOG_FILE
    echo "✅ 部署成功！"
else
    echo "$(date): ❌ 部署失败！" >> $LOG_FILE
    echo "❌ 部署失败，请检查日志: $LOG_FILE"
fi
