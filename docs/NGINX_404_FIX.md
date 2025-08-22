# Nginx 404 问题修复指南

## 问题描述

当用户直接访问 Vue Router 的路由（如 `/product-input`）时，页面显示 404 错误。这是因为 Nginx 尝试在服务器上查找对应的文件，但 Vue Router 的路由是由前端 JavaScript 处理的。

## 解决方案

### 1. 更新 Nginx 配置

确保你的 Nginx 配置包含以下关键设置：

```nginx
# 处理 Vue Router 路由
location / {
    # 首先尝试文件，然后尝试目录，最后回退到 index.html
    try_files $uri $uri/ /index.html;
    
    # 防止缓存 HTML 文件
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 确保 index.html 不被缓存
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 错误页面重定向
error_page 404 /index.html;
```

### 2. 快速修复

运行修复脚本：

```bash
./fix-nginx-404.sh
```

### 3. 手动修复步骤

#### 步骤 1：检查 Nginx 配置
```bash
sudo nginx -t
```

#### 步骤 2：清除缓存
```bash
sudo rm -rf /var/cache/nginx/*
```

#### 步骤 3：重新加载 Nginx
```bash
sudo systemctl reload nginx
```

#### 步骤 4：检查状态
```bash
sudo systemctl status nginx
```

### 4. 验证修复

测试以下路由是否正常工作：

- ✅ 首页: `https://your-domain.com/`
- ✅ 产品录入: `https://your-domain.com/product-input`
- ✅ 商务认款: `https://your-domain.com/business-payment/123`
- ✅ 商务流水: `https://your-domain.com/business-transactions`

### 5. 常见问题排查

#### 问题 1：配置语法错误
```bash
# 检查配置语法
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

#### 问题 2：文件权限问题
```bash
# 检查文件权限
ls -la /var/www/tg-web/dist/

# 修复权限
sudo chown -R www-data:www-data /var/www/tg-web/dist/
sudo chmod -R 755 /var/www/tg-web/dist/
```

#### 问题 3：浏览器缓存
- 清除浏览器缓存
- 使用无痕模式测试
- 强制刷新页面 (Ctrl+F5)

#### 问题 4：构建文件缺失
```bash
# 检查构建文件
ls -la /var/www/tg-web/dist/

# 重新构建
cd /var/www/tg-web
npm run build
```

### 6. 完整配置示例

参考 `nginx-vue-router.conf` 文件获取完整的 Nginx 配置示例。

### 7. 部署脚本更新

确保 `server-deploy.sh` 包含缓存清理步骤：

```bash
# 清除 Nginx 缓存
sudo rm -rf /var/cache/nginx/* 2>/dev/null || true
```

## 预防措施

1. **定期检查配置**：部署后验证所有路由
2. **监控日志**：关注 Nginx 错误日志
3. **测试路由**：每次部署后测试关键路由
4. **缓存策略**：合理设置静态资源缓存

## 相关文件

- `nginx.conf` - 主配置文件
- `nginx-vue-router.conf` - Vue Router 专用配置
- `fix-nginx-404.sh` - 快速修复脚本
- `server-deploy.sh` - 部署脚本
