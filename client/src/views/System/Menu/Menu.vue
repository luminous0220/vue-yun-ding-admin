<template>
  <div class="w-full h-full flex">
    <!-- 表格 -->
    <basic-table
      ref="BasicTableRef"
      :indent="24"
      fit
      showOverflowTooltip
      :columns="columns"
      :search-form="searchForm"
      :req-api="AuthApi.getMenuList"
      :is-pageable="false"
      :call-back="callBack"
      stripe
      :tree-props="{ children: 'children' }">
      <template #leftHeaderButton>
        <el-button type="primary" @click="handleOpen('新增菜单')">
          新增菜单
          <template #icon>
            <i-carbon-add-alt />
          </template>
        </el-button>
      </template>
      <template #operation="scope">
        <div>
          <el-button type="primary" plain size="small" @click="handleOpen('编辑菜单', scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" plain size="small" @click="handleRemove(scope.row)"
            >删除</el-button
          >
        </div>
      </template>
    </basic-table>

    <!-- 编辑、新增 drawer -->
    <edit-form ref="EditFormRef" @onSubmit="onSubmit">
      <template #top="{ row, title }">
        <div class="flex justify-center mb-26px">
          <el-radio-group :disabled="title === '编辑菜单'" v-model="row.type" @change="changeMenu">
            <el-radio-button :value="MENU_TYPE.D">目录</el-radio-button>
            <el-radio-button :value="MENU_TYPE.M">菜单</el-radio-button>
            <el-radio-button :value="MENU_TYPE.B">按钮</el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </edit-form>
  </div>
</template>

<script setup lang="tsx">
import { Icon } from '@iconify/vue'
import { BasicTable, IColumns, EditForm, IEditForm, IFormSchema } from '@/components'
import { IMenu, SysApi, AuthApi } from '@/apis'
import { MENU_TYPE } from '@/constants'

const BasicTableRef = ref<InstanceType<typeof BasicTable> | null>()
const EditFormRef = ref<InstanceType<typeof EditForm> | null>()

const callBack = (res: any) => res.data

// 表格列配置
const columns = reactive<IColumns<IMenu.Item>[]>([
  {
    type: 'index',
    label: '#'
  },
  {
    prop: 'title',
    label: '菜单名称/功能名称',
    width: 200
  },
  {
    prop: 'path',
    label: '路由路径'
  },
  {
    prop: 'permission',
    label: '功能标识'
  },
  {
    prop: 'redirect',
    label: '默认跳转'
  },
  {
    prop: 'icon',
    label: '图标',
    render: (scope) => {
      return <Icon icon={scope.row.icon} />
    }
  },
  {
    prop: 'componentPath',
    label: '组件路径'
  },
  {
    prop: 'name',
    label: '路由名称'
  },
  {
    prop: 'status',
    label: '菜单状态/功能状态',
    render: (scope) => {
      const status = scope.row.status
      return <el-tag type={status ? 'success' : 'danger'}>{status ? '启用' : '禁用'}</el-tag>
    }
  },
  {
    prop: 'isKeepAlive',
    label: '是否启用缓存',
    render: (scope) => {
      const isKeepAlive = scope.row.isKeepAlive

      return (
        <el-tag type={isKeepAlive ? 'success' : 'danger'}>{isKeepAlive ? '启用' : '关闭'}</el-tag>
      )
    }
  },
  {
    prop: 'sort',
    label: '排序'
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 160, showOverflowTooltip: false }
])

// 父级菜单选择的option列表
const list = ref<IMenu.Item[]>([])

// 表格搜索配置项
const searchForm = reactive<IFormSchema[]>([
  {
    el: 'input',
    prop: 'title',
    label: '菜单名称',
    attrs: {
      placeholder: '请输入全称'
    }
  }
])

// EditForm 配置项
const editFormProps = reactive<IEditForm<IMenu.Item>>({
  title: '',
  formSchema: [],
  row: {}
})

// 切换菜单类型
const changeMenu = (value: string | number | boolean | undefined) => {
  // 重置表单域参数
  Object.assign(editFormProps.row, {
    title: null,
    parentId: null,
    path: null,
    icon: null,
    componentPath: null,
    name: null,
    redirect: null,
    permission: null,
    status: 1,
    isKeepAlive: 1,
    sort: 0,
    type: value
  })
  setFormSchema(value as MENU_TYPE)
  EditFormRef.value?.accept(editFormProps)
}

