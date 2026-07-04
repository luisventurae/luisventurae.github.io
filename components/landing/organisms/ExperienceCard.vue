<script setup lang="ts">
import ImageCard from '~/components/landing/molecules/ImageCard.vue'

const sectionSubtitle = 'Experiencias Relevantes'

const cardImages: ExperiencePropMolecule[] = [
  {
    order: 1,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-ticker-1.webp',
    title: 'Web App',
    company: 'En Securitec',
    description: 'Plataforma omnicanal para atención al cliente',
    tags: ['Backend', 'Frontend'],
  },
  {
    order: 2,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-securitec-1.webp',
    title: 'Web Page',
    company: 'En Securitec',
    description: 'Página web informativa de la empresa',
    tags: ['Backend'],
  },
  {
    order: 3,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-pwc-1.webp',
    title: 'Web Page',
    company: 'En Pool Work Confort',
    description: 'Página web informativa y tienda virtual de la empresa',
    tags: ['Backend', 'Frontend'],
  },
  {
    order: 4,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-pwc-0.webp',
    title: 'Software Email',
    company: 'En Pool Work Confort',
    description: 'Software de envío automatizado de correos electrónicos',
    tags: ['Backend'],
  },
  {
    order: 5,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-cepeban-0.webp',
    title: 'API',
    company: 'En Instituto Cepeban',
    description: 'Integración de CRM interno y aplicación de atención de clientes',
    tags: ['Backend'],
  },
  {
    order: 6,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-asu-1.webp',
    title: 'Web APP',
    company: 'En Asu Cuenta',
    description: 'Sistema e-commerce y control de finanzas',
    tags: ['Backend', 'Frontend'],
  },
  {
    order: 7,
    image_url: 'https://pub-e3c720e29148489586f932c5cacf32a4.r2.dev/cloud/images/experiences/ss-busc-1.webp',
    title: 'Desktop App',
    company: 'En Busconsulting',
    description: 'Sistema administrador de la página web con control de usuarios',
    tags: ['Backend', 'GUI'],
  },
]
</script>

<template>
  <section id="experience" class="experience-card__container">
    <h2 v-reveal class="section-subtitle">{{ sectionSubtitle }}</h2>
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
