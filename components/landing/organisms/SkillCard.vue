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
        svg: "backend-servers.svg",
        deskPosition: "left",
        title: "Backend",
        description:
          "Desarrollo robusto para aplicaciones web y sistemas empresariales",
        skills: [
          {
            subtitle: "Lenguajes de Programación",
            subdescriptions: [
              { name: "JavaScript", stars: 10 },
              { name: "TypesScript", stars: 8.5 },
              { name: "PHP", stars: 3 },
              { name: "Java", stars: 4 },
              { name: "Solidity", stars: 1 },
            ],
          },
          {
            subtitle: "Frameworks y librerías",
            subdescriptions: [
              { name: "NodeJs", stars: 9 },
              { name: "NestJs", stars: 7 },
              { name: "ExpressJs", stars: 7 },
              { name: "AdonisJs", stars: 8 },
              { name: "Mongoose", stars: 9 },
              { name: "Spring Boot", stars: 1 },
            ],
          },
          {
            subtitle: "Bases de Datos",
            subdescriptions: [
              { name: "MongoDB", stars: 4 },
              { name: "MySQL", stars: 4 },
              { name: "PostgreSQL", stars: 4 },
              { name: "SQL Server", stars: 4 },
            ],
          },
          {
            subtitle: "Servidores y Clouding",
            subdescriptions: [
              { name: "Linux", stars: 4 },
              { name: "CPanel", stars: 5 },
              { name: "AWS", stars: 3 },
              { name: "Heroku", stars: 4 },
              { name: "Vercel", stars: 6 },
              { name: "Cloudflare", stars: 4 },
            ],
          },
          {
            subtitle: "Tecnologías de comunicación",
            subdescriptions: [
              { name: "Sockets", stars: 8 },
              { name: "Redis", stars: 4 },
              { name: "Kafka", stars: 3 },
            ],
          },
        ],
      },
      {
        className: "pcard2",
        svg: "frontend.svg",
        deskPosition: "right",
        title: "Frontend",
        description:
          "Manejo de tecnologías de interfaz de usuario y maquetación fiel",
        skills: [
          {
            subtitle: "Frameworks de desarrollo",
            subdescriptions: [
              { name: "VueJs", stars: 6 },
              { name: "NuxtJs", stars: 4 },
              { name: "Vite", stars: 4 },
              { name: "Web Components", stars: 7 },
            ],
          },
          {
            subtitle: "Preprocesadores",
            subdescriptions: [
              { name: "Sass", stars: 9 },
              { name: "Scss", stars: 9 },
              { name: "Stylus", stars: 8 },
            ],
          },
          {
            subtitle: "Frameworks de diseño",
            subdescriptions: [{ name: "Antdv", stars: 5 }],
          },
          {
            subtitle: "Extras",
            subdescriptions: [
              { name: "SEO", stars: 7 },
              { name: "Diseño Responsivo", stars: 8 },
              { name: "PWA", stars: 8 },
            ],
          },
        ],
      },
      {
        className: "pcard3",
        svg: "tools.svg",
        deskPosition: "fill",
        title: "Otras Habilidades",
        description: "",
        skills: [
          {
            subtitle: "Herramientas de desarrollo",
            subdescriptions: [
              { name: "Git", stars: 9 },
              { name: "Docker", stars: 4 },
            ],
          },
          {
            subtitle: "Servicios para integración",
            subdescriptions: [
              { name: "WABA", stars: 8 },
              { name: "Zoho CRM", stars: 5 },
              { name: "Airtable API", stars: 6 },
              { name: "Twilio", stars: 5 },
              { name: "Authy", stars: 4 },
              { name: "ReCaptcha", stars: 6 },
            ],
          },
          {
            subtitle: "Metodología de desarrollo",
            subdescriptions: [{ name: "SCRUM", stars: 6 }],
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
      :svg="s_card.svg"
      :desk_position="s_card.deskPosition"
      :title="s_card.title"
      :description="s_card.description"
      :skills="s_card.skills"
    />
  </section>
</template>

<style lang="scss" scoped>
@import "~/global/_breakpoints.module.scss";

.skill-card {
  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "pcard1 pcard2"
      "pcard3 pcard3";
    gap: 8px 1px;
    max-width: 51em;
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

@media (max-width: $BK_DESKTOP) {
  .skill-card {
    &__container {
      grid-auto-columns: auto;
      grid-template-columns: 1fr;
      grid-template-rows: 3fr;
      grid-template-areas: inherit;
      width: 80%;
    }
  }
  .pcard1,
  .pcard2,
  .pcard3 {
    grid-area: inherit;
    border-radius: 24px !important;
  }
}
</style>
