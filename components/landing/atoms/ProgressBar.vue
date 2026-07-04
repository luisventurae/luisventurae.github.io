<script setup lang="ts">
interface Prop {
  total: number
  loaded: number
}
const props = defineProps<Prop>()

const advance = (): string => {
  let width: number = (props.loaded * 100) / props.total
  return `${width}%`
}
</script>

<template>
  <div class="progress-bar__container">
    <!-- <p>{{ loaded }}/{{ total }}</p> -->
    <div class="progress-bar__content">
      <div
        class="progress-bar__content__bar"
        :style="`width: ${advance()}`"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";

.progress-bar {
  &__content {
    height: 10px;
    width: 300px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ffffff2b;
    &__bar {
      background-color: $MAIN_COLOR;
      height: 100%;
      width: 0%;
      opacity: 0.9;
    }
  }
}
</style>
