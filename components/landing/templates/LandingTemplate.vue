<script setup lang="ts">
import Nav from '~/components/landing/organisms/Nav.vue'
import Banner from '~/components/landing/organisms/Banner.vue'
import SkillCard from '~/components/landing/organisms/SkillCard.vue'
import ExperienceCard from '~/components/landing/organisms/ExperienceCard.vue'
import DinamicDownload from '~/components/landing/organisms/DinamicDownload.vue'
import Footeri from '~/components/landing/organisms/Footer.vue'

const { t, locale } = useI18n()

const BASE_URL = 'https://luisventurae.github.io'
const OG_IMAGE  = `${BASE_URL}/cloud/images/luis-ventura-e-min.webp`

const ogLocaleMap: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
}

// Hreflang + canonical automáticos por @nuxtjs/i18n
const i18nHead = useLocaleHead({ addDirAttribute: true, addSeoAttributes: true })

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs ?? {},
  link:      i18nHead.value.link      ?? [],
  meta:      i18nHead.value.meta      ?? [],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': `${BASE_URL}/#person`,
            name: 'Luis Miguel Ventura E',
            url: BASE_URL,
            image: `${BASE_URL}/luis-83x83.jpg`,
            jobTitle: 'Full Stack Web Developer',
            knowsAbout: [
              'JavaScript', 'TypeScript', 'Vue.js', 'Nuxt.js',
              'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'AWS',
            ],
            knowsLanguage: ['es', 'en', 'fr'],
          },
          {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: 'Luis Ventura E',
            description: t('meta.description'),
            author: { '@id': `${BASE_URL}/#person` },
            inLanguage: locale.value,
          },
          {
            '@type': 'ProfilePage',
            '@id': `${BASE_URL}/#profilepage`,
            url: BASE_URL,
            name: t('meta.title'),
            about: { '@id': `${BASE_URL}/#person` },
            mainEntity: { '@id': `${BASE_URL}/#person` },
          },
        ],
      }),
    },
  ],
}))

useSeoMeta({
  title:          () => t('meta.title'),
  description:    () => t('meta.description'),
  ogTitle:        () => t('meta.title'),
  ogDescription:  () => t('meta.description'),
  ogType:         'website',
  ogSiteName:     'Luis Ventura E',
  ogUrl:          () => `${BASE_URL}${locale.value === 'es' ? '' : '/' + locale.value}`,
  ogLocale:       () => ogLocaleMap[locale.value] ?? 'es_ES',
  ogImage:        OG_IMAGE,
  ogImageWidth:   700,
  ogImageHeight:  700,
  ogImageType:    'image/webp',
  twitterCard:    'summary_large_image',
  twitterImage:   OG_IMAGE,
  author:         'Luis Miguel Ventura E',
  robots:         'index, follow',
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
