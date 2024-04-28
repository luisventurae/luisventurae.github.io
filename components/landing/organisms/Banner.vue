<script lang="ts">
import { defineComponent } from "vue"
import Button from "~/components/landing/atoms/Button.vue"

export default defineComponent({
  name: "BannerOrganism",
  setup() {},
  components: { Button },
})
</script>

<template>
  <section class="banner_container">
    <div class="banner_container__bg">
      <div class="banner_container__bg__cover"></div>
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

.banner_container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  &__bg {
    &__cover {
      background-color: #050a0d69;
      height: $size_img;
      width: $size_img;
      position: absolute;
    }
    &__img {
      background-image: url($img_banner);
      height: $size_img;
      width: $size_img;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
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
    background-color: #050a0d69;
  }
}

@media (max-width: $BK_DESKTOP) {
  .banner_container {
    &__bg {
      &__cover,
      &__img {
        height: 100vh;
        width: 100vw;
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
