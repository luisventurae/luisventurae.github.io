<script setup lang="ts">
import Nav from "~/components/landing/organisms/Nav.vue"
import Banner from "~/components/landing/organisms/Banner.vue"
import SkillCard from "~/components/landing/organisms/SkillCard.vue"
import ExperienceCard from "~/components/landing/organisms/ExperienceCard.vue"
import DemoAppCard from "~/components/landing/organisms/DemoAppCard.vue"
import DinamicDownload from "~/components/landing/organisms/DinamicDownload.vue"
import Footeri from "~/components/landing/organisms/Footer.vue"

useHead({
  htmlAttrs: {
    lang: "es",
  },
})
useSeoMeta({
  title: "Luis Ventura E | Portafolio",
  description:
    "Ingeniero Full Stack y desarrollador web apasionado por las tecnologías emergentes. Experiencia en la implementación de Javascript avanzado tanto en el lado del cliente como del servidor para crear soluciones web robustas y eficientes",
  ogTitle: "Luis Ventura E | Portafolio",
  ogDescription:
    "Ingeniero Full Stack y desarrollador web apasionado por las tecnologías emergentes. Experiencia en la implementación de Javascript avanzado tanto en el lado del cliente como del servidor para crear soluciones web robustas y eficientes",
  ogImage: "https://luisventurae.github.io/luis-83x83.jpg",
  twitterCard: "summary_large_image",
  author: "Luis Miguel Ventura E",
})
</script>

<template>
  <Nav />
  <Banner />
  <SkillCard />
  <ExperienceCard />
  <!-- TODO -->
  <!-- <DemoAppCard /> -->
  <DinamicDownload />
  <Footeri />
</template>
