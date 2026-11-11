import type { Locale, VacancyRequirementId } from '@portfolio/shared'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactElement } from 'react'

import { ContactForm, type ContactFormProps } from '../contact/ContactForm'
import { VacancyMatch, type VacancyMatchLabels } from './VacancyMatch'

export interface CvSectionProps {
  locale: Locale
  api_url: string
  turnstile_site_key: string
  match_labels: VacancyMatchLabels
  form_labels: ContactFormProps['labels']
}

/** The vacancy match game leads to the CV form; either path ends in the same request. */
export function CvSection(props: CvSectionProps): ReactElement {
  const [selected, setSelected] = useState<VacancyRequirementId[]>([])
  const [is_form_open, setFormOpen] = useState(false)
  const form_ref = useRef<HTMLDivElement>(null)
  const reduce_motion = useReducedMotion() ?? false

  useEffect(() => {
    if (!is_form_open) return
    // Focusing also scrolls the field into view.
    form_ref.current?.querySelector<HTMLInputElement>('input')?.focus()
  }, [is_form_open])

  const toggle = (id: VacancyRequirementId): void =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  return (
    <div className="grid gap-8">
      <VacancyMatch
        selected={selected}
        labels={props.match_labels}
        onToggle={toggle}
        onContinue={() => setFormOpen(true)}
        is_form_open={is_form_open}
      />
      <AnimatePresence initial={false}>
        {is_form_open && (
          <motion.div
            ref={form_ref}
            id="cv-form"
            initial={{ opacity: 0, y: reduce_motion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <ContactForm
              locale={props.locale}
              api_url={props.api_url}
              turnstile_site_key={props.turnstile_site_key}
              labels={props.form_labels}
              interests={selected}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
