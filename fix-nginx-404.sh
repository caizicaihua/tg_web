#!/bin/bash

# 快速修复 Nginx 404 问题脚本
# 用于解决 Vue Router 刷新页面 404 的问题

echo "🔧 开始修复 Nginx 404 问题..."

# 1. 检查 Nginx 配置
echo "📋 检查 Nginx 配置..."
if sudo nginx -t; then
    echo "✅ Nginx 配置语法正确"
else
    echo "❌ Nginx 配置有语法错误，请检查配置"
    exit 1
fi

# 2. 清除 Nginx 缓存
echo "🧹 清除 Nginx 缓存..."
sudo rm -rf /var/cache/nginx/* 2>/dev/null || true
echo "✅ 缓存已清除"

# 3. 重新加载 Nginx
echo "🔄 重新加载 Nginx..."
if sudo systemctl reload nginx; then
    echo "✅ Nginx 重新加载成功"
else
    echo "❌ Nginx 重新加载失败"
    exit 1
fi

# 4. 检查 Nginx 状态
echo "📊 检查 Nginx 状态..."
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx 运行正常"
else
    echo "❌ Nginx 未运行"
    exit 1
fi

# 5. 测试关键路由
echo "🧪 测试关键路由..."
PROJECT_PATH="/data/www/tg_web"
if [ -f "$PROJECT_PATH/dist/index.html" ]; then
    echo "✅ index.html 文件存在"
else
    echo "❌ index.html 文件不存在，请检查构建"
    exit 1
fi

echo ""
echo "🎉 Nginx 404 问题修复完成！"
echo ""
echo "📝 如果问题仍然存在，请检查："
echo "1. Nginx 配置文件中的 try_files 指令"
echo "2. 项目构建是否成功"
echo "3. 文件权限是否正确"
echo "4. 浏览器缓存是否已清除"
echo ""
echo "🔗 测试链接："
echo "- 首页: https://your-domain.com/"
echo "- 产品录入: https://your-domain.com/product-input"
echo "- 商务认款: https://your-domain.com/business-payment/123"
echo "- 商务流水: https://your-domain.com/business-transactions"
