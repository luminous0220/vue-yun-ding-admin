import router from '@/router'
import { useAuthStore } from '@/stores'

import { isString } from 'lodash'
import type { RouteRecordRaw } from 'vue-router'
// * 引入views文件夹下的所有vue文件
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * @description ❤️ 初始化动态路由，下面是路由参数配置简介
 * */
export const initDynamicRoutes = async () => {
  const authStore = useAuthStore()
  try {
    await authStore.getUserInfo()
    await authStore.getPermission()
    const flatArr = authStore.flatAuthMenuListGet
    if (!flatArr.length) {
      window.$notice.warning({
        message: '当前账号无任何菜单权限，请联系系统管理员！',
        title: '无权限访问'
      })
      return Promise.reject('Forbidden')
    }
    flatArr.forEach((menuItem) => {
      const route = {
        name: menuItem.name,
        path: menuItem.path,
        component: menuItem.componentPath,
        meta: {
          title: menuItem.title,
          icon: menuItem.icon,
          permission: menuItem.permission,
          parentId: menuItem.parentId,
          type: menuItem.type,
          isKeepAlive: menuItem.isKeepAlive,
          sort: menuItem.sort,
          status: menuItem.status
        }
      }
      if (route.component && isString(route.component)) {
        //@ts-ignore
        route.component = modules['/src/views' + route.component + '.vue']
      }
      router.addRoute('Layout', route as unknown as RouteRecordRaw)
    })
  } catch (error) {
    return Promise.reject(error)
  }
}
