<script setup lang="ts">
import TreeBgIcon from "~/assets/icons/tree-bg.svg"
import Tooltip from "~/components/landing/atoms/Tooltip.vue"

interface Prop {
  trees: DataTree[]
}
const props = defineProps<Prop>()

const formatText = (date: Date): string => {
  return "Descarga: xxx"
}
const tooltip = reactive({ visible: false })
const selected = reactive({ tree: -1 })
const showTooltip = (order?: number): void => {
  console.log("order", order)
  selected.tree = order || -1
  tooltip.visible = true
}
</script>

<template>
  <div class="dinamic-bg__container">
    <div
      class="dinamic-bg__icon"
      v-for="tree in props.trees"
      :class="{ standout: tree.self }"
    >
      <Tooltip
        :visible="tree.order === selected.tree && tooltip.visible"
        :text-title="tree.company"
        :text-foot="formatText(tree.date)"
      >
        <TreeBgIcon @click="showTooltip(tree.order)" />
      </Tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module";

.dinamic-bg {
  &__container {
    display: flex;
    justify-content: space-evenly;
    overflow: hidden;
    margin: 0 auto;
    height: -webkit-fill-available;
  }
  &__icon {
    display: inline-block;
    color: $SECONDARY_DARK;
    cursor: pointer;
    svg {
      width: 100px;
      height: 100px;
      margin-bottom: 0;
    }
    &.standout {
      color: $MAIN_COLOR;
    }
  }
}
</style>

<style lang="scss">
@import "~/global/_variables.module";

.dinamic-bg {
  &__icon {
    &.standout {
      p {
        color: $MAIN_COLOR;
      }
    }
  }
}
</style>
