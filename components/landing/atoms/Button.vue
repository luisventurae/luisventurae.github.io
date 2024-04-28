<script setup lang="ts">
interface Prop {
  label: string
  layout?: layoutValues
}

const props = withDefaults(defineProps<Prop>(), {
  layout: "dark-linear",
})
const label: string = props.label
const layout: layoutValues = props.layout
</script>

<template>
  <div class="button_container" :class="layout">
    {{ label }}
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";

.button_container {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: 0.2s;
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
