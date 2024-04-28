<script setup lang="ts">
import Nav from "~/components/landing/organisms/Nav.vue"
import Banner from "~/components/landing/organisms/Banner.vue"
import SkillCard from "~/components/landing/organisms/SkillCard.vue"
import ExperienceCard from "~/components/landing/organisms/ExperienceCard.vue"

useSeoMeta({
  title: "Luis Ventura E | Portafolio",
})
</script>

<template>
  <Nav />
  <Banner />
  <SkillCard />
  <ExperienceCard />
</template>
