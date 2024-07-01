<template>
  <!-- 多级表头 -->
  <template v-if="column.children?.length">
    <el-table-column :label="column.label" :align="column.align ?? 'center'" v-bind="_columns">
      <TableColumn v-for="(ite, idx) in column.children" :key="idx" :column="ite"> </TableColumn>
    </el-table-column>
  </template>

  <!-- 正常表头 -->
  <template v-else>
    <el-table-column v-if="column.isShow" v-bind="column" :align="column.align ?? 'center'">
      <!-- 特殊列 -->
      <template v-if="column.type && colTypes.includes(column.type)" #default="scope">
        <!-- expand -->
        <template v-if="column.type == 'expand'">
          <component v-if="column.render" :is="column.render" v-bind="scope" />
        </template>
      </template>
      <!-- 自定义列模版（使用h函数或者tsx） -->
      <template v-else-if="column.render" #default="scope">
        <component :is="column.render" v-bind="scope" />
      </template>
      <!-- 操作栏 -->
      <template v-else-if="column.prop === 'operation'" #default="scope">
        <slot name="operation" v-bind="scope" />
      </template>
    </el-table-column>
  </template>
</template>

<script setup lang="ts" name="TableColumn">
import { cloneDeep } from 'lodash'
import { IColumns } from '../index'
import { IColType } from '@/components/Table'

const props = defineProps<{ column: IColumns }>()

// column 列类型
const colTypes: IColType[] = ['selection', 'index', 'expand']

// v-bind绑定的数据不能是Object、Array，所以这里需要过滤掉children属性
const _columns = computed(() => {
  let column = cloneDeep(props.column)
  delete column.children
  return column
})
</script>

<style scoped lang="scss"></style>
