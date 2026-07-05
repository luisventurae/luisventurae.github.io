<script setup lang="ts">
import PlainVerticalCard from '~/components/landing/molecules/PlainVerticalCard.vue'

interface LocaleSkillItem {
  subtitle: string
}

interface LocaleSkillCard {
  title: string
  description: string
  items: LocaleSkillItem[]
}

const { tm, rt } = useI18n()

const staticSkills: ItemShortReview[][][] = [
  [
    [
      { name: 'JavaScript', stars: 10 }, { name: 'TypeScript', stars: 8.5 },
      { name: 'PHP', stars: 3 }, { name: 'Java', stars: 4 }, { name: 'Solidity', stars: 1 },
    ],
    [
      { name: 'NodeJs', stars: 9 }, { name: 'NestJs', stars: 7 }, { name: 'ExpressJs', stars: 7 },
      { name: 'AdonisJs', stars: 8 }, { name: 'Mongoose', stars: 9 }, { name: 'Spring Boot', stars: 1 },
    ],
    [
      { name: 'MongoDB', stars: 4 }, { name: 'MySQL', stars: 4 },
      { name: 'PostgreSQL', stars: 4 }, { name: 'SQL Server', stars: 4 },
    ],
    [
      { name: 'Linux', stars: 4 }, { name: 'CPanel', stars: 5 }, { name: 'AWS', stars: 3 },
      { name: 'Heroku', stars: 4 }, { name: 'Vercel', stars: 6 }, { name: 'Cloudflare', stars: 4 },
    ],
    [
      { name: 'Sockets', stars: 8 }, { name: 'Redis', stars: 4 }, { name: 'Kafka', stars: 3 },
    ],
  ],
  [
    [
      { name: 'VueJs', stars: 6 }, { name: 'NuxtJs', stars: 4 },
      { name: 'Vite', stars: 4 }, { name: 'Web Components', stars: 7 },
    ],
    [
      { name: 'Sass', stars: 9 }, { name: 'Scss', stars: 9 }, { name: 'Stylus', stars: 8 },
    ],
    [
      { name: 'Antdv', stars: 5 },
    ],
    [
      { name: 'SEO', stars: 7 }, { name: 'Responsive Design', stars: 8 }, { name: 'PWA', stars: 8 },
    ],
  ],
  [
    [
      { name: 'Git', stars: 9 }, { name: 'Docker', stars: 4 },
    ],
    [
      { name: 'WABA', stars: 8 }, { name: 'Zoho CRM', stars: 5 }, { name: 'Airtable API', stars: 6 },
      { name: 'Twilio', stars: 5 }, { name: 'Authy', stars: 4 }, { name: 'Cloudflare', stars: 4 },
    ],
    [
      { name: 'SCRUM', stars: 6 },
    ],
  ],
]

const staticMeta: Pick<SkillCard, 'className' | 'svg' | 'deskPosition'>[] = [
  { className: 'pcard1', svg: 'backend-servers.svg', deskPosition: 'left'  },
  { className: 'pcard2', svg: 'frontend.svg',        deskPosition: 'right' },
  { className: 'pcard3', svg: 'tools.svg',           deskPosition: 'fill'  },
]

const skillCards = computed<SkillCard[]>(() =>
  (tm('skills.cards') as any[]).map((card, i) => ({
    ...staticMeta[i],
    title: rt(card.title),
    description: rt(card.description),
    skills: (card.items as any[]).map((item, j) => ({
      subtitle: rt(item.subtitle),
      subdescriptions: staticSkills[i][j] ?? [],
    })),
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
