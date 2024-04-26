<script setup lang="ts">
import ShortText from "./ShortText.vue"
// const p = useAttrs()
const LogoSkill = defineAsyncComponent(
  () => import(`~/assets/icons/backend-servers.svg`)
)
// const LogoSkill = defineAsyncComponent(() => import(`~/assets/icons/${p.icon}`))
const props = defineProps({
  desk_position: {
    type: String,
    required: true,
    enum: ["left", "right", "fill"],
  },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  skills: Array as PropType<Array<SkillPropMolecule>>,
})
const desk_position: string = props.desk_position
const icon: string = props.icon
// const LogoSkill = defineAsyncComponent(() => import(`~/assets/icons/${icon}.svg`))
// const LogoSkill = defineAsyncComponent(() => import("~/assets/icons/" + icon))
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
      <!-- <LogoSkill /> -->
      <component :is="LogoSkill" />
      <h3>{{ title }}</h3>
      <p v-show="description" class="plain-description">{{ description }}</p>

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
$size_h3: 48px;

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
