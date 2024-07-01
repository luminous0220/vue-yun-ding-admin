<template>
  <Motion v-if="!showResult">
    <section class="card-wrap" v-load="loading">
      <div class="text-center text-20px mb-16px">找回密码</div>
      <el-form
        :disabled="disabled"
        class="login-form"
        ref="formEl"
        :rules="rules"
        label-position="left"
        label-width="0"
        :model="model">
        <Motion :delay="0.1" name="wipe-fade-bottom-top">
          <el-form-item prop="email">
            <el-input
              v-model="model.email"
              placeholder="邮箱"
              type="text"
              clearable
              autocomplete="new-password">
              <template #prefix>
                <el-icon size="24">
                  <i-carbon-email />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </Motion>
        <Motion :delay="0.15" name="wipe-fade-bottom-top">
          <el-form-item prop="code">
            <div class="w-full flex justify-between">
              <el-input
                v-model="model.code"
                placeholder="邮箱验证码"
                type="text"
                class="w-65%!"
                clearable
                autocomplete="off">
                <template #prefix>
                  <el-icon size="24">
                    <i-carbon-security />
                  </el-icon>
                </template>
              </el-input>

              <el-button class="w-120px!" :disabled="!isEnd" v-debounce="2000" @click="sendCode">
                {{ isEnd ? '获取验证码' : timeLeft + ' s' }}
              </el-button>
            </div>
          </el-form-item>
        </Motion>
        <Motion :delay="0.3" name="wipe-fade-bottom-top">
          <el-form-item prop="newPwd">
            <el-input
              type="password"
              autocomplete="new-password"
              style="position: absolute; left: -1000px" />
            <el-input
              v-model="model.newPwd"
              placeholder="请输入新密码"
              type="password"
              autocomplete="new-password"
              show-password
              clearable>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </Motion>
        <Motion :delay="0.3" name="wipe-fade-bottom-top">
          <el-form-item prop="repeatPwd" class="mb-18px!">
            <el-input
              v-model="model.repeatPwd"
              placeholder="请再次输入新密码"
              type="password"
              autocomplete="new-password"
              show-password
              clearable>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </Motion>

        <Motion :delay="0.3" name="wipe-fade-bottom-top">
          <div class="flex mt-18px justify-between">
            <el-button class="w-46%! h-48px! text-18px!" @click="$emit('onBack', 'login')"
              >返回</el-button
            >
            <el-button type="primary" class="w-46%! h-48px! text-18px!" @click="onSubmit"
              >修改密码</el-button
            >
          </div>
        </Motion>
      </el-form>
    </section>
  </Motion>

  <Motion v-else>
    <section class="card-wrap">
      <el-result class="pt-18px!" icon="success" title="密码修改成功" sub-title="请重新登录">
        <template #extra>
          <el-button type="primary" @click="onBack">返回登录</el-button>
        </template>
      </el-result>
    </section>
  </Motion>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { useCountDown } from '@/hooks'
import { AuthApi } from '@/apis'
import { EMAIL_AUTH_ENUM, PASSWORD_RESET_ENUM } from '@/constants'

const emit = defineEmits<{ (e: 'onBack', value: string): void }>()

const { timeLeft, startCountDown, isEnd } = useCountDown()

const showResult = ref(false)
const loading = ref(false)
const disabled = ref(true)
// * 找回密码
const formEl = ref<FormInstance | null>()
const model = reactive({
  email: '',
  code: '',
  codeId: 0,
  newPwd: '',
  repeatPwd: ''
})

const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator(rule: any, value: string, callback: any) {
        const valid = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
        if (!valid) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 32,
      message: '密码长度必须在6~32个字符之间',
      trigger: 'blur'
    }
  ],
  repeatPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator(rule: any, value: string, callback: any) {
        const { newPwd, repeatPwd } = model
        if (newPwd !== repeatPwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const sendCode = async () => {
  if (!model.email) {
    return window.$notice.warning({ message: '请填写邮箱' })
  }
  const { data } = await AuthApi.sendEmailCode({
    email: model.email,
    type: EMAIL_AUTH_ENUM.PASSWORD_RESET
  })
  model.codeId = data.codeId
  window.$notice.success({ message: '发送成功，请前往邮箱检查' })
  startCountDown()
}

const onSubmit = () => {
  formEl.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const { email, code, codeId, newPwd, repeatPwd } = model
    await AuthApi.updatePwd({
      email,
      code,
      codeId,
      newPwd,
      repeatPwd,
      type: PASSWORD_RESET_ENUM.EMAIL
    })
    loading.value = false
    showResult.value = true
  })
}

const onBack = () => {
  emit('onBack', 'login')
}

onMounted(() => {
  setTimeout(() => {
    disabled.value = false
  }, 400)
})
</script>

<style lang="scss">
.el-input.is-disabled .el-input__wrapper {
  background-color: transparent !important;
}
</style>
