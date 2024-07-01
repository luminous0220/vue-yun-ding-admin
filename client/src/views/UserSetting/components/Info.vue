<template>
  <basic-form label-width="60px" class="mt-38px" ref="formRef" :model="model" :schema="schema" />
  <div class="flex justify-end">
    <el-button class="mr-10px" type="primary" v-debounce="2000" @click="onSubmit"
      >确认修改</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { AuthApi } from '@/apis'
import { IFormSchema } from '@/components'
import { GENDER_OPIONS } from '@/constants'
import { useAuthStore } from '@/stores'
import { FormInstance } from 'element-plus'

const authStore = useAuthStore()

const { nickname, sex, age, birthday, phone, sign } = authStore.user

const schema = reactive<IFormSchema[]>([
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
    options: GENDER_OPIONS
  },
  {
    el: 'input',
    prop: 'age',
    label: '年龄',
    attrs: {
      type: 'number',
      placeholder: '请填写年龄'
    }
  },
  {
    el: 'date',
    prop: 'birthday',
    label: '生日',
    attrs: {
      placeholder: '请选择生日'
    }
  },
  {
    el: 'input',
    prop: 'phone',
    label: '手机',
    attrs: {
      type: 'number',
      placeholder: '请填写手机号'
    }
  },
  {
    el: 'input',
    prop: 'sign',
    label: '签名',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 4, maxRows: 7 },
      placeholder: '请填写'
    }
  }
])
const model = reactive({
  nickname,
  sex,
  age,
  birthday,
  phone,
  sign
})

const formRef = ref<FormInstance>()

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    await AuthApi.updateUserInfo(model)
    window.$notice.success({ message: '修改成功' })
    authStore.getUserInfo()
  })
}
</script>

<style scoped lang="scss"></style>
