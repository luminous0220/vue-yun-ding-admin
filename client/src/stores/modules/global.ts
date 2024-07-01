import { defineStore } from 'pinia'
import { persistLocalConfig } from '@/plugins'
import { CFG } from '@/config'

export type ILayout = 'vertical' | 'classic'

export type IDevice = 'pc' | 'mobile' | 'pad'

export interface IGlobalState {
  primary: string
  isDark: boolean
  isGrey: boolean
  isWeak: boolean
  layout: ILayout
  isExpandMenu: boolean
  isTab: boolean
  isFooter: boolean
  isKeepAlive: boolean
  device: IDevice
}

export const useGlobalStore = defineStore({
  id: 'GlobalStore',
  state: (): IGlobalState => {
    return {
      //是否隐藏侧边栏
      isExpandMenu: true,
      //主题色
      primary: CFG.PRIMARY_COLOR,
      //是否暗色模式
      isDark: false,
      //是否灰阶模式
      isGrey: false,
      //色弱模式
      isWeak: false,
      //布局排列
      layout: 'classic',
      //是否显示tab栏
      isTab: true,
      //是否显示footer
      isFooter: true,
      //是否开启页面缓存
      isKeepAlive: true,
      //当前设备
      device: 'pc'
    }
  },
  actions: {
    /**
     * @description 赋值globalStore中的属性
     */
    setGlobalState<T extends keyof IGlobalState>(name: T, val: IGlobalState[T]) {
      this[name] = val as any
    }
  },
  getters: {
    isMobile(store) {
      return store.device === 'mobile'
    },
    calcWidth(store) {
      return store.device === 'mobile' ? '100%' : '25%'
    }
  },
  // global-setting 是缓存数据的name
  persist: persistLocalConfig('global-setting')
})
