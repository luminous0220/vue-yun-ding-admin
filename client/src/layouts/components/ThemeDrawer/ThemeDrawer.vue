<template>
  <basic-drawer class="theme-drawer" ref="DrawerRef" :hideFooter="true" title="主题设置">
    <!-- 主题设置 -->
    <el-divider>
      <div class="flex items-center">
        <s-icon name="clothes" size="24" />
        <span class="ml-6 whitespace-nowrap">主题设置</span>
      </div>
    </el-divider>

    <div class="sec-item">
      <span>主题颜色</span>
      <el-color-picker
        class="section-right"
        v-model="primary"
        :predefine="predefineColors"
        @change="changePrimary" />
    </div>

    <div class="sec-item">
      <span>暗黑模式</span>
      <el-switch
        v-model="isDark"
        inline-prompt
        active-text="是"
        inactive-text="否"
        active-icon="Moon"
        inactive-icon="Sunny"
        @change="switchDark" />
    </div>

    <div class="sec-item">
      <span>灰阶模式</span>
      <el-switch
        v-model="isGrey"
        inline-prompt
        active-text="是"
        inactive-text="否"
        @change="changeGreyOrWeak('grey', !!$event)" />
    </div>

    <div class="sec-item">
      <span>色弱模式</span>
      <el-switch
        v-model="isWeak"
        @chang="switchDark"
        inline-prompt
        active-text="是"
        inactive-text="否"
        @change="changeGreyOrWeak('weak', !!$event)" />
    </div>

    <!--布局切换-->
    <el-divider>
      <div class="flex items-center">
        <s-icon name="setting" size="24" />
        <span class="ml-6 whitespace-nowrap">布局</span>
      </div>
    </el-divider>

    <div class="sec-item">
      <span>标签栏</span>
      <el-switch v-model="isTab" inline-prompt active-text="开" inactive-text="关" />
    </div>

    <div class="sec-item">
      <span>是否开启页面缓存</span>
      <el-switch v-model="isKeepAlive" inline-prompt active-text="开" inactive-text="关" />
    </div>

    <!-- 界面调整 -->
    <el-divider>
      <div class="flex items-center">
        <s-icon name="light" size="24" />
        <span class="ml-6 whitespace-nowrap">界面</span>
      </div>
    </el-divider>

    <layout-box></layout-box>
  </basic-drawer>
</template>

<script setup lang="ts">
import LayoutBox from './components/LayoutBox.vue'
import { useTheme } from '@/hooks'
import { CFG } from '@/config'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores'
import { emitter } from '@/utils'
import { BasicDrawer } from '@/components'

const { changePrimary, switchDark, changeGreyOrWeak } = useTheme()
const globalStore = useGlobalStore()

const DrawerRef = ref<InstanceType<typeof BasicDrawer>>()

const predefineColors = ref([
  CFG.PRIMARY_COLOR,
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#c71585'
])

const { isDark, isKeepAlive, primary, isGrey, isWeak, isTab } = storeToRefs(globalStore)

emitter.on('openThemeDrawer', () => {
  DrawerRef.value?.open()
})
</script>

<style lang="scss">
.theme-drawer {
  color: var(--el-text-color-primary);
  .el-drawer__header {
    margin-bottom: 0 !important;
  }
  .el-divider__text {
    transition: all ease 0.3s;
  }
  .sec-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--el-text-color-primary);
    margin: 10px 8px;
    font-size: 14px;
  }
}
</style>
