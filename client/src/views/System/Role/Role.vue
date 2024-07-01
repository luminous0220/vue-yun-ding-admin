<template>
  <div class="h-full">
    <!-- 表格 -->
    <basic-table
      :search-form="searchForm"
      ref="BasicTableRef"
      :columns="columns"
      fit
      showOverflowTooltip
      :isPageable="false"
      stripe
      :export-api="ExportApi.rolesExcle"
      :req-api="SysApi.getRoleList">
      <template #leftHeaderButton>
        <el-button type="primary" @click="handleOpen('新增')">
          新增角色
          <template #icon>
            <i-carbon-add-alt />
          </template>
        </el-button>
      </template>
      <template #operation="scope">
        <div>
          <el-button type="primary" plain size="small" @click="handleOpen('编辑', scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" plain size="small" @click="handleOpen('授权', scope.row)"
            >菜单权限</el-button
          >
          <el-button type="danger" plain size="small" @click="handleRemove(scope.row)"
            >删除</el-button
          >
        </div>
      </template>
    </basic-table>

    <!-- 编辑、新增 dialog -->
    <edit-form mode="dialog" ref="DialogFormRef" @onSubmit="onSubmit" />

    <RoleMenuDrawer ref="RoleMenuDrawerRef" />
  </div>
</template>

<script setup lang="tsx">
import RoleMenuDrawer from './components/RoleMenuDrawer.vue'
import { BasicTable, IColumns, EditForm, IEditForm, IFormSchema } from '@/components'
import { dayjs } from 'element-plus'
import { ExportApi, IRole, SysApi } from '@/apis'
import { ROLE_TYPE } from '@/constants'

const DialogFormRef = ref<InstanceType<typeof EditForm> | null>()
const BasicTableRef = ref<InstanceType<typeof BasicTable> | null>()
const RoleMenuDrawerRef = ref<InstanceType<typeof RoleMenuDrawer> | null>()

// const loading = ref(false)

// 检索表单配置项
const searchForm = reactive<IFormSchema[]>([
  {
    el: 'input',
    prop: 'name',
    label: '角色名称'
  },
  {
    el: 'input',
    prop: 'desc',
    label: '角色描述'
  }
])

// 表格列配置
const columns = reactive<IColumns<IRole.Item>[]>([
  {
    type: 'index',
    label: '#'
  },
  {
    prop: 'flag',
    label: '角色标识'
  },
  {
    prop: 'name',
    label: '角色名称'
  },
  {
    prop: 'desc',
    label: '描述'
  },
  {
    prop: 'type',
    label: '类型',
    render: (scope) => {
      const type = scope.row.type
      const boo = type === ROLE_TYPE.BUILT_IN
      return <el-tag type={boo ? 'danger' : 'primary'}>{boo ? '内置角色' : '自定义角色'}</el-tag>
    }
  },
  // {
  //   prop: 'status',
  //   label: '角色状态',
  //   render: (scope) => {
  //     return h(ElSwitch, {
  //       activeText: '启用',
  //       inactiveText: '停用',
  //       activeValue: 1,
  //       inactiveValue: 0,
  //       inlinePrompt: true,
  //       loading: loading.value,
  //       modelValue: scope.row.status,
  //       'onUpdate:modelValue': async (val) => {
  //         scope.row.status = val as number
  //       },
  //       beforeChange: async () => {
  //         try {
  //           loading.value = true
  //           const val = scope.row.status === 0 ? 1 : 0
  //           await SystemApi.updateRoleStatus(scope.row.id, val)
  //           window.$message.success('修改角色状态成功')
  //           loading.value = false
  //           return true
  //         } catch (error) {
  //           loading.value = false
  //           return false
  //         }
  //       }
  //     })
  //   }
  // },
  {
    prop: 'createdAt',
    label: '创建时间',
    render: (scope) => {
      return dayjs(scope.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', showOverflowTooltip: false, width: 250 }
])

// EditForm 配置项
const dialogFormProps = reactive<IEditForm<IRole.Item>>({
  title: '',
  formSchema: [
    {
      el: 'input',
      prop: 'flag',
      label: '角色标识',
      attrs: {
        placeholder: '请填写角色标识'
      },
      rule: [{ required: true, message: '该项必填', trigger: 'blur' }]
    },
    {
      el: 'input',
      prop: 'name',
      label: '角色名称',
      attrs: {
        placeholder: '请填写角色名称'
      },
      rule: [{ required: true, message: '该项必填', trigger: 'blur' }]
    },
    {
      el: 'input',
      prop: 'desc',
      label: '角色描述',
      attrs: {
        placeholder: '请填写角色描述'
      }
    }
  ],
  row: {}
})

// 打开 drawer(新增、编辑)
const handleOpen = async (title: string, item: Partial<IRole.Item> = {}) => {
  dialogFormProps.title = title
  if (title === '授权') {
    RoleMenuDrawerRef.value?.accept(item.name!, item.id!)
    return
  }

  if (title === '新增') {
    Object.assign(dialogFormProps.row, {
      name: '',
      desc: '',
      flag: ''
    })
  }

  if (title === '编辑') {
    Object.assign(dialogFormProps.row, item)
  }

  DialogFormRef.value?.accept(dialogFormProps)
}

// 删除
const handleRemove = async (row: IRole.Item) => {
  const { id, name } = row
  const sure = await window.$confirm.warning({
    message: `确定删除${name}?`
  })
  if (sure) {
    await SysApi.removeRole(id)
    window.$notice.success({ message: '删除成功' })
    BasicTableRef.value?.loadData()
  }
}

// 确认提交（新增、编辑）
const onSubmit = async (model: IEditForm<IRole.Item>, valid: boolean) => {
  if (!valid) return

  const { title, row } = model
  const { id, name, type, desc, flag } = row as IRole.Item
  const params = { name, desc, type, flag }
  try {
    if (title === '编辑') {
      await SysApi.updateRole(id, params)
    } else if (title === '新增') {
      await SysApi.createRole(params)
    }
    window.$notice.success({ message: `${title}角色成功！` })
    await BasicTableRef.value?.loadData()
    DialogFormRef.value?.close()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="scss"></style>
