import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoutes } from './staticRoutes'
import { nprogress } from '@/plugins'
import { useAuthStore } from '@/stores'
import { CFG } from '@/config'
import { emitter, getToken } from '@/utils'
import { initDynamicRoutes } from './dynamicRoutes'
import { removeToken } from '@/utils'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes],
  strict: false,
  /* 用于记录右侧滚动条位置 */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})

// 防止路由无限循环
let FLAG = false

/**
 * @description 路由跳转拦截
 * */
router.beforeEach(async (to, from, next) => {
  // * 加载动画
  nprogress.start()
  // 设置文档标题
  const title = import.meta.env.VITE_TITLE

  document.title = to.meta.title ? to.meta.title + '-' + title : title

  const data = getToken()

  // 判断是否访问登陆页
  if (to.path == CFG.LOGIN_ROUTE) {
    // Token 存在的话，就停留当前页面。如果Token不存在则重置路由并跳转到登陆页
    if (data?.token) {
      return next(from.fullPath) // 这里建议使用fullpath，fullpath可以携带着参数跳转回原来路由
    }
    resetRouter()
    return next()
  }

  // 判断访问页面是否在路由白名单地址中，如果存在则直接放行
  if (CFG.WHITE_LIST_PATH.includes(to.path)) {
    return next()
  } else {
    // 否则需要校验 token
    if (!data?.token) return next({ path: CFG.LOGIN_ROUTE, replace: true })
  }

  const authStore = useAuthStore()
  // 初始化动态路由
  console.log(111111)
  if (!authStore.authMenuList.length) {
    try {
      await initDynamicRoutes()
    } catch (error) {
      emitter.emit('closeLoginLoading')
      // 😎 当按钮 或者 菜单请求出错时，重定向到登陆页
      removeToken()
      return next({ path: CFG.LOGIN_ROUTE, replace: true })
    }
    return next({ ...to, replace: true })
  }

  // 7.正常访问页面
  next()
})

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthStore()
  authStore.flatAuthMenuListGet.forEach((item) => {
    const { name } = item
    if (name && router.hasRoute(name)) router.removeRoute(name)
  })
}

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  nprogress.done()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  nprogress.done()
  console.warn('路由错误', error.message)
})

export default router
