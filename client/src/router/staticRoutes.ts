import { CFG } from '@/config'

import type { RouteRecordRaw } from 'vue-router'

// * 静态路由
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: CFG.LOGIN_ROUTE,
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/layout',
    name: 'Layout',
    redirect: CFG.HOME_ROUTE,
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: '/user-setting',
        name: 'UserSetting',
        component: () => import('@/views/UserSetting/UserSetting.vue'),
        meta: {
          icon:'carbon:user-data',
          title: '账户设置'
        }
      }
    ]
  },
  {
    path: '/redirect/:path(.*)',
    name: 'Redirect',
    component: () => import('@/views/Redirect/Redirect.vue')
  }
]

// * errorRouter(错误页面路由)
export const errorRouter = [
  /*   {
    path: '/403',
    name: '403',
    component: () => import('@/components/ErrorMessage/403.vue'),
    meta: {
      title: '403页面'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/ErrorMessage/404.vue'),
    meta: {
      title: '404页面'
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/ErrorMessage/500.vue'),
    meta: {
      title: '500页面'
    }
  } */
]

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRouter = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  redirect: { name: '404' }
}
