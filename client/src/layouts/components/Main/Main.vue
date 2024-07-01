<template>
  <el-main class="w-full h-full bg-[var(--bg-header-color)] lt-sm:p-6!">
    <router-view v-slot="{ Component, route }">
      <Motion name="wipe-fade-left-right">
        <keep-alive :include="isKeepAlive ? keepAliveName : []">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </Motion>
    </router-view>
  </el-main>
</template>

<script setup lang="ts">
import { useGlobalStore, useKeepAliveStore } from '@/stores'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const keepAliveStore = useKeepAliveStore()
const { isKeepAlive } = storeToRefs(globalStore)
const { keepAliveName } = storeToRefs(keepAliveStore)
</script>

<style scoped lang="scss"></style>
