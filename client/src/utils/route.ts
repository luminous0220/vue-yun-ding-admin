import { LocationQuery, useRoute } from 'vue-router'
import router from '@/router'

/**
 * 根据route path跳转路由
 */
export const navigateByPath = (
  path: string,
  query?: LocationQuery,
  isReplace?: boolean,
  windowOpen?: boolean
) => {
  if (windowOpen) {
    return openNewWindow(path, query)
  }
  if (isReplace) {
    router.replace({
      path,
      query
    })
    return
  }
  router.push({
    path,
    query: { ...query }
  })
}

/**
 * * 根据名称获取路由信息
 */
export const fetchPathByName = (routeName: string, p?: string) => {
  try {
    const pathData = router.resolve({
      name: routeName
    })
    return p ? (pathData as any)[p] : pathData
  } catch (error) {
    window.$notice.warning({ message: '查询路由信息失败，请联系管理员！' })
  }
}

/**
 * * 错误页重定向
 * @param icon
 * @returns
 */
// export const redirectErrorPage = (code: ResultEnum) => {
//   if (!code) return false
//   const pageName = ErrorPageNameMap.get(code)
//   if (!pageName) return false
//   routerTurnByName(pageName)
// }

/**
 * * 重新加载当前路由页面
 */
export const reloadRoutePage = () => {
  const { hash } = window.location
  navigateByPath('/redirect' + hash.replace('#', ''))
}

/**
 * * 新开页面
 * @param url
 */
export const openNewWindow = (url: string, query?: LocationQuery) => {
  if (query) {
    Object.entries(query).forEach((arr) => {
      url += `?${arr[0]}=${arr[1]}&`
    })
  }
  return window.open(url, '_blank')
}

/**
 * * 获取当前路由下的参数
 * @returns object
 */
export const fetchRouteParams = () => {
  try {
    const route = useRoute()
    return route.params
  } catch (error) {
    window.$notice.warning({ message: '查询路由信息失败，请联系管理员！' })
  }
}
