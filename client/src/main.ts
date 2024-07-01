import { createApp } from 'vue'
import pinia from '@/stores'
import 'virtual:uno.css'
import './styles/reset.scss'
import './styles/common.scss'
import './styles/theme.scss'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import { icons as ep } from '@iconify-json/ep'
import { icons as carbon } from '@iconify-json/carbon'
import { addCollection } from '@iconify/vue'
import App from './App.vue'
import router from './router'
import { message, confirm, notice, setupGlobalComponent } from '@/plugins'
import {setupGlobalDirectives} from '@/directives'

async function appInit() {
  const app = createApp(App)
  app.use(pinia).use(router)
  // 注册全局组件
  setupGlobalComponent(app)
  setupGlobalDirectives(app)
  // 挂载 toast、message、notice 方法
  window.$message = message
  window.$confirm = confirm
  window.$notice = notice

  // 添加图标集
  addCollection(ep)
  addCollection(carbon)

  // 路由准备完成后再挂载app实例
  await router.isReady()
  app.mount('#app')
}

appInit().then(() => {
  // 捕获全局错误
  window.addEventListener('unhandledrejection', (event) => {
    console.warn(`捕获全局错误: ${event.reason}`)
  })
})
