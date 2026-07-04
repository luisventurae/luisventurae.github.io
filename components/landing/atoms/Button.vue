<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>()

interface Prop {
  label: string
  layout?: layoutValues
}

const props = withDefaults(defineProps<Prop>(), {
  layout: 'dark-linear',
})
const label: string = props.label
const layout: layoutValues = props.layout
</script>

<template>
  <div class="button_container" :class="layout" @click="emit('click')">
    {{ label }}
    <slot name="right" />
    <div><slot name="box" /></div>
  </div>
</template>

<style lang="scss" scoped>
.button_container {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: scale 0.1s ease;
  width: fit-content;

  &.dark-linear {
    background: transparent;
    border: 3px solid var(--color-border);
    color: var(--color-fg);
  }

  &.solid {
    background: var(--color-accent);
    border: 3px solid var(--color-accent);
    color: #050a0d; // always dark text on accent yellow
  }

  &:hover {
    scale: 1.05;
  }
}
</style>
