<template>
  <el-container class="w-full h-full">
    <aside-menu />
    <el-container class="flex! flex-col!">
      <MainHeader />
      <Tab v-if="isTab" />

      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import AsideMenu from '@/layouts/components/Menu/AsideMenu.vue'
import Main from '@/layouts/components/Main/Main.vue'
import Tab from '@/layouts/components/Tab/Tab.vue'
import MainHeader from '@/layouts/components/MainHeader/MainHeader.vue'
import { useGlobalStore } from '@/stores'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const { isTab } = storeToRefs(globalStore)
</script>
