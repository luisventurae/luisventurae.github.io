<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "Footer",
})
</script>

<template>
  <footer class="footer__container"><p>FOOTER</p></footer>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module";

.footer {
  &__container {
    background-color: $SECONDARY_DARK;
    padding: 100px 0;
  }
}
</style>
