type layoutValues = "dark-linear" | "solid"
type actionButtonValues = "redirect" | "simple"
type directionValues = "image-left" | "image-right"

interface CtaButton {
  label: string
  url: string
  action: actionButtonValues
  layout: layoutValues
}

interface Demoapp {
  key: string
  url: string
  description: string
  ctas: [CtaButton, CtaButton]
  direction: directionValues
}
