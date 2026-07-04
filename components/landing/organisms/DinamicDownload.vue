<script setup lang="ts">
import Button from '~/components/landing/atoms/Button.vue'
import FormContact from '~/components/landing/molecules/FormContact.vue'
import DinamicBg from '~/components/landing/molecules/DinamicBg.vue'

interface FormEmitData {
  input_values: [string, string]
  captcha_resolved: string
}

const content: DinamicDownload = {
  button: { label: 'Enviar CV a mi email' },
  form: {
    title: 'Mi CV se enviará a tu email',
    textButton: 'Enviar CV',
    placeholders: [
      { id: 'email', text: 'E-mail*', type_text: 'email' },
      { id: 'company', text: 'Empresa*', type_text: 'text' },
    ],
  },
  trees: [
    { key: 'abc',  date: new Date(), company: 'Instituto Cepeban', order: 1, self: false },
    { key: 'abcd', date: new Date(), company: 'Pool Work',         order: 2, self: false },
    { key: 'abcf', date: new Date(), company: 'Securitec',         order: 3, self: true  },
  ],
}

const visibles = reactive({ form: false })
const { status, errorMessage, submit, reset } = useContactForm()

const downloadCV = (): void => {
  const link = document.createElement('a')
  link.setAttribute('download', 'CV_Luis_Ventura_spanish')
  link.href = '/resources/CV_Luis_Ventura_es.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const toggleForm = (): void => {
  reset()
  visibles.form = !visibles.form
}

const submitData = async (values: FormEmitData): Promise<void> => {
  await submit({
    email: values.input_values[0],
    company: values.input_values[1],
    captchaToken: values.captcha_resolved,
  })

  if (status.value === 'success') {
    downloadCV()
  }
}
</script>

<template>
  <section id="dinamic-download" class="dinamic-download__container">
    <div class="dinamic-download__content">

      <div v-if="status === 'success'" class="dinamic-download__content__success">
        <p>¡Gracias! Tu CV se está descargando.</p>
        <Button label="Volver" @click="toggleForm" />
      </div>

      <template v-else>
        <div class="dinamic-download__content__screen" v-show="!visibles.form">
          <Button :label="content.button.label" @click="toggleForm" />
          <p class="dinamic-download__content__screen__alt">
            o <a href="/resources/CV_Luis_Ventura_es.pdf" download="CV_Luis_Ventura_spanish">descarga directamente</a>
          </p>
        </div>

        <div class="dinamic-download__content__form" v-show="visibles.form">
          <FormContact
            :title="content.form.title"
            :text-button="content.form.textButton"
            :placeholders="content.form.placeholders"
            @eDataform="submitData"
          />
          <p v-if="status === 'error'" class="dinamic-download__content__error">
            {{ errorMessage }}
          </p>
          <p v-if="status === 'loading'" class="dinamic-download__content__loading">
            Enviando...
          </p>
          <button class="dinamic-download__content__back" @click="toggleForm">
            &larr; Volver
          </button>
        </div>
      </template>

      <div class="dinamic-download__content__background">
        <DinamicBg :trees="content.trees" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.dinamic-download {
  &__content {
    transition: 0.5s;

    &__screen {
      transition: 0.5s;
      margin: 140px auto 24px;
      text-align: center;

      .button_container {
        margin: 0 auto;
        padding: 12px 64px;
      }

      &__alt {
        margin-top: 16px;
        font-size: 14px;
        opacity: 0.7;

        a {
          color: var(--color-accent);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    &__form {
      transition: 0.5s;
      margin: 64px auto;
      text-align: center;
    }

    &__success {
      margin: 140px auto 24px;
      text-align: center;

      .button_container {
        margin: 16px auto 0;
        padding: 8px 32px;
      }
    }

    &__error {
      color: #ff6b6b;
      font-size: 14px;
      margin-top: 12px;
    }

    &__loading {
      opacity: 0.7;
      font-size: 14px;
      margin-top: 12px;
    }

    &__back {
      background: transparent;
      border: none;
      color: var(--color-fg);
      cursor: pointer;
      font-size: 14px;
      margin-top: 16px;
      opacity: 0.6;
      font-family: Aldrich, sans-serif;

      &:hover {
        opacity: 1;
      }
    }

    &__background {
      height: 190px;
    }
  }
}
</style>
