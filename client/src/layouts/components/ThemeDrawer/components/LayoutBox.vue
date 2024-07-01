<template>
  <div class="flex justify-around">
    <div
      class="box flex"
      :class="[layout == 'classic' ? 'active' : '']"
      @click="handleClick('classic')"
    >
      <div class="aside bg-dark w-28px"></div>
      <div class="w-full h-16px bg-white"></div>
    </div>
    <div
      class="box ml-8px"
      :class="[layout == 'vertical' ? 'active' : '']"
      @click="handleClick('vertical')"
    >
      <div class="aside w-100% bg-dark h-16px"></div>
      <div class="w-100% h-12px bg-white"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'
import { ILayout } from '@/stores'
import { storeToRefs } from 'pinia'
const globalStore = useGlobalStore()

const { layout } = storeToRefs(globalStore)
const handleClick = (type: ILayout) => {
  layout.value = type
}
</script>

<style lang="scss" scoped>
.bg-dark {
  background-color: rgb(0, 20, 40);
}
.bg-white {
  background-color: #fff;
}

.active {
  border: 3px solid var(--el-color-primary);
}
.box {
  cursor: pointer;
  width: 88px;
  height: 68px;
  border-radius: 8px;
  background-color: rgb(235 235 235);
  overflow: hidden;
  box-shadow: 0 1px 2.5px #0000002e;
  transition: transform ease 0.5s;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
