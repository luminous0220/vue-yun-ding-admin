<template>
  <!-- 短信登录 -->
  <el-form class="login-form" ref="formEl" :rules="rules" :model="model">
    <Motion :delay="0.1" name="wipe-fade-bottom-top">
      <el-form-item label-width="0" prop="mobile">
        <el-input
          v-model="model.mobile"
          placeholder="请输入手机号"
          type="text"
          auto-complete="off"
          clearable>
          <template #prefix>
            <el-icon size="24">
              <i-ep-iphone />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </Motion>
    <Motion :delay="0.2" name="wipe-fade-bottom-top">
      <el-form-item label-width="0" prop="code">
        <el-input
          v-model="model.code"
          placeholder="输入 6 位短信验证码"
          type="text"
          :maxlength="6"
          auto-complete="off"
          @keyup.enter="onLogin">
          <template #prefix>
            <el-icon size="24">
              <i-carbon-security />
            </el-icon>
          </template>
          <template #suffix>
            <el-link class="mr-5px" v-if="!isEnd" type="primary" :underline="false">
              {{ timeLeft }} s
            </el-link>
            <el-link
              class="mr-5"
              v-if="isEnd"
              type="primary"
              :underline="false"
              @click="getSmsCode">
              获取验证码
            </el-link>
          </template>
        </el-input>
      </el-form-item>
    </Motion>

    <Motion :delay="0.3" name="wipe-fade-bottom-top">
      <div class="w-full">
        <el-button type="primary" class="w-full h-48px! text-18px!" :loading="loading" @click="onLogin"
          >登录/注册</el-button
        >
      </div>
    </Motion>
  </el-form>
</template>

<script setup lang="ts">
import { AuthApi } from '@/apis'
import { CFG } from '@/config'
import { useCountDown } from '@/hooks'
import { useAuthStore } from '@/stores'
import { emitter, navigateByPath } from '@/utils'
import { FormInstance } from 'element-plus'

const authStore = useAuthStore()

const loading = ref(false)

// 倒计时hook
const { timeLeft, startCountDown, isEnd } = useCountDown()

const model = reactive({
  mobile: '',
  code: ''
})

// 表单实例
const formEl = ref<FormInstance | null>()

// 表单规则
const rules = reactive({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator(rule: any, value: string, callback: any) {
        const valid =
          /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/.test(
            value
          )
        if (!valid) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
})

// * 获取短信验证码
const getSmsCode = async () => {
  if (!isEnd) return
  if (!model.mobile) {
    return window.$notice.warning({ message: '请输入手机号' })
  }
  await formEl.value?.validateField(['mobile'], async (valid) => {
    if (!valid) return
    try {
      await AuthApi.sendSmsCode(model.mobile)
      window.$notice.warning({ message: '由于目前尚未支持短信验证功能，还请使用密码登录' })
      startCountDown()
    } catch (error) {
      console.log(error)
    }
  })
}

// * 登录
const onLogin = async () => {
  if (!formEl.value) return
  await formEl.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await authStore.smsLogin(model)
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
