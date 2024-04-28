enum deskPositionEnum {
  left = "left",
  right = "right",
  fill = "fill",
}

interface SkillCard {
  className: string
  svg: string
  deskPosition: deskPositionEnum
  title: string
  description: string
  skills: SkillPropMolecule[]
}
