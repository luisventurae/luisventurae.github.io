<script lang="ts">
import { defineComponent } from "vue"
import Button from "~/components/landing/atoms/Button.vue"
import FormContact from "~/components/landing/molecules/FormContact.vue"

export default defineComponent({
  name: "DinamicComponent",
  components: { Button, FormContact },
  data: () => ({
    content: <DinamicDownload>{
      button: { label: "Obtener CV" },
      form: {
        title: "Mi CV se enviará a su email",
        textButton: "Enviar CV",
        placeholders: [
          {
            id: "email",
            text: "E-mail*",
            type_text: "email",
          },
          {
            id: "company",
            text: "Empresa*",
            type_text: "text",
          },
        ],
      },
    },
  }),
  setup() {
    const visibles = reactive({ form: false })
    const toggleVForm = (): void => {
      visibles.form = !visibles.form
    }
    interface paramEmitForm {
      input_values: string[]
      captcha_resolved: string
    }
    const submitData = (values: paramEmitForm) => {
      console.log("submitData, submitData", values)
    }
    return { visibles, toggleVForm, submitData }
  },
})
</script>

<template>
  <section class="dinamic-component__container">
    <div class="dinamic-component__content">
      <div class="dinamic-component__content__screen" v-show="!visibles.form">
        <Button :label="content.button.label" @click="toggleVForm" />
      </div>
      <div class="dinamic-component__content__form" v-show="visibles.form">
        <FormContact
          :title="content.form.title"
          :text-button="content.form.textButton"
          :placeholders="content.form.placeholders"
          @eDataform="submitData"
        />
      </div>
      <div class="dinamic-component__content__background">. . . . . . .</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.dinamic-component {
  &__content {
    transition: 0.5s;
    &__screen {
      transition: 0.5s;
      margin: 170px auto;
      .button_container {
        margin: 0 auto;
        padding: 12px 64px;
      }
    }
    &__form {
      transition: 0.5s;
      margin: 64px auto;
    }
  }
}
</style>
