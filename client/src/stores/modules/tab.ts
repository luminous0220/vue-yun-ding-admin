import { defineStore } from 'pinia'
import { navigateByPath } from '@/utils'
import { persistSessionConfig } from '@/plugins'

export interface ITabsMenuProps {
  icon: string
  title: string
  path: string
  name: string
  close: boolean
}

export interface TabsState {
  tabsMenuList: ITabsMenuProps[]
}

export const useTabsStore = defineStore({
  id: 'TabStore',
  state: (): TabsState => ({
    tabsMenuList: []
  }),
  actions: {
    /**
     * @description 添加标签
     */
    async addTab(tabItem: ITabsMenuProps) {
      const valid = this.tabsMenuList.every((item) => item.path !== tabItem.path)
      valid && this.tabsMenuList.push(tabItem)
    },
    /**
     * @description 移除标签
     */
    async removeTab(tabPath: string, currentRoutePath: string) {
      const tabsMenuList = this.tabsMenuList

      // 如果要移除的标签是当前路由页面，则需跳转到下一条标签的路由页面
      if (tabPath === currentRoutePath) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1]
          if (!nextTab) return
          navigateByPath(nextTab.path)
        })
      }
      this.tabsMenuList = tabsMenuList.filter((item) => {
        return item.path !== tabPath || !item.close
      })
    },
    /**
     * @description 移除更多标签
     */
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter((item) => {
        return item.path === tabsMenuValue || !item.close
      })
    },

    async setTab(tabsMenuList: ITabsMenuProps[]) {
      this.tabsMenuList = tabsMenuList
    },
    async setTabTitle(title: string) {
      const nowFullPath = location.hash.substring(1)
      this.tabsMenuList.forEach((item) => {
        if (item.path == nowFullPath) item.title = title
      })
    }
  },
  persist: persistSessionConfig('tab')
})
