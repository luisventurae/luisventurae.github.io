<script setup lang="ts">
import TinyTag from '~/components/landing/atoms/TinyTag.vue'
import FSButton from '~/components/landing/atoms/FSButton.vue'

const emit = defineEmits<{ (e: 'open'): void }>()

interface Props {
  order: number
  image_url: string
  title: string
  company: string
  description: string
  tags: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="image-card__container" @click="emit('open')">
    <div class="image-card__content">
      <div class="expcard__head">
        <p>{{ props.order }}</p>
      </div>
      <picture class="expcard__image">
        <img
          :src="props.image_url"
          :alt="props.title"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div class="expcard__body">
        <h3 class="expcard__body__title">{{ props.title }}</h3>
        <p class="expcard__body__subtitle">{{ props.company }}</p>
        <p class="expcard__body__text">{{ props.description }}</p>
        <div class="expcard__body__tags">
          <TinyTag v-for="tag in props.tags" :key="tag" :text="tag" />
        </div>
      </div>
    </div>
    <div class="image-card__foot">
      <FSButton />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/global/_variables.module.scss';

$size_card: 300px;

.image-card {
  &__container {
    position: relative;
    background-color: $SECONDARY_DARK;
    border-radius: $RADIUS_CARD;
    padding: 24px 24px 36px 24px;
    width: $size_card;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35), 0 0 0 1px $MAIN_COLOR;
    }

    &:active {
      transform: translateY(-2px);
      transition-duration: 0.08s;
    }
  }

  &__content {
    .expcard {
      &__head {
        p { margin: 0 0 8px 0; }
      }

      &__image {
        img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          object-position: top;
          display: block;
          border-radius: 8px;
        }
      }

      &__body {
        text-align: center;

        &__title { margin: 8px 0 0; }
        &__subtitle { margin: 0; font-size: 16px; opacity: 0.7; }
        &__text { font-size: 13px; opacity: 0.75; line-height: 1.5; }
        &__tags { text-align: left; }
      }
    }
  }

  &__foot {
    position: absolute;
    bottom: -20px;
    right: 24px;
  }
}
</style>
