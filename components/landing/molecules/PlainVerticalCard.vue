<script setup lang="ts">
import ShortText from './ShortText.vue'

interface SvgModule {
  default: Component
}

const assets = import.meta.glob<SvgModule>('~/assets/icons/*.svg', {
  eager: true,
  import: 'default',
})

const getIcon = (path: string): Component => {
  const key = `/assets/icons/${path}`
  const mod = assets[key] as SvgModule | undefined
  if (!mod) throw new Error(`Icon not found: ${key}`)
  return mod.default
}

interface Props {
  desk_position: deskPositionEnum
  svg: string
  title: string
  description: string
  skills: SkillPropMolecule[]
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="plain-vertical-card__container"
    :class="`card-radius-${props.desk_position}`"
  >
    <div class="plain-vertical-card__content">
      <component :is="getIcon(props.svg)" />
      <h3>{{ props.title }}</h3>
      <p v-show="props.description" class="plain-description">{{ props.description }}</p>
      <ShortText
        v-for="skill in props.skills"
        :key="skill.subtitle"
        :subtitle="skill.subtitle"
        :content="skill.subdescription"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/global/_variables.module.scss';

$size_h3: 48px;

.plain-vertical-card {
  &__container {
    background-color: var(--color-card-bg);
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
