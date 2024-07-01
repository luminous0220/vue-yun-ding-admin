<template>
  <el-card class="mr-14px min-w-190px" body-class="px-10px!">
    <template #header>
      <div>{{ title }}</div>
    </template>
    <el-tree
      ref="ElTreeRef"
      highlight-current
      :data="list"
      :props="{ label: 'name' }"
      @node-click="nodeClick"
      v-bind="$attrs"
    >
    </el-tree>
  </el-card>
</template>

<script setup lang="ts">
import { ElTree } from 'element-plus'
withDefaults(defineProps<{ list: any[]; title: string }>(), {})

const ElTreeRef = ref<InstanceType<typeof ElTree> | null>()

const emit = defineEmits<{ (e: 'nodeClick', item: any): void }>()

const nodeClick = (item: any) => {
  nextTick(() => {
    ElTreeRef.value?.setCurrentKey(item)
  })
  emit('nodeClick', item)
}

defineExpose({ nodeClick })
</script>

<style scoped lang="scss">
:deep(.el-tree) {
  --el-tree-node-content-height: 38px !important;
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: var(--el-color-primary) !important;
    color: #fff;
  }

  .el-tree-node__content {
    padding-right: 26px;
    border-radius: 8px;
  }

  .el-tree-node__label {
    min-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
