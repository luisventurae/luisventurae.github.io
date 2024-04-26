<script setup lang="ts">
const props = defineProps({
  subtitle: { type: String, required: true },
  content: { type: String, required: true },
})
const subtitle: string = props.subtitle
const content: string = props.content
</script>

<template>
  <div class="short-text__container">
    <p class="short-subtitle">{{ subtitle }}</p>
    <p class="short-content">{{ content }}</p>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";

.short-text__container {
  .short-subtitle {
    font-size: 24px;
    color: $MAIN_COLOR;
    margin-bottom: 0;
  }
  .short-content {
    margin-top: 8px;
  }
}
</style>
