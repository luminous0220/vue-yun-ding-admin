<template>
  <i class="svg-icon">
    <svg aria-hidden="true">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '18'
  },
  color: {
    type: String,
    default: 'inherit'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const fontSize = computed(() => props.size + 'px')
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  font-size: v-bind(fontSize);
  color: v-bind('color');
  height: 1em;
  width: 1em;
  line-height: 1em;
  position: relative;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 1em;
    width: 1em;
  }
}
</style>
