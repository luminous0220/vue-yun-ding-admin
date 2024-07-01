<template>
  <el-dialog
    class="basic-dialog"
    :fullscreen="globalStore.isMobile"
    v-model="visiable"
    :destroy-on-close="true"
    v-bind="$attrs">
    <slot />
    <template #footer v-if="!$attrs.hideFooter">
      <slot name="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="$emit('onConfirm')">确定</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()

const visiable = ref(false)

const open = () => {
  visiable.value = true
}
const close = () => {
  visiable.value = false
}

defineEmits<{ (e: 'onConfirm'): void }>()

defineExpose({
  visiable,
  open,
  close
})
</script>

<style lang="scss">
.basic-dialog {
  --el-border-radius-small: 18px !important;
  --el-dialog-padding-primary: 24px !important;
  --el-dialog-width: 40% !important;
  min-width: 650px !important;
}
</style>
