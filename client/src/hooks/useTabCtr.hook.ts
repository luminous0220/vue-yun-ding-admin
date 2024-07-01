import { CFG } from '@/config'
import { useTabsStore, useKeepAliveStore, ITabsMenuProps } from '@/stores'
import { navigateByPath } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

export const useTabCtr = () => {
  const route = useRoute()
  const router = useRouter()
  const tabStore = useTabsStore()
  const keepAliveStore = useKeepAliveStore()

  /**
   * @description 刷新指定的页面，如果fullpath为空，则默认刷新当前页面
   */
  const refresh = (tab: ITabsMenuProps) => {
    const { query, name } = unref(route)
    keepAliveStore.removeKeepAliveName(tab.name || (name as string))

    navigateByPath(tab.path ? `/redirect${tab.path}` : `/redirect${route.fullPath}`, query)
  }

  /**
   * @description 关闭指定的页面，如果fullpath为空，则默认关闭当前路由页面
   */
  const closeTab = (tab: ITabsMenuProps) => {
    tabStore.removeTab(tab.path || route.fullPath, route.fullPath)
    keepAliveStore.removeKeepAliveName(tab.name || (route.name as string))
  }

  /**
   * @description 关闭除指定页面之外的其它页面，如果fullpath为空，则默认关闭除当前路由页面之外的其它页面
   */
  const closeOtherTab = (tab: ITabsMenuProps) => {
    tabStore.closeMultipleTab(tab.path || route.fullPath)
    if (tab.name) {
      keepAliveStore.setKeepAliveName([tab.name])
    } else {
      keepAliveStore.setKeepAliveName([route.name] as string[])
    }
  }

  /**
   * @description 关闭所有tab标签
   */
  const closeAllTab = () => {
    tabStore.closeMultipleTab()
    keepAliveStore.setKeepAliveName()
    router.push(CFG.HOME_ROUTE)
  }
  return { refresh, closeTab, closeOtherTab, closeAllTab }
}
