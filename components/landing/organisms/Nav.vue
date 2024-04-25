<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "NavOrganism",
  setup(props) {
    if (process.client) {
      console.log("NavOrganism:props", props)
    }
  },
})
</script>

<template>
  <nav class="nav_container">Nav</nav>
</template>

<style lang="scss" scoped>
.nav_container {
  position: absolute;
}
</style>
