<script setup lang="ts">
import Button from "~/components/landing/atoms/Button.vue"
import externalLinkIcon from "~/assets/icons/external-link.svg"

const props = defineProps<{ app: Demoapp }>()
const REVERSE = "image-right"

const openLink = (action: actionButtonValues, url: string): void => {
  switch (action) {
    case "simple": {
      navigateTo(url, {
        external: true,
      })
      break
    }
    case "redirect": {
      navigateTo(url, {
        external: true,
        open: {
          target: "_blank",
        },
      })
      break
    }
  }
}
</script>

<template>
  <div class="band-card__container">
    <div
      class="band-card__content"
      :class="{ reverse: props.app.direction === REVERSE }"
    >
      <picture class="band-card__content__picture">
        <img :src="props.app.url" alt="" />
      </picture>
      <div class="band-card__content__description">
        <p>{{ props.app.description }}</p>
      </div>
      <div class="band-card__content__buttons">
        <Button
          v-for="cta in props.app.ctas"
          :label="cta.label"
          :layout="cta.layout"
          @click="openLink(cta.action, cta.url)"
        >
          <template #right>
            <externalLinkIcon :class="cta.layout" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module";

$width_box_buttons: 230px;

@mixin flex-position($position) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: $position;
}

.band-card {
  &__container {
    background-color: $SECONDARY_DARK;
    margin: 12px auto;
    padding: 48px 36px;
    border-radius: $RADIUS_CARD;
  }
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr $width_box_buttons;
    grid-auto-flow: dense;
    &.reverse {
      direction: rtl;
      .band-card__content__buttons {
        @include flex-position(flex-end);
      }
    }
    &__picture {
      display: flex;
      align-items: center;
      justify-content: end;
      img {
        width: 290px;
        height: 180px;
        object-fit: cover;
        object-position: center;
        border: 3px solid white;
      }
    }
    &__description {
      text-align: left;
      padding: 0px 24px;
    }
    &__buttons {
      direction: ltr;
      @include flex-position(flex-start);
      .button_container {
        margin: 6px 0;
      }
      svg {
        color: transparent;
        &.solid > * {
          stroke: $SECONDARY_DARK;
        }
      }
    }
  }
}
</style>
