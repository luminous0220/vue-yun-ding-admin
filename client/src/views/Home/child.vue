<template>
  <button @click="injectProp?.updateLocation">{{ injectProp?.location }}</button>
</template>

<script setup lang="ts">
import { inject } from 'vue'

interface IInject {
  location: string
  updateLocation: Function
}

const injectProp = inject<IInject>('location')
</script>
