enum typeTextfieldEnum {
  text,
  email,
  number,
  phone,
}

interface PlaceholderForm {
  id?: string
  text: string
  type_text?: keyof typeof typeTextfieldEnum
}

interface DinamicDownload {
  button: { label: string }
  form: {
    title: string
    textButton: string
    placeholders: [PlaceholderForm, PlaceholderForm]
  }
  trees: DataTree[]
}
