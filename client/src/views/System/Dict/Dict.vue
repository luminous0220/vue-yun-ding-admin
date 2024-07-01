<template>
  <div class="h-full w-full">
    <basic-table
      ref="BasicTableRef"
      :indent="24"
      fit
      showOverflowTooltip
      :columns="columns"
      :searchForm="searchForm"
      :req-api="SysApi.getDictTypeList"
      :isPageable="false"
      stripe
      :tree-props="{ children: 'subs' }">
      <template #leftHeaderButton>
        <el-button type="primary" @click="openDrawer('新增')">
          新增字典类型
          <template #icon>
            <i-carbon-add-alt />
          </template>
        </el-button>
      </template>
      <template #operation="scope">
        <div>
          <el-button type="primary" plain size="small" @click="openDrawer('编辑', scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" plain size="small" @click="openDrawer('配置', scope.row)"
            >字典配置</el-button
          >
          <el-button type="danger" plain size="small" @click="handleRemove(scope.row)"
            >删除</el-button
          >
        </div>
      </template>
    </basic-table>

    <DictDrawer ref="dictDrawerRef" />
    <!-- <DictSettingDrawer ref="dictSettingDrawerRef" /> -->
  </div>
</template>

<script setup lang="tsx">
import DictDrawer from './components/DictDrawer.vue'
import DictSettingDrawer from './components/DictSettingDrawer.vue'
import { IColumns, BasicTable, IFormSchema } from '@/components'
import { SysApi, IDict } from '@/apis'

const dictDrawerRef = ref<InstanceType<typeof DictDrawer> | null>()
const dictSettingDrawerRef = ref<InstanceType<typeof DictSettingDrawer> | null>()
const BasicTableRef = ref<InstanceType<typeof BasicTable> | null>()

const columns = reactive<IColumns<IDict.IType.Item>[]>([
  {
    type: 'index',
    label: '#'
  },
  {
    prop: 'id',
    label: '字典ID'
  },
  {
    prop: 'name',
    label: '字典名称'
  },
  {
    prop: 'remark',
    label: '字典描述'
  },
  {
    prop: 'status',
    label: '状态',
    render: (scope) => {
      return (
        <el-tag type={scope.row.status == 1 ? 'success' : 'danger'}>
          {scope.row.status == 1 ? '启用' : '关闭'}
        </el-tag>
      )
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 180, showOverflowTooltip: false }
])

const searchForm = reactive<IFormSchema[]>([
  {
    el: 'input',
    prop: 'name',
    label: '字典名称'
  },
  {
    el: 'radio',
    prop: 'status',
    label: '字典状态',
    radioGroups: [
      { label: '开启', value: 1 },
      { label: '关闭', value: 0 }
    ]
  }
])

const openDrawer = (title: string, item: Partial<IDict.IType.Item> = {}) => {
  const params = {
    title,
    treeData: BasicTableRef.value?.list as IDict.IType.Item[],
    row: {} as IDict.IType.Item,
    getTableList: BasicTableRef.value?.loadData
  }
  if (title === '新增') {
    Object.assign(params.row, {
      id: '',
      parentId: '',
      name: '',
      status: 1,
      remark: ''
    })
  } else if (title === '编辑') {
    Object.assign(params.row, item)
  }

  dictDrawerRef.value?.accept(params)
}

const handleRemove = async (row: IDict.IType.Item) => {
  const { id, name } = row
  const sure = await window.$confirm.warning({ message: `确定删除${name}?` })
  if (sure) {
    await SysApi.removeDict(id)
    BasicTableRef.value?.loadData()
    window.$notice.success({ message: '删除成功' })
  }
}
</script>

<style scoped lang="scss"></style>
