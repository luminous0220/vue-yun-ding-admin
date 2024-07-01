<template>
  <el-aside
    class="transition-primary bg-[#f7f8fa]"
    :style="{ width: isExpandMenu ? '210px' : globalStore.isMobile ? '0' : '75px' }">
    <div class="flex-center h-[var(--header-height)] bg-[var(--el-menu-bg-color)]">
      <span v-show="isExpandMenu" class="text-white whitespace-nowrap">{{ title }}</span>
    </div>
    <el-menu
      class="w-full!"
      :default-active="route.path"
      :collapse="!isExpandMenu"
      :router="false"
      :unique-opened="true"
      :collapse-transition="false">
      <el-scrollbar>
        <SubMenu :menu-list="menuList" />
      </el-scrollbar>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { useAuthStore, useGlobalStore } from '@/stores'
import { useRoute } from 'vue-router'
import SubMenu from './SubMenu.vue'

const title = ref(import.meta.env.VITE_TITLE)

const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const isExpandMenu = computed(() => globalStore.isExpandMenu)
const menuList = computed(() => {
  return authStore.authMenuList
})
</script>

<style lang="scss">
.el-menu {
  height: calc(100% - var(--header-height));
  border-right: none;

  .el-menu-item,
  .el-sub-menu {
    &:hover {
      --el-menu-text-color: #fff !important;
    }
  }
  .el-menu-item.is-active {
    background-color: var(--el-color-primary);
  }
}
</style>
