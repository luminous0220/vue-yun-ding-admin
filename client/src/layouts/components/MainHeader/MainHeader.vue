<template>
  <el-header class="pl-2px! flex-align-center h-[var(--header-height)]! lt-sm:(pr-0!)">
    <div class="flex justify-between items-center w-full h-full">
      <slot>
        <Collapse class="ml-10px" />
      </slot>

      <div class="flex justify-between items-center h-full overflow-auto">
        <Search />
        <FullScreen v-if="!globalStore.isMobile" />
        <Setting />
        <Avatar />
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import Search from '@/layouts/components/ButtonGroups/Search.vue'
import Setting from '@/layouts/components/ButtonGroups/Setting.vue'
import FullScreen from '@/layouts/components/ButtonGroups/FullScreen.vue'
import Collapse from '@/layouts/components/ButtonGroups/Collapse.vue'
import Avatar from '@/layouts/components/ButtonGroups/Avatar.vue'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
</script>

<style lang="scss">
::-webkit-scrollbar {
  height: 2px;
}
.header-icon {
  font-size: 24px;
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  &:hover {
    background: var(--el-fill-color-light);
  }
}

.el-header {
  @apply h-[var(--header-height)] border-b border-b-[rgba(156,163,175,0.4)] border-b-solid;
}
</style>
