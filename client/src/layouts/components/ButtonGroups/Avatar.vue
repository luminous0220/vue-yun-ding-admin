<template>
  <el-dropdown class="h-full" trigger="hover">
    <div class="px-8px flex items-center cursor-pointer header-icon text-12px! outline-none!">
      <el-avatar class="mr-8px min-w-36px" :size="36" :src="authStore.user.avatar" />
      <div class="max-w-88px line-clamp-2">{{ authStore.user.nickname }}</div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="navigateByPath('/user-setting')">
          <i-carbon-user-data class="mr-4px" />
          <span>账户设置</span>
        </el-dropdown-item>
        <el-dropdown-item @click="logout">
          <i-ep-switch-button class="mr-4px" />
          <span>退出账号</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { removeToken, navigateByPath } from '@/utils'
import { CFG } from '@/config'
const authStore = useAuthStore()

const logout = async () => {
  const sure = await window.$confirm.warning({ message: '确认是否退出账号' })
  if (sure) {
    removeToken()
    navigateByPath(CFG.LOGIN_ROUTE)
    authStore.$reset()
  }
}
</script>

<style scoped lang="scss"></style>
