<script setup lang="ts">
import ShortText from "./ShortText.vue"

const props = defineProps({
  desk_position: {
    type: String,
    required: true,
    enum: ["left", "right", "fill"],
  },
  title: { type: String, required: true },
  description: { type: String, required: false },
  skills: Array as PropType<Array<SkillPropMolecule>>,
})
const desk_position: string = props.desk_position
const title: string = props.title
const description = props.description
const skills = props.skills
</script>

<template>
  <div
    class="plain-vertical-card__container"
    :class="`card-radius-${desk_position}`"
  >
    <div class="plain-vertical-card__content">
      <p>Logo</p>
      <h3>{{ title }}</h3>
      <p v-show="description">{{ description }}</p>

      <ShortText
        v-for="skill in skills"
        :subtitle="skill.subtitle"
        :content="skill.subdescription"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";

.plain-vertical-card {
  &__container {
    background-color: $SECONDARY_DARK;
    padding: 20px;
    border-radius: $RADIUS_CARD;
    &.card-radius-left {
      border-radius: $RADIUS_CARD 0 0 $RADIUS_CARD;
    }
    &.card-radius-right {
      border-radius: 0 $RADIUS_CARD $RADIUS_CARD 0;
    }
  }
  &__content {
    text-align: center;
    h3 {
      margin: 0;
    }
  }
}
</style>
