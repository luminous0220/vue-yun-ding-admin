<template>
  <div class="w-full h-full bg-[var(--loading-bg-color)] absolute top-0 left-0 flex-center z-999">
    <div class="flex flex-col flex-align-center">
      <div class="loader "></div>
      <div v-html="text" class="mt-80px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ text: string }>(), { text: '加载中...' })
</script>

<style scoped lang="scss">
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
}
.loader::before,
.loader::after {
  content: '';
  grid-area: 1/1;
  --c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
  background:
    var(--c) 50% 0,
    var(--c) 50% 100%,
    var(--c) 100% 50%,
    var(--c) 0 50%;
  background-size: 12px 12px;
  animation: l12 1s infinite;
}
.loader::before {
  margin: 4px;
  filter: hue-rotate(45deg);
  background-size: 8px 8px;
  animation-timing-function: linear;
}

@keyframes l12 {
  100% {
    transform: rotate(0.5turn);
  }
}
</style>
