<script setup lang="ts">
import ImageCard from '~/components/landing/molecules/ImageCard.vue'

interface LocaleExperienceCard {
  title: string
  description: string
}

const { t, tm, rt } = useI18n()

const staticMeta: Pick<ExperiencePropMolecule, 'order' | 'image_url' | 'company' | 'tags'>[] = [
  { order: 1, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-ticker-1.webp',   company: 'En Securitec',         tags: ['Backend', 'Frontend'] },
  { order: 2, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-securitec-1.webp', company: 'En Securitec',         tags: ['Backend'] },
  { order: 3, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-pwc-1.webp',       company: 'En Pool Work Confort', tags: ['Backend', 'Frontend'] },
  { order: 4, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-pwc-0.webp',       company: 'En Pool Work Confort', tags: ['Backend'] },
  { order: 5, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-cepeban-0.webp',   company: 'En Instituto Cepeban', tags: ['Backend'] },
  { order: 6, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-asu-1.webp',       company: 'En Asu Cuenta',        tags: ['Backend', 'Frontend'] },
  { order: 7, image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-busc-1.webp',      company: 'En Busconsulting',     tags: ['Backend', 'GUI'] },
]

const cardImages = computed<ExperiencePropMolecule[]>(() =>
  (tm('experience.cards') as any[]).map((card, i) => ({
    ...staticMeta[i],
    title: rt(card.title),
    description: rt(card.description),
  }))
)
</script>

<template>
  <section id="experience" class="experience-card__container">
    <h2 v-reveal class="section-subtitle">{{ t('experience.sectionTitle') }}</h2>
    <div class="experience-card__content">
      <ImageCard
        v-for="card in cardImages"
        :key="card.order"
        v-reveal="{ delay: ((card.order - 1) % 3) * 100 }"
        :order="card.order"
        :image_url="card.image_url"
        :title="card.title"
        :company="card.company"
        :description="card.description"
        :tags="card.tags"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
$max_size_card: 300px + 24px + 24px;

.experience-card {
  &__container {
    .section-subtitle {
      text-align: center;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, $max_size_card);
    gap: 36px 24px;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
