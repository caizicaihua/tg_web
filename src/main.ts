import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

// 初始化Telegram Web App
import WebApp from '@twa-dev/sdk'

// 初始化Telegram Web App
WebApp.ready()

// 设置主题
WebApp.setHeaderColor('#ffffff')
WebApp.setBackgroundColor('#ffffff')


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  config: {
    brand: {
      primary: '#2481cc',
      secondary: '#64baf0',
      accent: '#999999',
      dark: '#1a1a1a',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
  }
})

// 全局属性
app.config.globalProperties.$tg = WebApp

app.mount('#app')
