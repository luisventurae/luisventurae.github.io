<script setup lang="ts">
import PlainVerticalCard from '~/components/landing/molecules/PlainVerticalCard.vue'

interface LocaleSkillItem {
  subtitle: string
  subdescription: string
}

interface LocaleSkillCard {
  title: string
  description: string
  items: LocaleSkillItem[]
}

const { tm } = useI18n()

const staticMeta: Pick<SkillCard, 'className' | 'svg' | 'deskPosition'>[] = [
  { className: 'pcard1', svg: 'backend-servers.svg', deskPosition: 'left'  },
  { className: 'pcard2', svg: 'frontend.svg',        deskPosition: 'right' },
  { className: 'pcard3', svg: 'tools.svg',           deskPosition: 'fill'  },
]

const skillCards = computed<SkillCard[]>(() =>
  (tm('skills.cards') as LocaleSkillCard[]).map((card, i) => ({
    ...staticMeta[i],
    title: card.title,
    description: card.description,
    skills: card.items.map((item) => ({ subtitle: item.subtitle, subdescription: item.subdescription })),
  }))
)
</script>

<template>
  <section id="skills" class="skill-card__container">
    <PlainVerticalCard
      v-for="(card, index) in skillCards"
      :key="card.className"
      v-reveal="{ delay: index * 120 }"
      :class="card.className"
      :svg="card.svg"
      :desk_position="card.deskPosition"
      :title="card.title"
      :description="card.description"
      :skills="card.skills"
    />
  </section>
</template>

<style lang="scss" scoped>
@import '~/global/_breakpoints.module.scss';

.skill-card {
  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'pcard1 pcard2'
      'pcard3 pcard3';
    gap: 8px 1px;
    max-width: 51em;
    padding: 24px;
    padding-top: 80px;
  }
}

.pcard1 {
  grid-area: pcard1;
}

.pcard2 {
  grid-area: pcard2;
}

.pcard3 {
  grid-area: pcard3;
  height: fit-content;
}

@media (max-width: $BK_DESKTOP) {
  .skill-card {
    &__container {
      grid-auto-columns: auto;
      grid-template-columns: 1fr;
      grid-template-rows: 3fr;
      grid-template-areas: inherit;
      width: 80%;
    }
  }

  .pcard1,
  .pcard2,
  .pcard3 {
    grid-area: inherit;
    border-radius: 24px !important;
  }
}
</style>
