# 🔄 自动监听部署指南

## 📋 概述

项目提供了两个自动监听部署脚本，可以监听 Git 仓库的变化并自动重新构建项目：

- `watch-and-deploy.sh` - 服务器端监听脚本
- `watch-and-deploy-local.sh` - 本地开发环境监听脚本

## 🚀 功能特点

### ✅ 核心功能
- **自动监听**：每30秒检查一次 Git 仓库更新
- **智能检测**：通过提交哈希检测是否有新代码
- **自动部署**：检测到更新时自动拉取代码并重新构建
- **日志记录**：详细记录所有操作和状态
- **错误处理**：完善的错误处理和状态验证

### ⚡ 性能优化
- **轻量级检查**：只检查提交哈希，不下载完整代码
- **智能心跳**：每5分钟记录一次心跳，避免日志过大
- **快速响应**：30秒检查间隔，平衡响应速度和资源消耗

## 📁 脚本说明

### 1. 服务器端脚本 (`watch-and-deploy.sh`)

**适用场景**：生产环境服务器

**配置信息**：
```bash
PROJECT_PATH="/data/www/tg-web"      # 项目路径
LOG_FILE="/data/logs/tg-web-watch.log"  # 日志文件
CHECK_INTERVAL=30                    # 检查间隔（秒）
```

**使用方法**：
```bash
# 在服务器上运行
./watch-and-deploy.sh

# 或者通过 npm 运行
npm run deploy:watch
```

### 2. 本地开发脚本 (`watch-and-deploy-local.sh`)

**适用场景**：本地开发环境

**配置信息**：
```bash
PROJECT_PATH="$(pwd)"                # 当前目录
LOG_FILE="./watch-deploy.log"        # 本地日志文件
CHECK_INTERVAL=30                    # 检查间隔（秒）
```

**使用方法**：
```bash
# 在本地开发环境运行
./watch-and-deploy-local.sh

# 或者通过 npm 运行
npm run deploy:watch:local
```

## 🔧 工作原理

### 1. 初始化阶段
```bash
# 获取当前提交哈希
CURRENT_COMMIT=$(git rev-parse HEAD)

# 记录到临时文件
echo "$CURRENT_COMMIT" > $LAST_COMMIT_FILE
```

### 2. 监听循环
```bash
while true; do
    # 获取远程最新提交
    REMOTE_COMMIT=$(git rev-parse origin/main)
    
    # 比较提交哈希
    if [ "$REMOTE_COMMIT" != "$LAST_COMMIT" ]; then
        # 执行部署
        deploy_project
    fi
    
    # 等待30秒
    sleep 30
done
```

### 3. 部署流程
```bash
deploy_project() {
    # 1. 拉取最新代码
    git pull origin main
    
    # 2. 安装依赖
    npm ci --production  # 服务器端
    npm install          # 本地开发
    
    # 3. 构建项目
    npm run build
    
    # 4. 设置权限（仅服务器端）
    chown -R www:www $PROJECT_PATH
    
    # 5. 验证部署结果
    if [ -f "dist/index.html" ]; then
        echo "✅ 部署成功！"
    fi
}
```

## 📊 日志监控

### 日志文件位置
- **服务器端**：`/data/logs/tg-web-watch.log`
- **本地开发**：`./watch-deploy.log`

### 日志内容示例
```
2024-01-15 10:30:00: 🚀 启动文件监听和自动部署服务...
2024-01-15 10:30:00: 📝 初始化当前提交哈希: a1b2c3d4
2024-01-15 10:30:00: 👀 开始监听文件变化...
2024-01-15 10:35:30: 🔍 检测到新提交: e5f6g7h8
2024-01-15 10:35:30: 🔄 检测到更新，开始部署...
2024-01-15 10:35:35: ✅ 构建成功
2024-01-15 10:35:35: ✅ 部署成功！
```

## ⚙️ 配置选项

### 修改检查间隔
```bash
# 在脚本中修改
CHECK_INTERVAL=60  # 改为60秒
```

