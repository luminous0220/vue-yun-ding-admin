<template>
  <!-- 密码登录 -->
  <el-form class="login-form" ref="formEl" :rules="rules" label-position="left" :model="model">
    <Motion :delay="0.1" name="wipe-fade-bottom-top">
      <el-form-item label-width="0" prop="account">
        <el-input
          v-model="model.account"
          placeholder="请输入邮箱或者用户名"
          type="text"
          clearable
          auto-complete="off">
          <template #prefix>
            <el-icon size="24">
              <i-ep-user />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </Motion>
    <Motion :delay="0.2" name="wipe-fade-bottom-top">
      <el-form-item label-width="0" prop="password" class="mb-16px!">
        <el-input
          v-model="model.password"
          placeholder="请输入密码"
          type="password"
          auto-complete="off"
          clearable
          show-password
          @keyup.enter="onLogin">
          <template #prefix>
            <el-icon size="24">
              <i-ep-lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </Motion>
    <Motion :delay="0.2" name="wipe-fade-bottom-top">
      <div class="text-right mb-16px" @click="$emit('onSwitch', 'update')">
        <el-link type="primary" :underline="false">忘记密码？</el-link>
      </div>
    </Motion>

    <Motion :delay="0.3" name="wipe-fade-bottom-top">
      <div class="flex justify-between">
        <el-button
          class="w-46%! h-48px! text-18px!"
          :loading="loading"
          @click="$emit('onSwitch', 'register')"
          >注册</el-button
        >
        <el-button
          type="primary"
          class="w-46%! h-48px! text-18px!"
          :loading="loading"
          @click="onLogin"
          >登录</el-button
        >
      </div>
    </Motion>
  </el-form>
</template>

<script setup lang="ts">
import { CFG } from '@/config'
import { useAuthStore } from '@/stores'
import { emitter, navigateByPath } from '@/utils'
import { FormInstance } from 'element-plus'

const authStore = useAuthStore()

defineEmits<{ (e: 'onSwitch', val: string): void }>()

// * 密码登录
const formEl = ref<FormInstance | null>()
const model = reactive({
  account: '',
  password: ''
})

const rules = reactive({
  account: [
    { required: true, message: '请输入邮箱或用户名', trigger: 'blur' },
    {
      validator(rule: any, value: string, callback: any) {
        if (value.includes('@')) {
          const valid = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
          if (!valid) {
            callback(new Error('邮箱格式错误'))
          } else {
            callback()
          }
        } else {
          if (value.length < 5 || value.length > 32) {
            callback(new Error('用户名长度为5-32位'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const loading = ref(false)

// * 登录
const onLogin = async () => {
  if (!formEl.value) return
  await formEl.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await authStore.login(model.account, model.password)
      navigateByPath(CFG.HOME_ROUTE)
    } catch (error) {
      loading.value = false
      console.log(error)
    }
  })
}

onBeforeUnmount(() => {
  loading.value = false
})

emitter.on('closeLoginLoading', () => {
  loading.value = false
})
</script>

<style scoped lang="scss"></style>
