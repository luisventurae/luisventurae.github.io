<script setup lang="ts">
import Button from "~/components/landing/atoms/Button.vue"

interface Prop {
  title: string
  textButton: string
  placeholders: [PlaceholderForm, PlaceholderForm]
}
const props = defineProps<Prop>()
</script>

<template>
  <form class="form-contact__container">
    <div class="form-contact__content">
      <p class="title">{{ props.title }}</p>
      <input
        :type="placeholders[0].type_text"
        :id="placeholders[0].id"
        :placeholder="placeholders[0].text"
      />
      <input
        :type="placeholders[1].type_text"
        :id="placeholders[1].id"
        :placeholder="placeholders[1].text"
      />
      <div class="captcha">CAPTCHA</div>
      <Button :label="props.textButton" />
    </div>
  </form>
</template>

<style lang="scss" scoped>
$placeholder_color: #cdcdcd;

.form-contact {
  &__container {
  }
  &__content {
    margin: 0 auto;
    text-align: center;
    > * {
      display: block;
    }
    input {
      padding: 8px 24px;
      border-radius: 8px;
      font-family: Aldrich;
      text-align: center;
      outline: none;
      margin: 0 auto;
      font-size: 16px;
      &::placeholder {
        color: $placeholder_color;
      }
    }
    .button_container {
      margin: 0 auto;
    }
  }
}
</style>
