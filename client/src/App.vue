<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import _ from 'lodash'
import { useTheme } from '@/hooks'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()

// init theme
const { initTheme } = useTheme()
initTheme()

// 设置设备标识
const setDeviceFlag = () => {
  const docEI = document.documentElement
  const clientWidth = docEI.clientWidth
  globalStore.device = 'pc'
  if (clientWidth > 1280) {
    globalStore.setGlobalState('isExpandMenu', true)
    globalStore.setGlobalState('device', 'pc')
  } else if (clientWidth > 768 && clientWidth <= 1280) {
    globalStore.setGlobalState('isExpandMenu', false)
    globalStore.setGlobalState('device', 'pad')
  } else if (clientWidth <= 768) {
    globalStore.setGlobalState('isExpandMenu', false)
    globalStore.setGlobalState('device', 'mobile')
  }
}
setDeviceFlag()

// * 监听视口变化，修改device与isExpandMenu的值
const setDeviceFlag_debounce = _.debounce(setDeviceFlag, 300)
window.addEventListener('resize', setDeviceFlag_debounce, false)
</script>

<style scoped lang="scss"></style>
