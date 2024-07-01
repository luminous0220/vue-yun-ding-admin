<template>
  <el-dropdown trigger="click">
    <el-button size="small" type="primary">
      <span>更多</span>
      <el-icon class="ml-6px">
        <i-ep-arrow-down />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refresh">
          <el-icon><i-ep-refresh /></el-icon>刷新页面
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeTab">
          <el-icon><i-ep-remove /></el-icon>关闭页面
        </el-dropdown-item>
        <el-dropdown-item @click="closeOtherTab">
          <el-icon><i-ep-circle-close /></el-icon>关闭其它页面
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab">
          <el-icon><i-ep-folder-delete /></el-icon>关闭所有页面
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useTabCtr } from '@/hooks'

const { refresh, closeTab, closeOtherTab, closeAllTab } = useTabCtr()
</script>
