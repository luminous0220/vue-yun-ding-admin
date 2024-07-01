<template>
  <el-container class="w-full h-full flex flex-col!">
    <div class="w-full flex h-[var(--header-height)] overflow-auto bg-[var(--el-menu-bg-color)]">
      <div class="flex-center h-full px-20px" v-if="!globalStore.isMobile">
        <span class="text-white whitespace-nowrap">{{ title }}</span>
      </div>
      <el-menu
        class="w-full! h-full! border-b-0!"
        :default-active="route.path"
        :router="false"
        mode="horizontal"
        :unique-opened="true"
        :collapse-transition="false">
        <SubMenu :menu-list="menuList" />
      </el-menu>
    </div>
    <el-container class="flex flex-col!" style="height: calc(100% - var(--header-height))">
      <MainHeader />
      <Tab v-if="isTab" />

      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="LayoutClassic">
import { useAuthStore, useGlobalStore } from '@/stores'
import Main from '@/layouts/components/Main/Main.vue'
import Tab from '@/layouts/components/Tab/Tab.vue'
import MainHeader from '@/layouts/components/MainHeader/MainHeader.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const title = ref(import.meta.env.VITE_TITLE)

const route = useRoute()

const authStore = useAuthStore()
// const device = computed(() => globalStore.device)
const menuList = computed(() => {
  return authStore.authMenuList
})

const globalStore = useGlobalStore()
const { isTab } = storeToRefs(globalStore)
</script>
