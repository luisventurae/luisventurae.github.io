<script lang="ts">
import { defineComponent } from "vue"
import PlainVerticalCard from "~/components/landing/molecules/PlainVerticalCard.vue"

export default defineComponent({
  name: "SkillCard",
  components: { PlainVerticalCard },
  data: () => ({
    skill_cards: <SkillCard[]>[
      {
        className: "pcard1",
        icon: "backend-servers.svg",
        deskPosition: "left",
        title: "Backend",
        description:
          "Desarrollo robusto para aplicaciones web y sistemas empresariales",
        skills: [
          {
            subtitle: "Lenguajes de Programación",
            subdescription: "JavaScript, TypesScript, PHP, Java, Solidity",
          },
          {
            subtitle: "Frameworks y librerías",
            subdescription:
              "NodeJs, NestJs, ExpressJs, AdonisJs, Mongoose, Spring Boot",
          },
          {
            subtitle: "Bases de Datos",
            subdescription: "MongoDB, MySQL, PostgreSQL, SQL Server",
          },
          {
            subtitle: "Servidores y Clouding",
            subdescription: "Linux, CPanel, AWS, Heroku, Vercel, Cloudflare",
          },
          {
            subtitle: "Tecnologías de comunicación",
            subdescription: "Sockets, Redis, Kafka",
          },
        ],
      },
      {
        className: "pcard2",
        icon: "frontend.svg",
        deskPosition: "right",
        title: "Frontend",
        description:
          "Manejo de tecnologías de interfaz de usuario y maquetación fiel",
        skills: [
          {
            subtitle: "Frameworks de desarrollo",
            subdescription: "VueJs, NuxtJs, Vite, Web Components",
          },
          {
            subtitle: "Preprocesadores",
            subdescription: "Sass, Scss, Stylus",
          },
          {
            subtitle: "Frameworks de diseño",
            subdescription: "Antdv",
          },
          {
            subtitle: "Extras",
            subdescription: "SEO, Diseño Responsivo, PWA",
          },
        ],
      },
      {
        className: "pcard3",
        icon: "tools.svg",
        deskPosition: "fill",
        title: "Otras Habilidades",
        description: "",
        skills: [
          {
            subtitle: "Herramientas de desarrollo",
            subdescription: "Git, Docker",
          },
          {
            subtitle: "Servicios para integración",
            subdescription:
              "WABA, Zoho CRM,  Airtable API, Twilio, Authy, ReCaptcha",
          },
          {
            subtitle: "Metodología de desarrollo",
            subdescription: "SCRUM",
          },
        ],
      },
    ],
  }),
})
</script>

<template>
  <section class="skill-card__container">
    <PlainVerticalCard
      v-for="s_card in skill_cards"
      :class="s_card.className"
      :icon="s_card.icon"
      :desk_position="s_card.deskPosition"
      :title="s_card.title"
      :description="s_card.description"
      :skills="s_card.skills"
    />
  </section>
</template>

<style lang="scss" scoped>
.skill-card {
  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "pcard1 pcard2"
      "pcard3 pcard3";
    gap: 8px 1px;
    width: 51em;
    padding: 24px;
  }
}
.pcard1 {
  grid-area: pcard1;
}

.pcard2 {
  grid-area: pcard2;
}

.pcard3 {
  grid-area: pcard3;
  height: fit-content;
}
</style>
