<script setup lang="ts">
import ImageCard from '~/components/landing/molecules/ImageCard.vue'
import ProjectModal from '~/components/landing/organisms/ProjectModal.vue'

interface LocaleExperienceCard {
  title: string
  description: string
}

const { t, tm, rt } = useI18n()

const staticMeta: Pick<ExperiencePropMolecule, 'order' | 'image_url' | 'company' | 'tags' | 'date' | 'url' | 'techs'>[] = [
  {
    order: 1,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-ticker-1.webp',
    company: 'En Securitec',
    tags: ['Backend', 'Frontend'],
    date: '2023-06',
    techs: ['Vue.js', 'NuxtJs', 'NestJs', 'NodeJs', 'MongoDB', 'WebSockets', 'Redis'],
  },
  {
    order: 2,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-securitec-1.webp',
    company: 'En Securitec',
    tags: ['Backend'],
    date: '2022-08',
    techs: ['NestJs', 'NodeJs', 'MongoDB', 'AWS'],
  },
  {
    order: 3,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-pwc-1.webp',
    company: 'En Pool Work Confort',
    tags: ['Backend', 'Frontend'],
    date: '2022-03',
    techs: ['Vue.js', 'NuxtJs', 'AdonisJs', 'NodeJs', 'MongoDB'],
  },
  {
    order: 4,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-pwc-0.webp',
    company: 'En Pool Work Confort',
    tags: ['Backend'],
    date: '2021-10',
    techs: ['NodeJs', 'AdonisJs', 'MySQL'],
  },
  {
    order: 5,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-cepeban-0.webp',
    company: 'En Instituto Cepeban',
    tags: ['Backend'],
    date: '2021-03',
    techs: ['NodeJs', 'ExpressJs', 'MySQL', 'Zoho CRM'],
  },
  {
    order: 6,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-asu-1.webp',
    company: 'En Asu Cuenta',
    tags: ['Backend', 'Frontend'],
    date: '2022-11',
    techs: ['Vue.js', 'NodeJs', 'MongoDB'],
  },
  {
    order: 7,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-busc-1.webp',
    company: 'En Busconsulting',
    tags: ['Backend', 'GUI'],
    date: '2020-09',
    techs: ['Electron', 'Vue.js', 'NodeJs', 'MySQL'],
  },
]

const cardImages = computed<ExperiencePropMolecule[]>(() =>
  (tm('experience.cards') as any[]).map((card, i) => ({
    ...staticMeta[i],
    title: rt(card.title),
    description: rt(card.description),
  }))
)

const selectedIndex = ref<number | null>(null)
const openModal = (index: number): void => { selectedIndex.value = index }
const closeModal = (): void => { selectedIndex.value = null }
</script>

<template>
  <section id="experience" class="experience-card__container">
    <h2 v-reveal class="section-subtitle">{{ t('experience.sectionTitle') }}</h2>
    <div class="experience-card__content">
      <ImageCard
        v-for="(card, index) in cardImages"
        :key="card.order"
        v-reveal="{ delay: ((card.order - 1) % 3) * 100 }"
        :order="card.order"
        :image_url="card.image_url"
        :title="card.title"
        :company="card.company"
        :description="card.description"
        :tags="card.tags"
        @open="openModal(index)"
      />
    </div>

    <ProjectModal
      v-if="selectedIndex !== null"
      :cards="cardImages"
      :initial-index="selectedIndex"
      @close="closeModal"
    />
  </section>
</template>

<style lang="scss" scoped>
$max_size_card: 300px + 24px + 24px;

.experience-card {
  &__container {
    .section-subtitle { text-align: center; }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, $max_size_card);
    gap: 48px 24px;
    justify-content: center;
  }
}
</style>
