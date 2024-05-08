<script setup lang="ts">
import ShortText from "./ShortText.vue"

function getIcon(path: string): Component {
  const assets = import.meta.glob("~/assets/icons/*.svg", {
    eager: true,
    import: "default",
  })
  // @ts-expect-error: wrong type info
  return assets["/assets/icons/" + path]
}

interface Props {
  desk_position: deskPositionEnum
  svg: string
  title: string
  description: string
  skills: SkillPropMolecule[]
}
const props = defineProps<Props>()
const desk_position: string = props.desk_position
const svg: string = props.svg
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
      <component :is="getIcon(svg)" />
      <h3>{{ title }}</h3>
      <p v-show="description" class="plain-description">{{ description }}</p>
      <ShortText
        v-for="skill in skills"
        :subtitle="skill.subtitle"
        :unit_content="skill.subdescriptions"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";
$size_h3: 48px;

.plain-vertical-card {
  &__container {
    background-color: $SECONDARY_DARK;
    padding: 32px;
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
    .plain-description {
      margin-top: 0;
    }
    svg {
      width: $size_h3;
      height: $size_h3;
    }
  }
}
</style>
