<script setup lang="ts">
interface Prop {
  visible: boolean
  textTitle?: string
  textFoot: string
  top?: string
}

const props = defineProps<Prop>()
</script>

<template>
  <div class="tooltip__container">
    <div
      v-if="props.visible"
      class="tooltip__content"
      :style="`top: ${props.top || ''}`"
    >
      <p v-if="props.textTitle" class="title">{{ props.textTitle }}</p>
      <p class="foot">{{ props.textFoot }}</p>
      <slot name="box"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module";

.tooltip {
  &__container {
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 100%;
  }
  &__content {
    position: absolute;
    background-color: #262626f0;
    padding: 8px 12px;
    border-radius: 8px 8px 0 8px;
    z-index: 10;
    box-shadow: 0px 0px 4px #000;
    .foot {
      font-size: 12px;
    }
    p {
      color: #fff;
    }
  }
}
</style>
