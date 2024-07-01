<template>
  <div class="h-full">
    <!-- 表格 -->
    <basic-table
      :search-form="searchForm"
      ref="BasicTableRef"
      :columns="columns"
      fit
      :init-param="initParam"
      showOverflowTooltip
      :isPageable="true"
      stripe
      :export-api="ExportApi.usersExcle"
      :req-api="reqApi">
      <template #leftHeaderButton="scope">
        <el-button type="primary" @click="handleOpen('新增')">
          新增用户
          <template #icon>
            <i-carbon-add-alt />
          </template>
        </el-button>

        <el-button type="danger" @click="batchRemove(scope.selectedList)">
          批量删除
          <template #icon>
            <i-ep-delete />
          </template>
        </el-button>

        <!-- 导出按钮 -->
        <el-button v-debounce type="warning" @click="exportFile">
          导出上传模版
          <template #icon>
            <i-carbon-document-export />
          </template>
        </el-button>

        <!-- 批量上传 -->
        <Upload
          text="批量新增"
          url="http://localhost:8182/api/upload/users"
          :fileExt="['xlsx']"
          @success="BasicTableRef?.loadData" />
      </template>
      <template #operation="scope">
        <div>
          <el-button
            class="mr-10px"
            type="primary"
            plain
            size="small"
            @click="handleOpen('授权', scope.row)"
            >授权</el-button
          >

          <el-dropdown>
            <el-button size="small" type="primary">
              更多<el-icon class="el-icon--right"> <i-ep-arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="resetPwd(scope.row)">
                  <span>重置密码</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status !== USER_STATUS.LOCKED"
                  @click="updateStatus(scope.row, USER_STATUS.LOCKED)">
                  <span>冻结</span>
                </el-dropdown-item>
                <el-dropdown-item v-else @click="updateStatus(scope.row, USER_STATUS.ACTIVE)">
                  <span>激活</span>
                </el-dropdown-item>
                <el-dropdown-item @click="handleRemove(scope.row)">
                  <span class="text-red">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </basic-table>

    <!-- 编辑、新增 drawer -->
    <edit-form mode="dialog" ref="EditFormRef" @onSubmit="onSubmit"> </edit-form>
  </div>
</template>

<script setup lang="tsx">
import { BasicTable, IColumns, IEditForm, IFormSchema, EditForm } from '@/components'
import { ExportApi, IUser, SysApi } from '@/apis'
import { dayjs } from 'element-plus'
import { GENDER_OPIONS, USER_STATUS } from '@/constants'
import { handleExport } from '@/utils'

interface IProps {
  reqApi?: (params: any) => Promise<any>
  initParam?: Partial<IUser.IGetParams>
  columns?: IColumns<IUser.Item>[]
}

withDefaults(defineProps<IProps>(), {
  reqApi: SysApi.getUserList,
  columns: () => {
    return [
      {
        type: 'selection',
        label: '#'
      },
      {
        type: 'index',
        label: '序号'
      },
      {
        prop: 'username',
        label: '用户名'
      },
      {
        prop: 'email',
        label: '邮箱'
      },
      {
        prop: 'nickname',
        label: '昵称'
      },
      {
        prop: 'roles',
        width: '160px',
        label: '角色',
        render: (scope) => {
          return (
            <div>
              {scope.row.roles?.map((ite) => {
                return (
                  <el-tag type="warning" class="mr-4px">
                    {ite.name}
                  </el-tag>
                )
              })}
            </div>
          )
        }
      },
      {
        prop: 'sex',
        label: '性别',
        render: (scope) => {
          const sex = scope.row.sex
          return <el-tag type={sex ? 'success' : 'danger'}>{sex ? '男' : '女'}</el-tag>
        }
      },

      {
        prop: 'birthday',
        label: '生日',
        render: (scope) => {
          return scope.row.birthday
        }
      },
      {
        prop: 'status',
        label: '状态',
        render: (scope) => {
          const status = scope.row.status
          if (status === USER_STATUS.PENDING) {
            return <el-tag type="info">审核中</el-tag>
          } else if (status === USER_STATUS.ACTIVE) {
            return <el-tag type="success">正常</el-tag>
          } else {
            return <el-tag type="danger">锁定</el-tag>
          }
        }
      },
      {
        prop: 'avatar',
        label: '头像',
        render: (scope) => {
          return <img src={scope.row.avatar} class="w-50x h-50px"></img>
        }
      },

      {
        prop: 'sign',
        label: '签名'
      },
      {
        prop: 'createdAt',
        label: '创建时间',
        width: '200px',
        render: (scope) => {
          return new Date(scope.row.createdAt).toLocaleString()
        }
      },
      { prop: 'operation', label: '操作', width: 150, fixed: 'right', showOverflowTooltip: false }
    ]
  }
})

// EditForm 配置项
const editFormProps = reactive<IEditForm<IUser.Item>>({
  title: '',
  formSchema: [],
  row: {}
})

const EditFormRef = ref<InstanceType<typeof EditForm> | null>()
// 表格实例
const BasicTableRef = ref<InstanceType<typeof BasicTable> | null>()

// 检索表单配置项
const searchForm = reactive<IFormSchema[]>([
  {
    el: 'input',
    prop: 'username',
    label: '用户名',
    attrs: {
      placeholder: '输入用户名'
    }
  },
  {
    el: 'input',
    prop: 'email',
    label: '邮箱',
    attrs: {
      placeholder: '输入邮箱'
    }
  },
  {
    el: 'date',
    prop: 'startTime',
    label: '开始日期',
    default: dayjs().subtract(3, 'year').format('YYYY-MM-DD'),
    attrs: {
      placeholder: '选择开始日期'
    }
  },
  {
    el: 'date',
    prop: 'endTime',
    label: '结束日期',
    default: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    attrs: {
      placeholder: '选择结束日期'
    }
  }
])

