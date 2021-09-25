<template>
  <Layout>
    <HomeTemplate :page="page" />
  </Layout>
</template>

<script>
import HomeTemplate from "@/components/templates/HomeTemplate.vue"
import Page_Fr from '@/assets/content/home/fr.json'

export default {
  metaInfo: {
    title: "Portfolio",
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      {
        name: "description",
        content: "Ingénieur backend, pile Javascript complète. Amoureux de la technologie, autodidacte pour l'amélioration continue des systèmes Web. Utilisation de Javascript avancé côté serveur et côté client.",
      },
      {
        name: "robots",
        content: "index, follow",
      },
      {
        name: "googlebot",
        content: "index, follow",
      },
      {
        key:
          "fullstack, js, javascript, node, nodejs, ingénieur, systèmes, web, aplicacion, engineer, luisventurae, luis, miguel, ventura, universidad, autonoma, peru, leader, lima",
      },
      {
        property: "og:title",
        content: "Luis Miguel Ventura | Portfolio",
      },
      {
        property: "og:description",
        content: "Ingénieur backend, pile Javascript complète. Amoureux de la technologie, autodidacte pour l'amélioration continue des systèmes Web. Utilisation de Javascript avancé côté serveur et côté client.",
      },
      {
        property: "og:url",
        content: "https://luisventurae.github.io/",
      },
      {
        property: "og:image",
        content:
          "https://luisventurae.github.io/assets/images/img-20190809-wa0092-400x711.jpg",
      },
      {
        property: "og:determiner",
        content: "briefcase",
      },
      {
        property: "og:locale",
        content: "es_PE",
      },
      {
        property: "og:type",
        content: "profile",
      },
      {
        property: "og:profile:first_name",
        content: "Luis Miguel",
      },
      {
        property: "og:profile:last_name",
        content: "Ventura",
      },
      {
        property: "og:profile:username",
        content: "luisventurae",
      },
      {
        property: "og:profile:gender",
        content: "male",
      },
      {
        name: "google-site-verification",
        content: process.env.GRIDSOME_GOOGLE_VERIFICATION,
      },
    ],
    link: [
      {
        rel: "alternate",
        hreflang: "fr",
        href: "https://luisventurae.github.io/",
      },
      {
        rel: "alternate",
        hreflang: "fr",
        href: "https://luisventurae.github.io/fr/",
      },
    ],
  },
  components: {
    HomeTemplate,
  },
  data: () => ({
    page: Page_Fr,
  })
};
</script>

<style></style>
