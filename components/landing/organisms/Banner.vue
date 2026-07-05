<script setup lang="ts">
import Button from '~/components/landing/atoms/Button.vue'

const { t } = useI18n()
const bgRef = ref<HTMLElement | null>(null)

const goForm = (): void => {
  navigateTo('#dinamic-download')
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let rafId: number | null = null

  const onScroll = (): void => {
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      if (bgRef.value) {
        bgRef.value.style.transform = `translateY(${window.scrollY * 0.18}px)`
      }
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId !== null) cancelAnimationFrame(rafId)
  })
})
</script>

<template>
  <section id="home" class="banner_container">
    <div class="banner_container__bg">
      <div ref="bgRef" class="banner_container__bg__img" />
    </div>
    <div v-reveal class="banner_container__title">
      <h1>Luis</h1>
      <h1>Ventura</h1>
      <p>{{ t('banner.role') }}</p>
      <Button :label="t('banner.cta')" @click="goForm" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '~/global/_breakpoints.module.scss';

$img_banner: '/cloud/images/luis-ventura-e-min.webp';
$size_img: 700px;
$cover_color: rgba(5, 10, 13, 0.42);

.banner_container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &__bg {
    overflow: hidden;
    &__img {
      background-image: url($img_banner);
      height: $size_img;
      width: $size_img;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      position: relative;
      filter: opacity(0.5);
      will-change: transform;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        max-width: 100%;
        height: 50%;
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
    width: fit-content;
    text-align: center;
    padding: 12px 48px;
    font-size: 24px;
    background-color: $cover_color;
  }
}

@media (max-width: $BK_DESKTOP) {
  .banner_container {
    &__bg {
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

  .button_container {
    margin: 0 auto;
    padding: 10px 32px;
    font-size: 18px;
  }
}
</style>
