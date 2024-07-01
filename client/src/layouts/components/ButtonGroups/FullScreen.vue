<template>
  <div class="fullscreen cursor-pointer header-icon" @click="toggle">
    <el-icon>
      <i-ep-full-screen />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
const toggle = () => {
  const elem = window.document
  if (elem.fullscreenElement) {
    elem.exitFullscreen()
  } else {
    elem.documentElement.requestFullscreen()
  }
}
</script>
