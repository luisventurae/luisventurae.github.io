<script lang="ts">
import { defineComponent } from "vue"
import ImageCard from "~/components/landing/molecules/ImageCard.vue"

export default defineComponent({
  name: "ExperienceCard",
  components: { ImageCard },
  data: () => ({
    section_subtitle: <string>"Experiencias Relevantes",
    card_images: <ExperiencePropMolecule[]>[
      {
        order: 1,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web App",
        company: "En Securitec",
        description: "Plataforma omnicanal para atención al cliente",
        tags: ["Backend", "Frontend"],
      },
      {
        order: 2,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web",
        company: "sec",
        description: "anuma",
        tags: ["back"],
      },
      {
        order: 3,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web",
        company: "sec",
        description: "anuma",
        tags: ["back"],
      },
      {
        order: 4,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web",
        company: "sec",
        description: "anuma",
        tags: ["back"],
      },
      {
        order: 5,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web",
        company: "sec",
        description: "anuma",
        tags: ["back"],
      },
      {
        order: 6,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web",
        company: "sec",
        description: "anuma",
        tags: ["back"],
      },
      {
        order: 7,
        image_url: "/cloud/images/experiences/foto-test.jpg",
        title: "Web",
        company: "sec",
        description: "anuma",
        tags: ["back"],
      },
    ],
  }),
  methods: {
    clickFSButton(cardSelected: ExperiencePropMolecule): void {
      console.log("a ver open full screen", cardSelected)
    },
  },
})
</script>

<template>
  <section class="experience-card__container">
    <h2 class="section-subtitle">{{ section_subtitle }}</h2>
    <div class="experience-card__content">
      <ImageCard
        v-for="card_image in card_images"
        :order="card_image.order"
        :image_url="card_image.image_url"
        :title="card_image.title"
        :company="card_image.company"
        :description="card_image.description"
        :tags="card_image.tags"
        @open="clickFSButton"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
$max_size_card: 300px + 24px + 24px; /* 1 width + 2 paddings de .image-card__container */

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
