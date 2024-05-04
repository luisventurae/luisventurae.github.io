<!-- Átomo: Full Screen Button -->
<script setup lang="ts">
import FSIcon from "~/assets/icons/full-screen.svg"
const emit = defineEmits(["open"])
</script>

<template>
  <div class="fs-button__container" @click="emit('open')">
    <FSIcon />
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";
$size_card: 40px;

.fs-button {
  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $size_card;
    height: $size_card;
    border-radius: 100%;
    background-color: $MAIN_COLOR;
    color: $MAIN_DARK;
    cursor: pointer;
    position: relative;
    svg {
      fill: $MAIN_DARK;
      margin-bottom: -1px;
    }
  }
}
</style>
