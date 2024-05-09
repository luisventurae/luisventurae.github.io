<script setup lang="ts">
import TreeBgIcon from "~/assets/icons/tree-bg.svg"
import Tooltip from "~/components/landing/atoms/Tooltip.vue"
import { onClickOutside } from "@vueuse/core"
import { useDayjs } from "#dayjs"
const dayjs = useDayjs()
dayjs.locale("es")

interface Prop {
  trees: DataTree[]
}
const props = defineProps<Prop>()

const formatText = (date: Date): string => {
  const dj = dayjs(date).format("DD/MM/YYYY")
  return `Descarga: ${dj}`
}
const tooltip = reactive({ visible: false })
const selected = reactive({ tree: -1 })
const showTooltip = (order?: number): void => {
  selected.tree = order || -1
  tooltip.visible = true
}

const target_tooltip = ref(null)
onClickOutside(target_tooltip, (evt) => {
  if (selected.tree === -1) return
  selected.tree = -1
})
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
        top="24px"
        ref="target_tooltip"
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
    svg {
      width: 100px;
      height: 100px;
      margin-bottom: 0;
      cursor: pointer;
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
