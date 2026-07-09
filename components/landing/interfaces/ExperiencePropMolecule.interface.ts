interface ExperiencePropMolecule {
  order: number
  image_url: string
  title: string
  company: string
  description: string
  tags: string[]
  date?: string    // ISO month string "YYYY-MM"
  url?: string
  techs?: string[]
}
