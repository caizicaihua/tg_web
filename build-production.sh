#!/bin/bash

# 生产环境构建脚本
# 跳过类型检查，只进行构建

echo "🔨 开始生产环境构建..."

# 检查 Node.js 版本
echo "📋 Node.js 版本: $(node --version)"
echo "📋 npm 版本: $(npm --version)"

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf dist/

# 安装依赖（包括开发依赖，因为构建需要）
echo "📦 安装依赖..."
npm ci

# 构建项目（跳过类型检查）
echo "🔨 构建项目..."
if npm run build-only; then
    echo "✅ 构建成功！"
    
    # 检查构建结果
    if [ -f "dist/index.html" ]; then
        echo "✅ 构建文件生成成功"
        echo "📁 构建文件列表:"
        ls -la dist/
        
        # 显示构建文件大小
        echo "📊 构建文件大小:"
        du -sh dist/
        
        exit 0
    else
        echo "❌ 构建文件 index.html 不存在"
        exit 1
    fi
else
    echo "❌ 构建失败！"
    exit 1
fi
