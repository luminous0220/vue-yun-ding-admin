<template>
  <!-- 包装内置的 Transition 组件 -->
  <Transition :name="name" appear mode="out-in">
    <slot></slot>
  </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ name?: string; delay?: number }>(), {
  name: 'wipe-fade-left-right',
  delay: 0
})

const delayCom = computed(() => props.delay + 's')
</script>

<style lang="scss">
.wipe-fade-left-right-leave-active,
.wipe-fade-left-right-enter-active {
  transition: all ease 0.3s;
  transition-delay: v-bind('delayCom');
}
.wipe-fade-left-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.wipe-fade-left-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.wipe-fade-bottom-top-leave-active,
.wipe-fade-bottom-top-enter-active {
  transition: all ease 0.3s;
  transition-delay: v-bind('delayCom');
}
.wipe-fade-bottom-top-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.wipe-fade-bottom-top-leave-to {
  opacity: 1;
  transform: translateY(0px);
}

.fade-leave-active,
.fade-enter-active {
  transition: all ease 0.2s;
  transition-delay: v-bind('delayCom');
}

.fade-enter-from {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>
