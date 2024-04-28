<script setup lang="ts">
import TinyTag from "~/components/landing/atoms/TinyTag.vue"
import FSButton from "~/components/landing/atoms/FSButton.vue"

const emit = defineEmits<{
  (e: "open", cardSelected: ExperiencePropMolecule): void
}>()

interface Prop {
  order: number
  image_url: string
  title: string
  company: string
  description: string
  tags: string[]
}

// const props = defineProps<ExperiencePropMolecule>()
const props = defineProps<Prop>()
const order: number = props.order
const image_url: string = props.image_url
const title: string = props.title
const company: string = props.company
const description: string = props.description
const tags: string[] = props.tags
</script>

<template>
  <div class="image-card__container">
    <div class="image-card__content">
      <div class="expcard__head">
        <p>{{ order }}</p>
      </div>
      <picture class="expcard__image">
        <img :src="image_url" alt="Foto" />
      </picture>
      <div class="expcard__body">
        <h3 class="expcard__body__title">{{ title }}</h3>
        <p class="expcard__body__subtitle">{{ company }}</p>
        <p class="expcard__body__text">{{ description }}</p>
        <div class="expcard__body__tags">
          <TinyTag v-for="tag in tags" :text="tag" />
        </div>
      </div>
    </div>
    <div class="image-card__foot">
      <FSButton @open="emit('open', props)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module.scss";
$size_card: 300px;

.image-card {
  &__container {
    position: relative;
    background-color: $SECONDARY_DARK;
    border-radius: $RADIUS_CARD;
    padding: 24px 24px 36px 24px;
    width: $size_card;
    transition: 0.2s;
    &:hover {
      box-shadow: 0px 0px 4px 1px $MAIN_COLOR;
    }
  }
  &__content {
    .expcard {
      &__head {
        p {
          margin: 0 0 8px 0;
        }
      }
      &__image {
        img {
          width: -webkit-fill-available;
          height: 200px;
          object-fit: cover;
          object-position: center;
        }
      }
      &__body {
        text-align: center;
        &__title {
          margin: 0;
        }
        &__subtitle {
          margin: 0;
          font-size: 16px;
        }
        &__tags {
          text-align: left;
        }
      }
    }
  }
  &__foot {
    position: absolute;
    bottom: -20px;
  }
}
</style>
