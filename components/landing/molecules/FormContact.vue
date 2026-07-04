<script setup lang="ts">
import Button from '~/components/landing/atoms/Button.vue'

interface EmitDataform {
  input_values: [string, string]
  captcha_resolved: string
}

const emits = defineEmits<{
  (e: 'eDataform', dataform: EmitDataform): void
}>()

interface Prop {
  title: string
  textButton: string
  placeholders: [PlaceholderForm, PlaceholderForm]
}

const props = defineProps<Prop>()
const config = useRuntimeConfig()
const turnstileSiteKey = computed<string>(() => config.public.turnstileSiteKey as string)

const fieldValues = reactive<[{ value: string }, { value: string }]>([
  { value: '' },
  { value: '' },
])

const captchaToken = ref<string>('')

onMounted(() => {
  // Register the global callback that Cloudflare Turnstile calls when resolved
  window.javascriptCallback = (token: string): void => {
    captchaToken.value = token
  }
  // Reset token when captcha expires
  window.onTurnstileExpired = (): void => {
    captchaToken.value = ''
  }
})

const submitForm = (): void => {
  emits('eDataform', {
    input_values: [fieldValues[0].value, fieldValues[1].value],
    captcha_resolved: captchaToken.value,
  })
}
</script>

<template>
  <form @submit.prevent="submitForm" class="form-contact__container">
    <div class="form-contact__content">
      <p class="title">{{ props.title }}</p>
      <div class="textsfields">
        <input
          :type="props.placeholders[0].type_text"
          :id="props.placeholders[0].id"
          :placeholder="props.placeholders[0].text"
          v-model="fieldValues[0].value"
          autocomplete="email"
        />
        <input
          :type="props.placeholders[1].type_text"
          :id="props.placeholders[1].id"
          :placeholder="props.placeholders[1].text"
          v-model="fieldValues[1].value"
          autocomplete="organization"
        />
      </div>
      <div
        class="cf-turnstile"
        :data-sitekey="turnstileSiteKey"
        data-callback="javascriptCallback"
        data-expired-callback="onTurnstileExpired"
      />
      <Button :label="props.textButton" @click="submitForm" />
    </div>
  </form>
</template>

<style lang="scss" scoped>
$placeholder_color: #cdcdcd;

.form-contact {
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
      font-family: Aldrich, sans-serif;
      text-align: center;
      outline: none;
      margin: 12px auto;
      font-size: 16px;
      width: 300px;
      background-color: var(--color-card-bg);
      color: var(--color-fg);
      border: 1px solid var(--color-border);

      &::placeholder {
        color: $placeholder_color;
      }
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
