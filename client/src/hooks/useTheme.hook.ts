import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores'
import { lightenColor, deepenColor } from '@/utils'
import { CFG } from '@/config'

export type GreyOrWeakType = 'grey' | 'weak'

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
  const globalStore = useGlobalStore()
  const { primary, isDark, isGrey } = storeToRefs(globalStore)

  /**
   * @description 切换暗黑模式
   */
  const switchDark = () => {
    const html = document.documentElement as HTMLElement
    if (isDark.value) html.setAttribute('class', 'dark')
    else html.setAttribute('class', 'light')
    changePrimary(primary.value)
  }

  /**
   * @description 修改主题颜色
   */
  const changePrimary = (val: string | null) => {
    // 不传则重置颜色
    if (!val) {
      val = CFG.PRIMARY_COLOR
      window.$notice.success({ message: `主题颜色已重置为 ${CFG.PRIMARY_COLOR}` })
    }
    // 修改主题颜色
    document.documentElement.style.setProperty('--el-color-primary', val)

    document.documentElement.style.setProperty(
      '--el-color-primary-dark-2',
      isDark.value ? `${lightenColor(val, 0.2)}` : `${deepenColor(val, 0.3)}`
    )
    for (let i = 1; i <= 9; i++) {
      const primaryColor = isDark.value
        ? `${deepenColor(val, i / 10)}`
        : `${lightenColor(val, i / 10)}`
      document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
    }
    globalStore.setGlobalState('primary', val)
  }

  /**
   * @description 灰色和弱色切换
   */
  const changeGreyOrWeak = (type: GreyOrWeakType, value: boolean) => {
    const body = document.body as HTMLElement
    if (!value) return body.removeAttribute('style')
    const styles: Record<GreyOrWeakType, string> = {
      grey: 'filter: grayscale(1)',
      weak: 'filter: invert(80%)'
    }
    body.setAttribute('style', styles[type])
    const propName = type === 'grey' ? 'isWeak' : 'isGrey'
    globalStore.setGlobalState(propName, false)
  }

  /**
   * @description 初始化
   */
  const initTheme = () => {
    switchDark()
    if (isGrey.value) changeGreyOrWeak('grey', true)
  }

  return {
    initTheme,
    switchDark,
    changePrimary,
    changeGreyOrWeak
  }
}
