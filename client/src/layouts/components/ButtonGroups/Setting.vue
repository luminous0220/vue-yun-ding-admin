<template>
  <div class="setting cursor-pointer header-icon" @click="handleOpen">
    <el-icon class="h-full">
      <i-carbon-menu />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { emitter } from '@/utils'

const handleOpen = () => {
  emitter.emit('openThemeDrawer')
}
</script>
