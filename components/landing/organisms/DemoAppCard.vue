<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "DemoAppCard",
  data: () => ({
    demos: <Demoapp[]>[
      {
        key: "1",
        url: "/cloud/images/experiences/foto-test.jpg",
        description: "Lorem Ipsus",
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
        description: "Lorem Ipsus",
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
    <div class="demoapp-card__content">DEMO</div>
  </section>
</template>

<style lang="scss" scoped></style>
