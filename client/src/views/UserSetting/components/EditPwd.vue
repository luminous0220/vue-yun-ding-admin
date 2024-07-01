<template>
  <section class="rounded-12 p-24px" style="border: 1px solid #e6e7e9">
    <div class="text-center text-20px mb-16px">更改密码</div>
    <el-radio-group v-model="radio" size="large">
      <el-radio-button label="旧密码修改" :value="1" />
      <el-radio-button label="邮箱修改" :value="2" />
    </el-radio-group>
    <section class="mt-24px flex justify-between">
      <section class="w-50%" v-load="loading">
        <!-- 旧密码改 -->
        <el-form
          v-if="radio === 1"
          ref="formEl1"
          :rules="rules1"
          label-position="left"
          label-width="0"
          :model="model1">
          <el-form-item prop="oldPwd">
            <el-input
              v-model="model1.oldPwd"
              placeholder="请输入旧密码"
              type="password"
              autocomplete="new-password"
              clearable>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPwd">
            <el-input
              v-model="model1.newPwd"
              placeholder="请输入新密码"
              type="password"
              autocomplete="new-password"
              clearable
              show-password>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="repeatPwd" class="mb-18!">
            <el-input
              v-model="model1.repeatPwd"
              placeholder="请再次输入新密码"
              type="password"
              autocomplete="new-password"
              clearable
              show-password>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button type="warning" plain class="w-full! h-48px! text-18px!" @click="onSubmit1"
            >修改密码</el-button
          >
        </el-form>
        <!-- 邮箱修改 -->
        <el-form
          v-else
          ref="formEl2"
          :rules="rules2"
          label-position="left"
          label-width="0"
          :model="model2">
          <el-form-item prop="email">
            <el-input
              v-model="model2.email"
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
          <el-form-item prop="code">
            <div class="w-full flex justify-between items-center">
              <el-input
                v-model="model2.code"
                placeholder="邮箱验证码"
                type="text"
                class="w-65%!"
                clearable
                autocomplete="new-password">
                <template #prefix>
                  <el-icon size="24">
                    <i-carbon-security />
                  </el-icon>
                </template>
              </el-input>

              <el-button
                class="w-120px! h-full!"
                :disabled="!isEnd"
                v-debounce="2000"
                @click="sendCode">
                {{ isEnd ? '获取验证码' : timeLeft + ' s' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="newPwd">
            <el-input
              v-model="model2.newPwd"
              placeholder="请输入新密码"
              type="password"
              autocomplete="off"
              clearable>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="repeatPwd" class="mb-18!">
            <el-input
              v-model="model2.repeatPwd"
              placeholder="请再次输入新密码"
              type="password"
              autocomplete="off"
              clearable>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button type="warning" plain class="w-full! h-48! text-18!" @click="onSubmit2"
            >修改密码</el-button
          >
        </el-form>
      </section>

      <section class="p-16px bg-#f8f9fa text-#95aac9">
        <div class="text-22px text-black">密码要求</div>

        <div class="mt-12px">要创建一个新的密码，你必须满足以下所有要求。</div>
        <ul class="mt-12px">
          <li>● 最少6个字符</li>
          <li>● 最多32个字符</li>
        </ul>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { useCountDown } from '@/hooks'
import { AuthApi } from '@/apis'
import { EMAIL_AUTH_ENUM, PASSWORD_RESET_ENUM } from '@/constants'

defineEmits<{ (e: 'onBack', value: string): void }>()

const { timeLeft, startCountDown, isEnd } = useCountDown()

const loading = ref(false)
const radio = ref(1)
const disabled = ref(true)

//旧密码修改
const formEl1 = ref<FormInstance | null>()
const model1 = reactive({
  oldPwd: '',
  newPwd: '',
  repeatPwd: ''
})
const rules1 = reactive({
  oldPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
        const { newPwd, repeatPwd } = model1
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

// 邮箱修改
const formEl2 = ref<FormInstance | null>()
const model2 = reactive({
  email: '',
  code: '',
  codeId: 0,
  newPwd: '',
  repeatPwd: ''
})
const rules2 = reactive({
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
        const { newPwd, repeatPwd } = model2
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
  if (!model2.email) {
    return window.$notice.warning({ message: '请填写邮箱' })
  }
  const { data } = await AuthApi.sendEmailCode({
    email: model2.email,
    type: EMAIL_AUTH_ENUM.PASSWORD_RESET
  })
  model2.codeId = data.codeId
  window.$notice.success({ message: '发送成功，请前往邮箱检查' })
  startCountDown()
}

const onSubmit1 = () => {
  formEl1.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const { oldPwd, newPwd, repeatPwd } = model1
    try {
      await AuthApi.updatePwd({
        oldPwd,
        newPwd,
        repeatPwd,
        type: PASSWORD_RESET_ENUM.PWD
      })
      loading.value = false
      window.$notice.success({ message: '密码修改成功' })
      formEl1.value?.resetFields()
    } catch (error) {
      loading.value = false
    }
  })
}
const onSubmit2 = () => {
  formEl2.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const { email, code, codeId, newPwd, repeatPwd } = model2
    try {
      await AuthApi.updatePwd({
        email,
        code,
        codeId,
        newPwd,
        repeatPwd,
        type: PASSWORD_RESET_ENUM.EMAIL
      })
      loading.value = false
      window.$notice.success({ message: '密码修改成功' })
      formEl1.value?.resetFields()
    } catch (error) {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.el-input) {
  .el-input__inner {
    height: 38px;
    font-size: 16px;
  }
}
</style>
