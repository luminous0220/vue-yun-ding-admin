<template>
  <Motion v-if="!showResult">
    <section class="register-form-wrap card-wrap" v-load="loading">
      <div class="text-center text-20px mb-16px">用户注册</div>
      <el-form
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
              placeholder="请输入邮箱"
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
        <Motion :delay="0.2" name="wipe-fade-bottom-top">
          <el-form-item prop="username">
            <el-input
              v-model="model.username"
              placeholder="请输入用户名"
              type="text"
              autocomplete="new-password"
              clearable>
              <template #prefix>
                <el-icon size="24">
                  <i-ep-user />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </Motion>
        <Motion :delay="0.3" name="wipe-fade-bottom-top">
          <el-form-item prop="password">
            <el-input
              v-model="model.password"
              placeholder="请输入密码"
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
        </Motion>
        <Motion :delay="0.3" name="wipe-fade-bottom-top">
          <el-form-item prop="repeatPwd" class="mb-18px!">
            <el-input
              v-model="model.repeatPwd"
              placeholder="请再次输入密码"
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
        </Motion>

        <Motion :delay="0.3" name="wipe-fade-bottom-top">
          <div class="flex mt-18px mb-18px justify-between">
            <el-button class="w-46%! h-48px! text-18px!" @click="onBack">返回</el-button>
            <el-button class="w-46%! h-48px! text-18px!" type="primary" @click="onSubmit(formEl)"
              >注册账号</el-button
            >
          </div>
        </Motion>
      </el-form>
    </section>
  </Motion>
  <Motion v-else>
    <section class="register-form-wrap card-wrap" v-load="loading">
      <el-result
        class="pt-18px!"
        icon="success"
        title="注册成功"
        sub-title="已发送邮件到您的邮箱，请前往激活">
        <template #extra>
          <el-button type="primary" @click="onBack">返回登录</el-button>
        </template>
      </el-result>
    </section>
  </Motion>
</template>

<script setup lang="ts">
import { AuthApi } from '@/apis'
import { FormInstance } from 'element-plus'
const emit = defineEmits<{ (e: 'onBack', value: string): void }>()
const loading = ref(false)
const showResult = ref(false)
const formEl = ref()
const model = reactive({
  email: '',
  username: '',
  password: '',
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
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 5,
      max: 32,
      message: '用户名长度必须在5~32个字符之间',
      trigger: 'blur'
    },
    {
      validator(rule: any, value: string, callback: any) {
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(value)) {
          callback(new Error('用户名只能由数字、26个英文字母组成（不能全为数字）'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      message: '密码长度不能小于6位',
      trigger: 'blur'
    }
  ],
  repeatPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator(rule: any, value: string, callback: any) {
        const { password, repeatPwd } = model
        if (password !== repeatPwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const onBack = () => {
  emit('onBack', 'login')
}

// * 点击注册并登录
const onSubmit = async (formIns: FormInstance) => {
  if (!formIns) return
  await formIns.validate(async (valid) => {
    if (!valid) return
    try {
      loading.value = true
      await AuthApi.register(model)
      showResult.value = true
    } catch (error) {
      console.log(error)
    }
    loading.value = false
  })
}
</script>

<style scoped lang="scss">
.register-form-wrap {
  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
