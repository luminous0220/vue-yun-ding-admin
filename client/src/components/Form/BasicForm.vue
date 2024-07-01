<template>
  <el-form
    ref="formRef"
    v-if="schema.length"
    :inline="true"
    label-position="right"
    label-width="120px"
    label-suffix=" :"
    v-bind="$attrs"
    :model="_model"
    :rules="rules">
    <el-row class="w-full" :gutter="gutter">
      <!-- 表单项组件 -->
      <template v-for="(item, index) in _schema" :key="index">
        <el-col v-bind="cols">
          <el-form-item class="w-full!" :prop="item.prop" :label="item.label">
            <!-- 基础输入框 -->
            <el-input
              v-if="item.el == 'input'"
              clearable
              v-bind="item.attrs"
              v-model.trim="_model[item.prop]">
            </el-input>
            <!-- 数字输入框 -->
            <el-input-number
              v-if="item.el == 'input-number'"
              v-model.trim="_model[item.prop]"
              :min="0" />
            <!-- 选择框 -->
            <el-select
              v-else-if="item.el == 'select'"
              v-bind="item.attrs"
              v-model="_model[item.prop]">
              <el-option
                v-for="ite in item.options"
                :key="ite.value"
                :label="ite.label"
                :value="ite.value" />
            </el-select>
            <!-- swtich -->
            <el-switch
              v-else-if="item.el == 'switch'"
              v-model="_model[item.prop]"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              v-bind="item.attrs" />
            <!-- radio -->
            <el-radio-group
              v-else-if="item.el == 'radio'"
              v-model="_model[item.prop]"
              v-bind="item.attrs">
              <el-radio v-for="(ite, index) in item.options" :key="index" :value="ite.value">{{
                ite.label
              }}</el-radio>
            </el-radio-group>
            <!-- 树形选择框 -->
            <el-tree-select
              v-else-if="item.el == 'tree-select'"
              class="w-full!"
              check-strictly
              node-key="id"
              show-checkbox
              :render-after-expand="false"
              :props="{ label: 'name' }"
              highlight-current
              :data="item.options"
              v-bind="item.attrs"
              v-model="_model[item.prop]" />
            <!-- 日期选择框 -->
            <el-date-picker
              class="w-full!"
              v-else-if="item.el == 'date'"
              placeholder="请选择时期"
              :shortcuts="shortcuts"
              v-bind="item.attrs"
              type="date"
              v-model="_model[item.prop]" />
            <component v-else :is="item.render" v-model.trim="_model[item.prop]"></component>
          </el-form-item>
        </el-col>
      </template>
      <!-- 按钮组 -->
      <el-col v-bind="cols">
        <el-form-item>
          <slot />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { IFormSchema } from './index'
import { ICols } from '@/components/Table'
import { FormInstance, FormValidateCallback } from 'element-plus'

export type IFormProps = {
  schema: IFormSchema[]
  model: { [key: string]: any }
  cols?: ICols
  gutter?: number // 表单间距
}

const props = withDefaults(defineProps<IFormProps>(), {
  gutter: 12,
  rules: () => [],
  model: () => {
    return {}
  },
  schema: () => [],
  cols: () => {
    return {}
  }
})

const formRef = ref<FormInstance>()

const _schema = computed(() => {
  return props.schema
})

const shortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  }
]

const rules = computed(() => {
  return props.schema.reduce((result: any, item) => {
    result[item.prop] = item.rule
    return result
  }, {})
})

const  _model  = reactive(props.model)

// 表单校验方法
const validate = async (callBack: FormValidateCallback) => {
  await formRef.value?.validate(callBack)
}

// 重置表单字段的值
const resetFields = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  // 初始化默认值
  _schema.value.forEach((ite) => {
    if (ite.default) {
      _model[ite.prop] = ite.default
    }
  })
})

defineExpose({
  validate,
  resetFields
})
</script>

<style scoped lang="scss">
.el-form {
  :deep(.el-form-item) {
    width: 100%;
    .el-form-item__content {
      width: 100%;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
