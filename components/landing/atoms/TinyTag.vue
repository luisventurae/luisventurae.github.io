<script setup lang="ts">
interface Props {
  text: string
}
const props = defineProps<Props>()
</script>

<template>
  <div class="tiny-tag__container">
    <span>
      {{ props.text }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";

.tiny-tag {
  &__container {
    background-color: $MAIN_COLOR;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    margin: 0 4px 0 0;
    span {
      font-size: 14px;
      color: $MAIN_DARK;
    }
  }
}
</style>
