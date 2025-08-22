# 🚀 自动部署完整指南

## 📋 概述

这个自动部署系统让你在本地修改代码后，自动构建并部署到服务器，无需手动操作。

## 🎯 支持的部署方式

### 1. GitHub Actions 自动部署（推荐）
- 推送到 GitHub 后自动部署
- 支持多环境部署
- 完整的 CI/CD 流程

### 2. 本地脚本自动部署
- 一键部署到服务器
- 支持自定义配置
- 快速部署

### 3. 文件监听自动部署
- 实时监听文件变化
- 自动构建和部署
- 开发体验最佳

## 🛠️ 设置步骤

### 步骤 1: 准备服务器

#### 1.1 服务器环境要求
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt-get install nginx

# 安装 Git
sudo apt-get install git

# 安装 PM2（可选）
npm install -g pm2
```

#### 1.2 创建项目目录
```bash
sudo mkdir -p /var/www/tg-web
sudo chown $USER:$USER /var/www/tg-web
cd /var/www/tg-web
```

#### 1.3 克隆项目
```bash
git clone https://github.com/your-username/tg-web.git .
```

#### 1.4 配置 Nginx
```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/tg-web

# 创建软链接
sudo ln -s /etc/nginx/sites-available/tg-web /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 1.5 配置域名（可选）
```bash
# 如果需要自定义域名，可以配置 Nginx
# 编辑 /etc/nginx/sites-available/tg-web
# 修改 server_name 为你的域名
```

### 步骤 2: 配置 GitHub Actions

#### 2.1 设置 GitHub Secrets
在 GitHub 仓库设置中添加以下 Secrets：

- `SERVER_HOST`: 你的服务器 IP 或域名
- `SERVER_USER`: 服务器用户名
- `SERVER_SSH_KEY`: 服务器 SSH 私钥
- `SERVER_PORT`: SSH 端口（通常是 22）

#### 2.2 配置 SSH 密钥
```bash
# 在本地生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 将公钥添加到服务器
ssh-copy-id user@your-server.com

# 将私钥添加到 GitHub Secrets
cat ~/.ssh/id_rsa
```

### 步骤 3: 配置本地自动部署

#### 3.1 修改配置文件
编辑 `auto-deploy.sh`：
```bash
SERVER_HOST="your-server.com"
SERVER_USER="your-username"
SERVER_PATH="/var/www/tg-web"
```

#### 3.2 设置 Git 远程仓库
```bash
git remote add origin https://github.com/your-username/tg-web.git
git branch -M main
git push -u origin main
```

## 🚀 使用方法

### 方法 1: GitHub Actions（推荐）

1. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "更新功能"
   git push origin main
   ```

2. **自动部署**：
   - GitHub Actions 会自动触发部署
   - 查看部署状态：GitHub 仓库 → Actions

### 方法 2: 本地脚本部署

```bash
# 一键部署
./auto-deploy.sh
```

### 方法 3: 文件监听部署

```bash
# 安装依赖
npm install chokidar

# 启动监听
node watch-and-deploy.js
```

## 📱 Telegram Web App 配置

### 1. 在 BotFather 中设置
```
1. 发送 /newapp 给 @BotFather
2. 选择你的 Bot
3. 设置 Web App URL: https://your-domain.com（生产环境需要 HTTPS）
4. 设置标题和描述
```

### 2. 测试 Web App
```javascript
// 在你的 Bot 中发送
bot.sendMessage(chatId, '测试 Web App', {
  reply_markup: {
    inline_keyboard: [[
      {
        text: '🚀 打开 Web App',
        web_app: { url: 'https://your-domain.com' }
      }
    ]]
  }
});
```

## 🔧 监控和维护

### 1. 查看部署日志
```bash
# 服务器端日志
tail -f /var/log/tg-web-deploy.log

# Nginx 日志
tail -f /var/log/nginx/tg-web-access.log
tail -f /var/log/nginx/tg-web-error.log
```

### 2. 健康检查
```bash
# 检查服务状态
curl https://your-domain.com/health

# 检查 SSL 证书
sudo certbot certificates
```

### 3. 备份和恢复
```bash
# 手动备份
sudo cp -r /var/www/tg-web /var/www/backups/tg-web-$(date +%Y%m%d)

# 恢复备份
sudo cp -r /var/www/backups/tg-web-20231201 /var/www/tg-web
```

## 🐛 故障排除

### 1. 部署失败
```bash
# 检查 GitHub Actions 日志
# 检查服务器日志
tail -f /var/log/tg-web-deploy.log

# 手动部署测试
cd /var/www/tg-web
git pull origin main
npm ci
npm run build
```

### 2. 网站无法访问
```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查防火墙
sudo ufw status

# 检查 SSL 证书
sudo certbot certificates
```

### 3. 性能问题
```bash
# 检查服务器资源
htop
df -h
free -h

# 优化 Nginx 配置
# 启用 Gzip 压缩
# 配置缓存策略
```

## 📊 性能优化

### 1. Nginx 优化
```nginx
# 启用 Gzip 压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# 配置缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. 应用优化
```javascript
// 启用代码分割
// 使用懒加载
// 优化图片
// 启用 Service Worker
```

## 🔒 安全配置

### 1. 服务器安全
```bash
# 更新系统
sudo apt update && sudo apt upgrade

# 配置防火墙
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# 禁用 root 登录
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
```

### 2. 应用安全
```nginx
# 安全头部
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
```

## 🎯 最佳实践

1. **代码管理**：
   - 使用 Git 分支管理
   - 代码审查
   - 自动化测试

2. **部署策略**：
   - 蓝绿部署
   - 滚动更新
   - 回滚机制

3. **监控告警**：
   - 服务监控
   - 性能监控
   - 错误告警

---

**🎉 现在你可以享受自动部署的便利了！**
