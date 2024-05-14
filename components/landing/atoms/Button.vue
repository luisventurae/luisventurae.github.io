<script setup lang="ts">
const emit = defineEmits(["click"])
interface Prop {
  label: string
  layout?: layoutValues
}

const props = withDefaults(defineProps<Prop>(), {
  layout: "dark-linear",
})
const label: string = props.label
const layout: layoutValues = props.layout

const foreColorAvailable = {
  "dark-linear": "#ffffff",
  solid: "#262626",
}
const getForeColor = (): string => foreColorAvailable[layout] || "initial"
</script>

<template>
  <div class="button_container" :class="layout" @click="emit('click')">
    {{ label }}
    <slot name="right" :forecolor="getForeColor()" />
    <div><slot name="box" :forecolor="getForeColor()" /></div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";

.button_container {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: scale 0.1s;
  width: fit-content;
  cursor: pointer;

  &.dark-linear {
    background: transparent;
    border: 3px solid #fff;
  }
  &.solid {
    background: $MAIN_COLOR;
    border: 3px solid $MAIN_COLOR;
    color: $MAIN_DARK;
  }

  &:hover {
    scale: 1.05;
  }
}
</style>
