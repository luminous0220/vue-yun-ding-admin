<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}字典`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="'请填字典名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="父级" prop="parentId">
        <el-tree-select
          class="w-full!"
          check-strictly
          node-key="id"
          show-checkbox
          v-model="drawerProps.row!.parentId"
          :data="drawerProps.treeData"
          placeholder=" 请选择父级"
          :render-after-expand="false"
          :props="{ label: 'name', children: 'subs' }"
          highlight-current />
      </el-form-item>
      <el-form-item label="字段状态" prop="status">
        <el-switch
          v-model="drawerProps.row!.status"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
          active-text="开启"
          inactive-text="关闭" />
      </el-form-item>
      <el-form-item label="字典描述" prop="remark">
        <el-input
          autosize
          type="textarea"
          v-model="drawerProps.row!.remark"
          placeholder="请填写字典描述"
          clearable></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { FormInstance } from 'element-plus'
import { ISys } from '@/apis'

interface DrawerProps {
  title: string
  isView: boolean
  row: Partial<ISys.IDict>
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
  treeData: ISys.IDict[]
}

const drawerVisible = ref(false)
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: '',
  row: {},
  treeData: []
})

const rules = reactive({
  name: [{ required: true, message: '该项不能为空' }],
  phoneNo: [{ required: true, message: '该项不能为空' }]
})

// 接收父组件传过来的参数
const accept = (params: DrawerProps) => {
  drawerProps.value = params
  drawerVisible.value = true
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await drawerProps.value.api!(drawerProps.value.row)
      window.$notice.success({ message: `${drawerProps.value.title}操作员成功！` })
      drawerProps.value.getTableList!()
      drawerVisible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  accept
})
</script>
