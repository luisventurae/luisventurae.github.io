<script setup lang="ts">
import Nav from '~/components/landing/organisms/Nav.vue'
import Banner from '~/components/landing/organisms/Banner.vue'
import SkillCard from '~/components/landing/organisms/SkillCard.vue'
import ExperienceCard from '~/components/landing/organisms/ExperienceCard.vue'
import DinamicDownload from '~/components/landing/organisms/DinamicDownload.vue'
import Footeri from '~/components/landing/organisms/Footer.vue'

const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogImage: 'https://luisventurae.github.io/luis-83x83.jpg',
  twitterCard: 'summary_large_image',
  author: 'Luis Miguel Ventura E',
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
