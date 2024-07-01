<template>
  <el-pagination
    class="overflow-auto pb-6px"
    background
    layout="sizes,prev, pager, next"
    :total="total"
    :pager-count="pageCount"
    :size="size"
    v-model:page-size="_pageSize"
    v-model:current-page="_pageNumber" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    total: number
    pageNumber: number
    pageSize: number
    pageCount?: number
    size?: string
  }>(),
  {
    size: 'large',
    pageCount: 11,
    pageNumber: 1,
    total: 0
  }
)

const emit = defineEmits<{
  (e: 'update:pageSize', val: number): void
  (e: 'update:pageNumber', val: number): void
}>()

const _pageSize = computed({
  get() {
    return props.pageSize
  },
  set(val) {
    emit('update:pageSize', val)
  }
})
const _pageNumber = computed({
  get() {
    return props.pageNumber
  },
  set(val) {
    emit('update:pageNumber', val)
  }
})
</script>

<style scoped lang="scss"></style>
