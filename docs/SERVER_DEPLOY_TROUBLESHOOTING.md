# 🔧 服务器自动部署故障排除指南

## 🚨 问题：提交代码后服务器没有自动构建

### 📋 检查清单

#### 1. **检查监听脚本是否运行**
```bash
# 检查进程
ps aux | grep watch-and-deploy

# 检查日志
tail -f /data/logs/tg-web-watch.log
# 或者
tail -f ./watch-deploy-server.log
```

#### 2. **检查项目路径配置**
```bash
# 确认项目路径
ls -la /data/www/tg_web

# 如果路径不存在，修改脚本中的 PROJECT_PATH
# 编辑 watch-and-deploy.sh 或 simple-watch-deploy.sh
```

#### 3. **检查 Git 仓库状态**
```bash
cd /data/www/tg_web
git status
git remote -v
git branch
```

#### 4. **检查权限和依赖**
```bash
# 检查 Node.js 和 npm
node --version
npm --version

# 检查脚本权限
ls -la watch-and-deploy.sh
chmod +x watch-and-deploy.sh
```

## 🔧 解决方案

### 方案一：使用简化脚本（推荐）

#### 1. **上传简化脚本到服务器**
```bash
# 将 simple-watch-deploy.sh 上传到服务器
scp simple-watch-deploy.sh user@server:/data/www/tg_web/
```

#### 2. **修改配置**
```bash
# 编辑脚本，修改项目路径
nano simple-watch-deploy.sh

# 修改这一行：
PROJECT_PATH="/data/www/tg_web"  # 改为你的实际路径
```

#### 3. **启动监听服务**
```bash
# 设置权限
chmod +x simple-watch-deploy.sh

# 启动服务
./simple-watch-deploy.sh

# 后台运行
nohup ./simple-watch-deploy.sh > /dev/null 2>&1 &
```

#### 4. **检查日志**
```bash
# 查看日志
tail -f watch-deploy-server.log
```

### 方案二：使用检查脚本

#### 1. **运行检查脚本**
```bash
./check-server-deploy.sh
```

#### 2. **根据检查结果修复问题**
- 如果项目路径不存在，创建目录或修改路径
- 如果日志目录不存在，创建目录
- 如果权限不足，设置正确权限

### 方案三：手动测试部署

#### 1. **手动测试 Git 操作**
```bash
cd /data/www/tg_web
git fetch origin main
git pull origin main
```

#### 2. **手动测试构建**
```bash
npm ci --production
npm run build
```

#### 3. **检查构建结果**
```bash
ls -la dist/
cat dist/index.html | head -5
```

## 🐛 常见问题

### 问题 1：项目路径不存在
**错误信息**：`项目目录不存在: /data/www/tg_web`

**解决方案**：
```bash
# 创建目录
sudo mkdir -p /data/www/tg_web

# 或者修改脚本中的路径
# 编辑 watch-and-deploy.sh，修改 PROJECT_PATH
```

### 问题 2：权限不足
**错误信息**：`Permission denied`

**解决方案**：
```bash
# 设置脚本权限
chmod +x watch-and-deploy.sh

# 设置目录权限
sudo chown -R www:www /data/www/tg_web
sudo chmod -R 755 /data/www/tg_web
```

### 问题 3：Git 仓库问题
**错误信息**：`不是 Git 仓库` 或 `无法获取远程提交信息`

**解决方案**：
```bash
# 检查 Git 配置
git remote -v
git branch

# 重新克隆仓库
cd /data/www
rm -rf tg_web
git clone your-repo-url tg_web
```

### 问题 4：Node.js 依赖问题
**错误信息**：`npm ci --production` 失败

**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 5：构建失败
**错误信息**：`npm run build` 失败

**解决方案**：
```bash
# 检查错误日志
npm run build 2>&1 | tee build.log

# 检查 TypeScript 错误
npm run type-check

# 检查依赖
npm ls
```

## 📊 监控和调试

### 1. **实时监控日志**
```bash
# 监控服务器日志
tail -f /data/logs/tg-web-watch.log

# 监控简化脚本日志
tail -f watch-deploy-server.log
```

### 2. **检查进程状态**
```bash
# 查看监听进程
ps aux | grep watch-and-deploy

# 查看进程树
pstree -p $(pgrep watch-and-deploy)
```

### 3. **测试网络连接**
```bash
# 测试 Git 连接
git ls-remote origin

# 测试 npm 连接
npm ping
```

## 🎯 最佳实践

### 1. **使用简化脚本**
- 更容易调试
- 更好的错误处理
- 相对路径日志文件

### 2. **定期检查**
- 每天检查日志
- 监控磁盘空间
- 检查进程状态

### 3. **备份配置**
- 备份脚本配置
- 记录修改历史
- 版本控制脚本

### 4. **错误处理**
- 设置错误通知
- 自动重启机制
- 回滚策略

## 📞 获取帮助

如果问题仍然存在，请提供以下信息：

1. **服务器环境**：
   ```bash
   uname -a
   node --version
   npm --version
   git --version
   ```

2. **项目信息**：
   ```bash
   pwd
   ls -la
   git status
   ```

3. **错误日志**：
   ```bash
   tail -50 /data/logs/tg-web-watch.log
   # 或
   tail -50 watch-deploy-server.log
   ```

4. **脚本配置**：
   - 项目路径
   - 日志路径
   - 检查间隔

---

**🔧 按照这个指南，你应该能够解决自动部署的问题！**
