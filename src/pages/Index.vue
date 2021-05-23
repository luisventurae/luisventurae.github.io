<template>
  <Layout>
    <HomeTemplate />
  </Layout>
</template>

<script>
import HomeTemplate from '@/components/templates/HomeTemplate.vue'

export default {
  metaInfo: {
    title: 'Hello, world!'
  },
  components: {
    HomeTemplate,
  },
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
