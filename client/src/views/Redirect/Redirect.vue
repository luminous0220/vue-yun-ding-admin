<script setup lang="ts">
import { unref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Redirect'
})

const { currentRoute, replace } = useRouter()

const { params, query } = unref(currentRoute)
const { path } = params
replace({
  path: '/' + path,
  query
})
</script>

<template>
  <div></div>
</template>