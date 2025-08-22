# 🚀 Quasar Telegram Web App 示例

## 📱 为什么选择 Quasar？

### ✅ 移动端优势

1. **原生应用支持**
   - 可以生成 iOS/Android 原生应用
   - 支持 Capacitor 和 Cordova
   - 可以发布到应用商店

2. **移动端专用组件**
   - 下拉刷新 (q-pull-to-refresh)
   - 无限滚动 (q-infinite-scroll)
   - 触摸手势支持
   - 移动端优化的按钮和列表

3. **性能优化**
   - 移动端专用优化
   - 触摸反馈
   - 流畅的动画效果

## 🛠️ 创建 Quasar 项目

```bash
# 创建 Quasar 项目
npm init quasar

# 选择配置：
# - Project name: tg-webapp-quasar
# - Project product name: Telegram Web App
# - Project description: Telegram Web App with Quasar
# - Author: Your Name
# - Pick your favorite CSS preprocessor: SCSS
# - Pick a Quasar components import strategy: Auto-import
# - Pick a Quasar directives import strategy: Auto-import
# - Setup Pinia for state management? Yes
# - Add TypeScript support? Yes
# - Install project dependencies? Yes
```

## 📱 移动端组件示例

### 1. 主页面布局
```vue
<template>
  <q-page class="bg-grey-1">
    <!-- 用户信息卡片 -->
    <q-card class="q-ma-md">
      <q-card-section class="text-center">
        <q-avatar size="72px" class="q-mb-md">
          <img :src="user.photo_url" />
        </q-avatar>
        <div class="text-h6">{{ user.first_name }}</div>
        <div class="text-subtitle2 text-grey-6">
          @{{ user.username }}
        </div>
      </q-card-section>
    </q-card>

    <!-- 功能列表 -->
    <q-list class="q-ma-md">
      <q-item clickable @click="hapticFeedback">
        <q-item-section avatar>
          <q-icon name="vibration" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>触觉反馈</q-item-label>
          <q-item-label caption>测试触觉反馈功能</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item clickable @click="showNotification">
        <q-item-section avatar>
          <q-icon name="notifications" color="info" />
        </q-item-section>
        <q-item-section>
          <q-item-label>显示通知</q-item-label>
          <q-item-label caption>发送测试通知</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item clickable @click="showMainButton">
        <q-item-section avatar>
          <q-icon name="smart_button" color="warning" />
        </q-item-section>
        <q-item-section>
          <q-item-label>主按钮</q-item-label>
          <q-item-label caption>显示/隐藏主按钮</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 底部操作按钮 -->
    <div class="q-pa-md">
      <q-btn 
        color="primary" 
        class="full-width q-mb-md"
        @click="closeApp"
      >
        关闭应用
      </q-btn>
    </div>
  </q-page>
</template>
```

### 2. 下拉刷新功能
```vue
<template>
  <q-page>
    <q-pull-to-refresh @refresh="onRefresh">
      <q-list>
        <q-item v-for="item in items" :key="item.id">
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label caption>{{ item.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, title: '项目 1', description: '这是第一个项目' },
  { id: 2, title: '项目 2', description: '这是第二个项目' }
])

const onRefresh = async (done) => {
  // 模拟数据刷新
  await new Promise(resolve => setTimeout(resolve, 1000))
  items.value.push({
    id: items.value.length + 1,
    title: `新项目 ${items.value.length + 1}`,
    description: '新添加的项目'
  })
  done()
}
</script>
```

### 3. 底部导航
```vue
<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- 底部导航 -->
    <q-footer elevated>
      <q-tabs
        v-model="tab"
        class="bg-primary text-white"
        indicator-color="white"
        active-color="white"
        align="justify"
      >
        <q-tab name="home" icon="home" label="首页" />
        <q-tab name="profile" icon="person" label="我的" />
        <q-tab name="settings" icon="settings" label="设置" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>
```

## 🔧 移动端优化配置

### 1. 触摸反馈
```javascript
// 在组件中使用触摸反馈
import { useQuasar } from 'quasar'

const $q = useQuasar()

const hapticFeedback = () => {
  $q.notify({
    message: '触觉反馈',
    color: 'positive',
    position: 'top'
  })
  
  // 触觉反馈
  if ($q.platform.is.capacitor) {
    $q.capacitor.Haptics.impact({ style: 'medium' })
  }
}
```

### 2. 移动端适配
```scss
// 移动端样式
.mobile-page {
  .q-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .q-btn {
    border-radius: 8px;
    height: 48px;
    font-size: 16px;
  }
  
  .q-item {
    border-radius: 8px;
    margin-bottom: 8px;
  }
}
```

## 📱 原生应用构建

### 1. 添加 Capacitor 支持
```bash
# 添加 Capacitor 模式
quasar mode add capacitor

# 构建 Android 应用
quasar build -m capacitor -T android

# 构建 iOS 应用
quasar build -m capacitor -T ios
```

### 2. 原生功能集成
```javascript
// 使用原生功能
import { Capacitor } from '@capacitor/core'

// 检查是否在原生环境中
if (Capacitor.isNativePlatform()) {
  // 使用原生功能
  const { Haptics } = await import('@capacitor/haptics')
  await Haptics.impact({ style: 'medium' })
}
```

## 🎯 与 Naive UI 对比

| 功能 | Quasar | Naive UI |
|------|--------|----------|
| **移动端组件** | ✅ 丰富 | ⚠️ 有限 |
| **触摸手势** | ✅ 内置 | ❌ 需要第三方 |
| **原生应用** | ✅ 支持 | ❌ 不支持 |
| **性能优化** | ✅ 移动端优化 | ⚠️ 通用优化 |
| **开发效率** | ✅ 高 | ⚠️ 中等 |

## 🚀 部署

### Web 部署
```bash
# 构建 Web 版本
quasar build

# 部署到服务器
# 将 dist/spa 目录内容上传到服务器
```

### 原生应用部署
```bash
# Android
quasar build -m capacitor -T android
# 生成 APK 文件

# iOS
quasar build -m capacitor -T ios
# 生成 iOS 应用
```

## 📋 总结

**Quasar 是移动端 Web 开发的最佳选择**，特别是对于 Telegram Web App 项目：

1. **移动端体验优秀**
2. **开发效率高**
3. **功能完整**
4. **可以生成原生应用**
5. **性能优化好**

强烈建议将当前项目迁移到 Quasar！
