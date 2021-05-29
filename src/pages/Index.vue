<template>
  <Layout>
    <HomeTemplate :page="page" />
  </Layout>
</template>

<script>
import HomeTemplate from "@/components/templates/HomeTemplate.vue"
import Page_Es from '@/assets/content/home/es.json'

export default {
  metaInfo: {
    title: "Portafolio",
    meta: [
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
          "fullstack, js, javascript, node, nodejs, ingeniero, sistemas, web, aplicacion, engineer, luisventurae, luis, miguel, ventura, universidad, autonoma, peru, leader, lima",
      },
      {
        property: "og:title",
        content: "Luis Miguel Ventura | Portafolio",
      },
      {
        property: "og:url",
        content: "https://luisventurae.github.io/",
      },
      {
        property: "og:image",
        content:
          "https://luisventurae.github.io/assets/images/img-20190809-wa0092-400x711.jpeg",
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
        hreflang: "es",
        href: "https://luisventurae.github.io/",
      },
      {
        rel: "alternate",
        hreflang: "es",
        href: "https://luisventurae.github.io/en/",
      },
    ],
  },
  components: {
    HomeTemplate,
  },
  data: () => ({
    page: Page_Es,
  })
}
</script>

<style></style>
