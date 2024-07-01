<template>
  <basic-drawer title="列设置" ref="DrawerRef" :hideFooter="true">
    <el-table :data="setting" :border="true" row-key="prop">
      <el-table-column prop="label" align="center" label="列名" />
      <el-table-column prop="isShow" align="center" label="显示">
        <template #default="scope">
          <el-switch v-model="scope.row.isShow"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sortable" align="center" label="排序">
        <template #default="scope">
          <el-switch v-model="scope.row.sortable"></el-switch>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无可配置列" />
      </template>
    </el-table>
  </basic-drawer>
</template>

<script setup lang="ts">
import { BasicDrawer } from '@/components'
import { IColumns } from '..'

withDefaults(defineProps<{ setting: IColumns[] }>(), {
  setting: () => []
})

const DrawerRef = ref<InstanceType<typeof BasicDrawer>>()

const openColSetting = () => {
  DrawerRef.value?.open()
}

defineExpose({
  openColSetting
})
</script>

<style scoped lang="scss"></style>
