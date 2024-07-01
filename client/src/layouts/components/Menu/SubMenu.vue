<template>
  <div v-for="item in menuList" :key="item.path">
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <el-icon>
          <Icon :icon="item.icon" />
        </el-icon>
        <span class="title title-collapse" v-show="isExpandMenu">{{ item.title }}</span>
      </template>
      <SubMenu :menu-list="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path" @click="handleClickMenu(item)">
      <el-icon>
        <Icon :icon="item.icon" />
      </el-icon>
      <template #title>
        <span class="title">{{ item.title }}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<script setup lang="ts">
import type { IMenu } from '@/apis'
import { Icon } from '@iconify/vue'
import { navigateByPath } from '@/utils'
import { useGlobalStore } from '@/stores'

withDefaults(
  defineProps<{
    menuList: IMenu.Item[]
  }>(),
  { menuList: () => [] }
)
const globalStore = useGlobalStore()
const isExpandMenu = computed(() => globalStore.isExpandMenu)
const handleClickMenu = (item: IMenu.Item) => {
  navigateByPath(item.path)
}
</script>

<style lang="scss">
.el-sub-menu {
  .el-menu-item {
    background-color: var(--el-sub-menu-bg-color);
  }
}
</style>
