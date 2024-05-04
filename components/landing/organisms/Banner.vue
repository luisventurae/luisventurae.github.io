<script lang="ts">
import { defineComponent } from "vue"
import Button from "~/components/landing/atoms/Button.vue"

export default defineComponent({
  name: "BannerOrganism",
  components: { Button },
})
</script>

<template>
  <section class="banner_container">
    <div class="banner_container__bg">
      <div class="banner_container__bg__img"></div>
    </div>
    <div class="banner_container__title">
      <h1>Luis</h1>
      <h1>Ventura</h1>
      <p>Web Developer</p>
      <Button label="Obtener CV" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "~/global/_breakpoints.module.scss";
$img_banner: "/cloud/images/luis-ventura-e-min.webp";
$size_img: 700px;
$cover_color: #050a0d69;

.banner_container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  &__bg {
    &__img {
      background-image: url($img_banner);
      height: $size_img;
      width: $size_img;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
      filter: opacity(0.5);
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        max-width: 100%;
        height: 50%; /* Ajusta la altura del degradado */
        background-image: linear-gradient(to top, #050a0d, rgba(0, 0, 0, 0));
        z-index: 1;
      }
      @media (max-width: 1100px) {
        width: 500px;
      }
    }
  }
  &__title {
    margin: 48px 0 0 36px;
    h1 {
      margin: 0;
    }
    p {
      font-size: 28px;
    }
  }
  .button_container {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    font-size: 24px;
    background-color: $cover_color;
  }
}

@media (max-width: $BK_DESKTOP) {
  .banner_container {
    &__bg {
      // &__cover,
      &__img {
        height: 100vh;
        width: 97vw;
      }
    }
    &__title {
      position: absolute;
      margin: 0 auto;
      margin-top: 7rem;
      text-align: center;
    }
  }
}
</style>
