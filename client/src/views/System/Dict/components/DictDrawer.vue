<template>
  <basic-drawer :title="`${drawerProps.title}字典`" ref="drawerRef" @onConfirm="onSubmit">
    <basic-form ref="formRef" :model="drawerProps.row" :schema="formSchema" />
  </basic-drawer>
</template>

<script setup lang="ts">
import { SysApi, IDict } from '@/apis'
import { BasicForm, IFormSchema } from '@/components'
import BasicDrawer from '@/components/Drawer/BasicDrawer.vue'

interface IProps {
  title: string
  row?: IDict.IType.Item
  treeData: IDict.IType.Item[]
  getTableList?: () => Promise<void>
}

const drawerProps = ref<IProps>({
  title: '',
  treeData: []
})

const drawerRef = ref<InstanceType<typeof BasicDrawer>>()
const formRef = ref<InstanceType<typeof BasicForm>>()

// 表单模型
const formSchema = ref<IFormSchema[]>([])

// 接收父组件传过来的参数
const accept = (params: IProps) => {
  Object.assign(drawerProps.value, params)
  formSchema.value = [
    {
      el: 'input',
      prop: 'id',
      label: '字典ID',
      attrs: {
        placeholder: '请输入字典名称'
      },
      rule: [{ required: true, message: '该项必填', trigger: 'blur' }]
    },
    {
      el: 'input',
      prop: 'name',
      label: '字典名称',
      attrs: {
        placeholder: '请输入字典名称'
      },
      rule: [{ required: true, message: '该项必填', trigger: 'blur' }]
    },
    {
      el: 'tree-select',
      prop: 'parentId',
      label: '父级',
      treeData: params.treeData,
      attrs: {
        placeholder: '请选择父级',
        props: { label: 'name', children: 'subs' }
      }
    },
    {
      el: 'input',
      prop: 'remark',
      label: '备注',
      attrs: {
        type: 'textarea',
        autosize: { minRows: 4, maxRows: 8 }
      }
    },
    {
      el: 'switch',
      prop: 'status',
      label: '状态'
    }
  ]
  if (params.title === '编辑') {
    formSchema.value.splice(0, 1)
  }
  drawerRef.value?.open()
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      const { id, parentId, name, status, remark } = drawerProps.value.row!
      const updateParam = { parentId, name, status, remark }
      const createParam = { id, parentId, name, status, remark }
      if (drawerProps.value.title === '编辑') {
        await SysApi.updateDictType(id, updateParam)
      } else if (drawerProps.value.title === '新增') {
        await SysApi.createDictType(createParam)
      }
      window.$notice.success({ message: `${drawerProps.value.title}字典类型成功！` })
    } catch (error) {
      console.log(error)
    }
    await drawerProps.value.getTableList!()
    drawerRef.value?.close()
  })
}

defineExpose({ accept })
</script>

<style scoped lang="scss"></style>
