<script lang="ts">
import { defineComponent } from "vue"
import BandCard from "~/components/landing/molecules/BandCard.vue"

export default defineComponent({
  name: "DemoAppCard",
  components: { BandCard },
  data: () => ({
    demos: <Demoapp[]>[
      {
        key: "1",
        url: "/cloud/images/experiences/foto-test.jpg",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        direction: "image-left",
        ctas: [
          {
            label: "GitHub",
            url: "https://github.com/",
            action: "redirect",
            layout: "dark-linear",
          },
          {
            label: "Probar",
            url: "https://github.com/",
            action: "redirect",
            layout: "solid",
          },
        ],
      },
      {
        key: "2",
        url: "/cloud/images/experiences/foto-test.jpg",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        direction: "image-right",
        ctas: [
          {
            label: "GitHub",
            url: "https://github.com/",
            action: "redirect",
            layout: "dark-linear",
          },
          {
            label: "Probar",
            url: "https://github.com/",
            action: "redirect",
            layout: "solid",
          },
        ],
      },
    ],
  }),
})
</script>

<template>
  <section class="demoapp-card__container">
    <h2>Demos Personales</h2>
    <div class="demoapp-card__content">
      <BandCard v-for="demo in demos" :app="demo" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.demoapp-card {
  &__container {
    max-width: 1100px;
    h2 {
      text-align: center;
    }
  }
}
</style>
