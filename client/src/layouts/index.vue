<template>
  <component :is="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import type { Component } from 'vue'
import { ILayout } from '@/stores'
import { useGlobalStore } from '@/stores/modules/global'
import LayoutClassic from '@/layouts/LayoutClassic.vue'

const ThemeDrawer = defineAsyncComponent(
  () => import('@/layouts/components/ThemeDrawer/ThemeDrawer.vue')
)

const LayoutVertical = defineAsyncComponent(
  () => import('@/layouts/LayoutVertical.vue')
)

const LayoutComponents: Record<ILayout, Component> = {
  classic: LayoutClassic,
  vertical: LayoutVertical
}

const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)
</script>

<style lang="scss"></style>
