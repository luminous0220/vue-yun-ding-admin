<template>
  <div class="w-28px cursor-pointer text-18px" @click="handleClick">
    <i-ep-fold v-if="globalStore.isExpandMenu" />
    <i-ep-expand v-else />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const handleClick = () => {
  globalStore.isExpandMenu = !globalStore.isExpandMenu
}
</script>

<style scoped lang="scss"></style>
