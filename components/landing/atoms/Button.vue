<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "ButtonAtom",
  props: {
    label: { type: String, require: true },
    layout: {
      type: String,
      enum: ["dark-linear", "solid"],
      default: "dark-linear",
    },
  },
  setup(props) {
    if (process.client) {
      console.log("ButtonAtom:props", props)
    }
  },
})
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
  transition: 0.3s;
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