### 修改项目路径
```bash
# 服务器端
PROJECT_PATH="/your/custom/path"

# 本地开发
PROJECT_PATH="$(pwd)"  # 自动获取当前目录
```

### 修改日志文件
```bash
# 服务器端
LOG_FILE="/your/log/path/watch.log"

# 本地开发
LOG_FILE="./custom-watch.log"
```

## 🛠️ 故障排除

### 1. 无法获取提交哈希
**问题**：脚本无法获取 Git 提交哈希
**解决方案**：
```bash
# 检查 Git 仓库状态
git status

# 检查远程仓库配置
git remote -v

# 确保在正确的分支上
git branch
```

### 2. 构建失败
**问题**：自动构建过程中出现错误
**解决方案**：
```bash
# 查看构建日志
tail -f watch-deploy.log

# 手动测试构建
npm run build

# 检查依赖
npm install
```

### 3. 权限问题
**问题**：服务器端权限设置失败
**解决方案**：
```bash
# 检查用户权限
whoami

# 手动设置权限
sudo chown -R www:www /data/www/tg-web
```

## 🔄 启动和停止

### 方法一：使用 systemd 服务（推荐）

#### 安装服务
```bash
# 运行安装脚本
sudo ./install-watch-service.sh

# 选择安装方式（推荐选择 1: systemd 服务）
```

#### 管理服务
```bash
# 启动服务
sudo systemctl start tg-web-watch

# 停止服务
sudo systemctl stop tg-web-watch

# 重启服务
sudo systemctl restart tg-web-watch

# 查看状态
sudo systemctl status tg-web-watch

# 查看日志
sudo journalctl -u tg-web-watch -f

# 启用开机自启
sudo systemctl enable tg-web-watch
```

### 方法二：使用 supervisor

#### 安装 supervisor
```bash
# Ubuntu/Debian
sudo apt-get install supervisor

# CentOS/RHEL
sudo yum install supervisor
```

#### 配置和启动
```bash
# 复制配置文件
sudo cp tg-web-watch.conf /etc/supervisor/conf.d/

# 重新加载配置
sudo supervisorctl reread
sudo supervisorctl update

# 启动服务
sudo supervisorctl start tg-web-watch

# 查看状态
sudo supervisorctl status tg-web-watch
```

### 方法三：简单后台运行

#### 启动服务
```bash
# 启动后台服务
./start-watch-daemon.sh

# 查看状态
ps aux | grep watch-and-deploy
```

#### 停止服务
```bash
# 停止服务
./stop-watch-daemon.sh

# 或者手动停止
kill $(cat /tmp/tg-web-watch.pid)
```

### 方法四：手动后台运行

```bash
# 后台运行
nohup ./watch-and-deploy.sh > /dev/null 2>&1 &

# 查看进程
ps aux | grep watch-and-deploy

# 停止进程
kill <进程ID>
```

## 📈 监控和维护

### 1. 查看服务状态
```bash
# 查看日志
tail -f /data/logs/tg-web-watch.log

# 查看进程
ps aux | grep watch-and-deploy

# 查看磁盘使用
du -sh /data/www/tg-web
```

### 2. 定期维护
```bash
# 清理旧日志
find /data/logs -name "*.log" -mtime +7 -delete

# 清理构建缓存
rm -rf /data/www/tg-web/node_modules/.cache

# 检查磁盘空间
df -h
```

## 🎯 最佳实践

### 1. 开发流程
1. 在本地开发并测试
2. 提交代码到 Git 仓库
3. 推送代码到远程仓库
4. 监听脚本自动检测并部署

### 2. 安全考虑
- 使用 HTTPS 连接 Git 仓库
- 定期更新依赖包
- 监控日志文件大小
- 设置适当的文件权限

### 3. 性能优化
- 根据项目大小调整检查间隔
- 定期清理日志文件
- 监控服务器资源使用
- 使用 SSD 存储提高 I/O 性能

---

**🎉 现在你可以享受自动化的部署体验了！**