// 获取表格中的勾选项的id数组（string[])
const getSelectedListIds = () => {
  return BasicTableRef.value?.selectedListIds
}

// 新增
const handleOpen = async (title: string, item: Partial<IUser.Item> = {}) => {
  editFormProps.title = title

  if (title === '新增') {
    editFormProps.formSchema = [
      {
        el: 'input',
        prop: 'username',
        label: '用户名',
        attrs: {
          placeholder: '请填写用户名'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        prop: 'email',
        label: '邮箱',
        attrs: {
          placeholder: '请填写邮箱'
        },
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'input',
        prop: 'nickname',
        label: '昵称',
        attrs: {
          placeholder: '请填写昵称'
        }
      },
      {
        el: 'radio',
        prop: 'sex',
        label: '性别',
        options: GENDER_OPIONS,
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'date',
        prop: 'birthday',
        label: '生日'
      },
      {
        el: 'input',
        prop: 'avatar',
        label: '上传头像'
      },
      {
        el: 'input',
        label: '签名',
        attrs: {
          type: 'textarea'
        },
        prop: 'sign'
      }
    ]
    Object.assign(editFormProps.row, {
      email: '',
      password: '123456',
      username: '',
      nickname: '',
      sex: 1,
      birthday: '',
      avatar: '',
      sign: ''
    })

    EditFormRef.value?.accept(editFormProps)
    return
  } else if (title === '编辑') {
    editFormProps.formSchema = [
      {
        el: 'input',
        prop: 'nickname',
        label: '昵称',
        attrs: {
          placeholder: '请填写昵称'
        }
      },
      {
        el: 'radio',
        prop: 'sex',
        label: '性别',
        options: GENDER_OPIONS,
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        el: 'date',
        prop: 'birthday',
        label: '生日'
      },
      {
        el: 'input',
        prop: 'avatar',
        label: '上传头像'
      },

      {
        el: 'input',
        label: '签名',
        attrs: {
          type: 'textarea'
        },
        prop: 'sign'
      }
    ]
    Object.assign(editFormProps.row, item)
    EditFormRef.value?.accept(editFormProps)
  } else if (title === '授权') {
    const { data } = await SysApi.getRoleList({})

    editFormProps.formSchema = [
      {
        el: 'select',
        prop: 'roleIds',
        label: '角色',
        attrs: {
          placeholder: '请选择角色（可多选）',
          multiple: true,
          'value-key': 'value'
        },
        options: data.list.map((ite) => {
          return {
            label: ite.name,
            value: ite.id
          }
        }),
        rule: [{ required: true, message: '该项必填', trigger: 'change' }]
      }
    ]

    const roleIds = item.roles?.map((r) => r.id)
    Object.assign(editFormProps.row, { roleIds, id: item.id })
    EditFormRef.value?.accept(editFormProps)
  }
}

// 删除
const handleRemove = async (row: IUser.Item) => {
  const { id, username } = row
  const sure = await window.$confirm.warning({ message: `确定删除${username}?` })
  if (sure) {
    await SysApi.removeUser([id!])
    window.$notice.success({ message: '删除成功' })
    BasicTableRef.value?.loadData()
  }
}

// 批量删除
const batchRemove = async (list: IUser.Item[]) => {
  if (!list.length) return window.$message.warning({ message: `至少选择一项` })
  const nameStr = list.map((ite) => ite.username).join('，')
  const ids = list.map((ite) => ite.id)
  const sure = await window.$confirm.warning({ message: `确定删除以下用户：${nameStr}  ?` })
  if (sure) {
    await SysApi.removeUser(ids)
    window.$notice.success({ message: '删除成功' })
    BasicTableRef.value?.loadData()
  }
}

// 更改用户状态
const updateStatus = async (row: IUser.Item, status: USER_STATUS) => {
  const { id, username } = row
  const sure = await window.$confirm.warning({ message: `是否确认锁定用户${username}` })
  if (sure) {
    await SysApi.updateStatus(id, status)
    window.$notice.success({ message: '用户已被锁定' })
    BasicTableRef.value?.loadData()
  }
}

// 重置密码
const resetPwd = async (row: IUser.Item) => {
  const { id, username } = row
  const sure = await window.$confirm.warning({ message: `确定重置用户${username}的密码吗?` })
  if (sure) {
    await SysApi.resetPassword(id)
    window.$notice.success({ message: '已将密码重置为123456' })
    BasicTableRef.value?.loadData()
  }
}

// 提交确认
const onSubmit = async (model: IEditForm, valid: boolean) => {
  const { title, row } = model
  if (!valid) return
  try {
    if (title === '新增') {
      const { password, email, username, nickname, sex, birthday, avatar, sign, roles } =
        row as IUser.ICreateParams

      await SysApi.createUser({
        email,
        password,
        username,
        nickname,
        sex,
        birthday,
        avatar,
        sign,
        roles
      })
    } else if (title === '授权') {
      await SysApi.assignRole(row.id, row.roleIds)
    }

    BasicTableRef.value?.loadData()
    window.$notice.success({ message: `${title}成功！` })
    EditFormRef.value?.close()
  } catch (error) {
    console.log(error)
  }
}

const exportFile = async () => {
  // 导出
  await handleExport(ExportApi.userTmlExcle)
  window.$message.success({ message: '导出成功' })
}

defineExpose({
  getSelectedListIds
})
</script>

<style scoped lang="scss"></style>
