<template>
  <div class="flex flex-col h-full w-full" v-load="loading">
    <el-card body-class="pt-18px! pb-0!" class="mb-14px flex-basis" v-if="searchForm.length">
      <BasicForm
        label-width="80px"
        :model="searchParam"
        :gutter="gutter"
        :schema="searchForm"
        :cols="{ xs: 24, sm: 24, md: 24, lg: 8 }">
        <template #default>
          <slot :searchParam="searchParam" name="formButton">
            <div>
              <el-button v-debounce type="primary" @click="reset">重置</el-button>
              <el-button v-debounce type="warning" @click="search">查询</el-button>
            </div>
          </slot>
        </template>
      </BasicForm>
    </el-card>

    <el-card class="flex-1" body-class="flex flex-col h-full">
      <!-- 表格头部 -->
      <div class="flex justify-between">
        <!-- 左侧按钮 -->
        <div class="flex">
          <!-- 导出按钮 -->
          <el-button v-if="props.exportApi" v-debounce type="warning" @click="exportFile">
            导出表格数据
            <template #icon>
              <i-carbon-cloud-download />
            </template>
          </el-button>
          <slot
            name="leftHeaderButton"
            :selectedList="selectedList"
            :selectedListIds="selectedListIds"
            :isSelected="isSelected" />
        </div>
        <!-- 右侧按钮 -->
        <div v-if="toolButton">
          <slot name="rightHeaderButton">
            <el-button v-debounce circle v-if="showToolButton('refresh')" @click="loadData">
              <template #icon>
                <i-ep-refresh />
              </template>
            </el-button>
            <el-button circle v-if="showToolButton('setting')" @click="openColSetting">
              <template #icon>
                <i-carbon-settings-adjust />
              </template>
            </el-button>
          </slot>
        </div>
      </div>
      <!-- 表格主体 -->

      <el-table
        ref="elTableRef"
        :border="true"
        class="mt-14px flex-grow-1 mb-32px"
        v-bind="$attrs"
        row-key="id"
        :data="comTableData"
        @selection-change="selectionChange">
        <!-- 默认插槽 -->
        <slot />
        <template v-for="(item, index) in _columns" :key="index">
          <TableColumn :column="item">
            <template #operation="scope">
              <slot name="operation" v-bind="scope" />
            </template>
          </TableColumn>
        </template>
      </el-table>

      <!-- 分页按钮 -->
      <div v-if="isPageable" class="flex-justify-center pb-32px">
        <Pagination
          v-model:pageSize="pageParam.pageSize"
          v-model:pageNumber="pageParam.pageNumber"
          :total="pageParam.total" />
      </div>
    </el-card>

    <!-- 列设置 -->
    <ColSetting v-if="toolButton" ref="colRef" :setting="setting" />
  </div>
</template>

<script lang="ts" setup>
// import BasicForm from '@/components/Form/BasicForm.vue'
import TableColumn from './components/TableColumn.vue'
import ColSetting from './components/ColSetting.vue'
import Pagination from './components/Pagination.vue'
import { ElTable } from 'element-plus'
import { useTable, useSelection } from '@/hooks'
import { ITableProps, IToolBtnKey, IColType, IColumns } from './index'

// 默认值
const props = withDefaults(defineProps<ITableProps>(), {
  reqAuto: true,
  columns: () => [],
  toolButton: true,
  isPageable: true,
  initParam: () => {
    return {}
  },
  searchForm: () => {
    return []
  }
})

// column 列类型
const columnTypes: IColType[] = ['selection', 'index', 'expand']

const colRef = ref<InstanceType<typeof ColSetting>>()
const elTableRef = ref<InstanceType<typeof ElTable>>()

const _columns = reactive(props.columns)

// 处理表格数据
const comTableData = computed(() => {
  // 如果静态数据不存在，则获取通过接口返回的list
  if (!props.data) return list.value
  // 否则直接处理静态数据
  const { pageSize, pageNumber } = pageParam
  return props.data.slice((pageNumber - 1) * pageSize, pageSize * pageNumber)
})

// 递归处理函数
const recurHandleShow = (arr: IColumns[]) => {
  arr.forEach((ite) => {
    if (ite.children) recurHandleShow(ite.children)
    else ite.isShow = true
  })
}
// 给每一层加上isShow:true
recurHandleShow(_columns)

// 控制表格头部右侧按钮的隐藏显示
const showToolButton = computed(() => (key: IToolBtnKey) => {
  if (Array.isArray(props.toolButton)) {
    return props.toolButton.includes(key)
  } else return props.toolButton
})

// 过滤掉不需要显示的列
const setting = computed(() => {
  return _columns?.filter((item) => {
    const { type, prop } = item
    return !columnTypes.includes(type!) && prop !== 'operation'
  })
})

// 打开列设置
const openColSetting = () => {
  colRef.value?.openColSetting()
}

// 清空选中数据列表
const clearSelection = () => elTableRef.value!.clearSelection()

// table 数据请求 hook
const { loading, searchParam, pageParam, list, loadData, reset, search, exportFile } = useTable(
  props.reqApi,
  props.initParam,
  props.isPageable,
  props.callBack,
  props.exportApi
)

// 表格多选 hook
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection()

// 初始化请求参数
watchEffect(() => {
  props.searchForm.forEach((ite) => {
    searchParam.value[ite.prop!] = ''
  })
})

onMounted(() => {
  props.reqAuto && loadData()
})

defineExpose({
  loadData,
  clearSelection,
  reset,
  search,
  list,
  selectedListIds
})
</script>

<!-- <style scoped lang="scss">
.el-form {
  background-color: #fff;
  margin-bottom: 18px;
  padding: 14px;
  padding-bottom: 0;
  border-radius: 8px;
}
</style> -->
