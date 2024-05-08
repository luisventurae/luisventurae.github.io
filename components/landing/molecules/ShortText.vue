<script setup lang="ts">
import Tooltip from "~/components/landing/atoms/Tooltip.vue"

const props = defineProps({
  subtitle: { type: String, required: true },
  content: { type: String, required: false, default: "" },
  unit_content: { type: Array<ItemShortReview>, required: false },
})
const subtitle: string = props.subtitle
const content: string = props.content

const selected = reactive({ index_item: -1 })
const isLastItem = (index: number): boolean => {
  return (props.unit_content || []).length - 1 === index
}
const showTooltip = (index?: number): void => {
  selected.index_item = index || -1
}
</script>

<template>
  <div class="short-text__container">
    <p class="short-subtitle">{{ subtitle }}</p>
    <p class="short-unit_content" v-if="props.unit_content">
      <span
        class="short-unit_content__span"
        v-for="(unit_item, i) in props.unit_content"
      >
        <Tooltip
          :visible="selected.index_item === i"
          :text-foot="`Experencia: ${unit_item.stars}/10`"
          @click="showTooltip(i)"
        >
          {{ unit_item.name
          }}<span v-if="!isLastItem(i)" class="short-unit_content__symbol"
            >,
            <!-- <p>
              {{ unit_item.stars }}
            </p> -->
          </span>
        </Tooltip>
      </span>
    </p>
    <p class="short-content" v-else-if="props.content">{{ content }}</p>
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
  .short-unit_content {
    margin-top: 8px;
    cursor: default;
    &__span {
      position: relative;
      display: inline-block;
      padding: 4px 4px 4px 8px;
      transition: 0.1s;
      border-radius: 8px;
      &:hover {
        background-color: $MAIN_DARK;
      }
    }
  }
}
</style>
