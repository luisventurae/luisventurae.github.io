<script setup lang="ts">
import Button from "~/components/landing/atoms/Button.vue"

interface paramEmitForm {
  input_values: string[]
  captcha_resolved: string
}
const emits = defineEmits<{
  (e: "eDataform", dataform: paramEmitForm): void
}>()

interface Prop {
  title: string
  textButton: string
  placeholders: [PlaceholderForm, PlaceholderForm]
}
const props = defineProps<Prop>()
const KEY_TURNSTILE: string = <string>process.env.KEY_TURNSTILE

const emitSubmit = () => {
  console.log("emitSubmit")
}
const formValues = reactive({
  fields: props.placeholders.map(() => ({
    value: <string>"",
  })),
})

const captchaToken = ref("")
const submitForm = () => {
  console.log("submitForm", formValues)
  console.log("submitForm", formValues.fields)
  console.log(
    "submitForm",
    formValues.fields.map((el) => el.value)
  )
  const cpatchatValue: string = <string>captchaToken._value.childNodes[1].value
  emits("eDataform", {
    input_values: formValues.fields.map((el) => el.value),
    captcha_resolved: cpatchatValue,
  })
}
</script>

<template>
  <form @submit.prevent="emitSubmit" class="form-contact__container">
    <div class="form-contact__content">
      <p class="title">{{ props.title }}</p>
      <div class="textsfields">
        <input
          :type="props.placeholders[0].type_text"
          :id="props.placeholders[0].id"
          :placeholder="props.placeholders[0].text"
          v-model="formValues.fields[0].value"
        />
        <input
          :type="props.placeholders[1].type_text"
          :id="props.placeholders[1].id"
          :placeholder="props.placeholders[1].text"
          v-model="formValues.fields[1].value"
        />
      </div>
      <div
        ref="captchaToken"
        class="cf-turnstile"
        :data-sitekey="KEY_TURNSTILE"
        data-callback="javascriptCallback"
      ></div>
      <Button :label="props.textButton" @click="submitForm" />
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
    > *,
    .textsfields > * {
      display: block;
    }
    input {
      padding: 8px 24px;
      border-radius: 8px;
      font-family: Aldrich;
      text-align: center;
      outline: none;
      margin: 12px auto;
      font-size: 16px;
      width: 300px;
      &::placeholder {
        color: $placeholder_color;
      }
      // &:last-child {
      //   margin-bottom: 30px;
      // }
    }
    .cf-turnstile {
      margin-top: 30px;
      margin-bottom: 12px;
    }
    .button_container {
      margin: 0 auto;
      width: 300px;
      padding: 8px 24px;
    }
  }
}
</style>
