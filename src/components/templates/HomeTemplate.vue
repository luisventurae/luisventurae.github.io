<template>
  <Layout>
    <Header :data="page.menu" />
    <Banner />
    <Whois :data="page.whois" />
    <Front :data="page.skills.frontend" />
    <Back :data="page.skills.backend"  />
    <OtherSkills />
    <Achievements />
    <Footer />
  </Layout>
</template>

<script>
import Header from "@/components/organisms/shared/Header.vue"
import Footer from "@/components/organisms/shared/Footer.vue"
import Banner from "@/components/organisms/home/sections/Banner.vue"
import Whois from "@/components/organisms/home/sections/Whois.vue"
import Front from "@/components/organisms/home/sections/Front.vue"
import Back from "@/components/organisms/home/sections/Back.vue"
import OtherSkills from "@/components/organisms/home/sections/OtherSkills.vue"
import Achievements from "@/components/organisms/home/sections/Achievements.vue"

export default {
  name: "HomeTemplate",
  components: {
    Header,
    Footer,
    Banner,
    Whois,
    Front,
    Back,
    OtherSkills,
    Achievements,
  },
  props: {
    page: {
      type: Object,
      required: true,
    }
  },
  mounted() {
    /* console.log(page) */
  },
}
</script>