// 新增、编辑
const handleOpen = async (title: string, item: Partial<IMenu.Item> = {}) => {
  editFormProps.title = title
  const { data } = await AuthApi.getMenuList()
  list.value = data
  if (title === '新增菜单') {
    // 弹窗默认是菜单类型
    changeMenu(MENU_TYPE.M)
    return
  } else if (title === '编辑菜单') {
    setFormSchema(item.type!)
    Object.assign(editFormProps.row, item)
  }

  EditFormRef.value?.accept(editFormProps)
}

// 设置表单schema
const setFormSchema = (type: MENU_TYPE) => {
  if (type === MENU_TYPE.D) {
    editFormProps.formSchema = [
      {
        el: 'input',
        prop: 'title',
        label: '目录名称',
        attrs: {
          placeholder: '请填写目录名称'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        label: '图标名称',
        prop: 'icon',
        attrs: {
          placeholder: '请填写图标名称'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        label: '组件名称',
        prop: 'name',
        attrs: {
          placeholder: '请填写组件名称（英文，首字母大写）'
        }
      },
      {
        el: 'input',
        label: '组件路径',
        prop: 'componentPath',
        attrs: {
          placeholder: '请填写组件路径'
        }
      },
      {
        el: 'input-number',
        label: '排序',
        prop: 'sort'
      },

      {
        el: 'switch',
        prop: 'status',
        label: '状态'
      }
    ]
  }

  if (type === MENU_TYPE.M) {
    editFormProps.formSchema = [
      {
        el: 'input',
        prop: 'title',
        label: '菜单名称',
        attrs: {
          placeholder: '请填写菜单名称'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        prop: 'path',
        label: '访问路径',
        attrs: {
          placeholder: '请填菜单访问路径'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        label: '组件名称',
        prop: 'name',
        attrs: {
          placeholder: '请填写组件名称（英文，首字母大写）'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        label: '图标名称',
        prop: 'icon',
        attrs: {
          placeholder: '请填写图标名称'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        label: '组件地址',
        prop: 'componentPath',
        attrs: {
          placeholder: '请填写组件地址'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'tree-select',
        prop: 'parentId',
        label: '父级菜单',
        attrs: {
          placeholder: '请选择父级菜单',
          props: { label: 'title', children: 'children' }
        },
        options: list.value
      },
      {
        el: 'input',
        label: '默认跳转地址',
        prop: 'redirect'
      },

      {
        el: 'input-number',
        label: '排序',
        prop: 'sort'
      },

      {
        el: 'switch',
        prop: 'status',
        label: '菜单状态'
      },
      {
        el: 'switch',
        prop: 'isKeepAlive',
        label: '页面缓存'
      }
    ]
  }

  if (type === MENU_TYPE.B) {
    editFormProps.formSchema = [
      {
        el: 'input',
        prop: 'title',
        label: '功能名称',
        attrs: {
          placeholder: '请填写功能名称'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        prop: 'permission',
        label: '功能标识',
        attrs: {
          placeholder: '请填写功能标识'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'tree-select',
        prop: 'parentId',
        label: '所属页面',
        attrs: {
          placeholder: '请选择按钮所属页面',
          props: { label: 'title', children: 'children' }
        },
        options: list.value
      },
      {
        el: 'switch',
        prop: 'status',
        label: '按钮状态'
      }
    ]
  }
}

// 删除
const handleRemove = async (row: IMenu.Item) => {
  const { id, name } = row
  const sure = await window.$confirm.warning({ message: `确定删除${name}?` })
  if (sure) {
    await SysApi.removeMenu(id!)
    window.$notice.success({ message: '删除成功' })
    BasicTableRef.value?.loadData()
  }
}

// 提交确认
const onSubmit = async (model: IEditForm<IMenu.Item>, valid: boolean) => {
  const { title: t, row } = model
  const {
    id,
    name,
    parentId,
    path,
    icon,
    permission,
    componentPath,
    title,
    isKeepAlive,
    redirect,
    status,
    sort,
    type
  } = row as IMenu.Item

  const params = {
    name,
    parentId: parentId || null,
    path,
    icon,
    permission,
    componentPath,
    title,
    isKeepAlive,
    redirect,
    status,
    sort,
    type
  }
  if (!valid) return
  try {
    if (t === '编辑菜单') {
      await SysApi.updateMenu(id, params)
    } else if (t === '新增菜单') {
      await SysApi.createMenu(params)
    }
    BasicTableRef.value?.loadData()
    window.$notice.success({ message: `新增${title}！` })
    EditFormRef.value?.close()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="scss"></style>
