<template>
  <basic-drawer
    :title="`${drawerProps.name}菜单权限`"
    ref="drawerRef"
    @onConfirm="onSubmit"
    class="px-10px"
    :size="globalStore.calcWidth">
    <el-tree
      ref="treeRef"
      :data="menuList"
      default-expand-all
      :check-strictly="true"
      :default-checked-keys="drawerProps.checkedTree"
      show-checkbox
      node-key="id"
      :props="{ label: 'title', children: 'children' }"
      highlight-current />
  </basic-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { AuthApi, IMenu, SysApi } from '@/apis'
import { ElTree } from 'element-plus'
import { BasicDrawer } from '@/components'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const menuList = ref<IMenu.Item[]>([])

const treeRef = ref<InstanceType<typeof ElTree>>()

interface DrawerProps {
  name: string
  id: number | null
  treeList: IMenu.Item[]
  checkedTree: number[]
}

const drawerRef = ref<InstanceType<typeof BasicDrawer>>()
const drawerProps = ref<DrawerProps>({
  name: '',
  id: null,
  treeList: [],
  checkedTree: []
})

// 接收父组件传过来的参数
const accept = async (name: string, id: number) => {
  drawerProps.value.id = id
  drawerProps.value.name = name
  const res = await AuthApi.getMenuList()
  menuList.value = res.data
  const { data } = await SysApi.getRoleMenu(id)
  drawerProps.value.checkedTree = data.map((ite) => ite.id)
  drawerRef.value?.open()
}

// 提交数据（新增/编辑）
const onSubmit = async () => {
  const checkedTree = treeRef.value?.getCheckedKeys() as number[]
  await SysApi.assignRoleMenu(drawerProps.value.id!, checkedTree)
  drawerRef.value?.close()
  window.$notice.success({ message: '授权成功' })
}

defineExpose({
  accept
})
</script>
