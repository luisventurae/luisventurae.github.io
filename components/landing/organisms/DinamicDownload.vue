<script lang="ts">
import { defineComponent } from "vue"
import Button from "~/components/landing/atoms/Button.vue"
import FormContact from "~/components/landing/molecules/FormContact.vue"
import DinamicBg from "~/components/landing/molecules/DinamicBg.vue"

export default defineComponent({
  name: "DinamicComponent",
  components: { Button, FormContact, DinamicBg },
  data: () => ({
    // TODO
    content: <DinamicDownload>{
      button: { label: "Descargar CV" },
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
      trees: [
        {
          key: "abc",
          date: new Date(),
          company: "Instituto Cepeban",
          order: 1,
          self: false,
        },
        {
          key: "abcd",
          date: new Date(),
          company: "Pool Work",
          order: 2,
          self: false,
        },
        {
          key: "abcf",
          date: new Date(),
          company: "Securitec",
          order: 3,
          self: false,
        },
        // {
        //   key: "abcg",
        //   date: new Date(),
        //   company: "Beex",
        //   order: 4,
        // },
        // {
        //   key: "abch",
        //   date: new Date(),
        //   company: "Busconsulting",
        //   order: 5,
        //   self: false,
        // },
      ],
    },
  }),
  setup() {
    const visibles = reactive({ form: false })
    function downloadURI(uri: string, name: string) {
      var link = document.createElement("a")
      link.setAttribute("download", name)
      link.href = uri
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
    const toggleVForm = (): void => {
      //  TODO
      // visibles.form = !visibles.form
      downloadURI("/resources/CV_Luis_Ventura_es.pdf", "CV_Luis_Ventura_spanish")
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
  <section id="dinamic-download" class="dinamic-download__container">
    <div class="dinamic-download__content">
      <div class="dinamic-download__content__screen" v-show="!visibles.form">
        <Button :label="content.button.label" @click="toggleVForm" />
      </div>
      <div class="dinamic-download__content__form" v-show="visibles.form">
        <FormContact
          :title="content.form.title"
          :text-button="content.form.textButton"
          :placeholders="content.form.placeholders"
          @eDataform="submitData"
        />
      </div>
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
    &__background {
      height: 190px;
    }
  }
}
</style>
