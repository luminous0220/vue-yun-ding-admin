import type { App } from 'vue'
import { BasicDrawer, Motion, BasicTable, BasicForm, SvgIcon, BasicDialog ,Upload} from '@/components'

/**
 * @description 注册全局组件
 */
export const setupGlobalComponent = (vue: App) => {
  vue.component('s-icon', SvgIcon)
  vue.component('Motion', Motion)
  vue.component('BasicTable', BasicTable)
  vue.component('BasicForm', BasicForm)
  vue.component('BasicDrawer', BasicDrawer)
  vue.component('BasicDialog', BasicDialog)
  vue.component('Upload', Upload)
}
