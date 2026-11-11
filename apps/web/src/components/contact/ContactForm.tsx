import type { Locale, VacancyRequirementId } from '@portfolio/shared'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type ReactElement, type SubmitEvent } from 'react'
import { toast, Toaster } from 'sonner'

import { requestCv, type ClientErrorCode } from '../../lib/api-client'
import { useTurnstile } from './useTurnstile'

interface ContactFormLabels {
  email: string
  company: string
  submit: string
  sending: string
  success: string
  /** Shown after sending; `{email}` is replaced with the address the CV went to. */
  check_inbox: string
  errors: Record<ClientErrorCode | 'captcha_missing', string>
}

export interface ContactFormProps {
  locale: Locale
  api_url: string
  turnstile_site_key: string
  labels: ContactFormLabels
  /** Requirements picked in the vacancy match, sent along for the owner notification. */
  interests?: VacancyRequirementId[]
}

type Status = 'idle' | 'sending' | 'success'

export function ContactForm({
  locale,
  api_url,
  turnstile_site_key,
  labels,
  interests,
}: ContactFormProps): ReactElement {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [sent_to, setSentTo] = useState<string | null>(null)
  const {
    setContainer: setTurnstileContainer,
    token: captcha_token,
    reset: resetCaptcha,
  } = useTurnstile(turnstile_site_key, 'auto')
  const email_id = useId()
  const company_id = useId()
  const error_id = useId()

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (status === 'sending') return
    if (!captcha_token) {
      setError(labels.errors.captcha_missing)
      return
    }
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    setStatus('sending')
    setError(null)
    const result = await requestCv(api_url, {
      email,
      company: String(form.get('company') ?? '').trim(),
      locale,
      captcha_token,
      ...(interests && interests.length > 0 ? { interests } : {}),
    })
    resetCaptcha()
    if (!result.ok) {
      setStatus('idle')
      setError(labels.errors[result.code])
      toast.error(labels.errors[result.code])
      return
    }
    setStatus('success')
    setSentTo(email)
    toast.success(labels.success)
  }

  return (
    <>
      <form
        onSubmit={(event) => void handleSubmit(event)}
        noValidate={false}
        aria-describedby={error ? error_id : undefined}
        className="grid max-w-xl gap-5 rounded-lg border border-line bg-paper-raised p-6 shadow-card md:p-8"
      >
        <Field id={email_id} name="email" type="email" label={labels.email} autoComplete="email" />
        <Field
          id={company_id}
          name="company"
          type="text"
          label={labels.company}
          autoComplete="organization"
        />
        <div ref={setTurnstileContainer} className="min-h-[65px]" />

        <p
          id={error_id}
          role="alert"
          className="min-h-[1.5em] text-small font-medium text-accent-ink"
        >
          {error}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton status={status} labels={labels} />
        </div>
        <p role="status" className="min-h-[1.5em] text-small text-ink-muted">
          {sent_to && labels.check_inbox.replace('{email}', sent_to)}
        </p>
      </form>
      <Toaster
        position="bottom-center"
        theme="system"
        richColors
        toastOptions={{ className: 'font-sans' }}
      />
    </>
  )
}

interface FieldProps {
  id: string
  name: string
  type: 'email' | 'text'
  label: string
  autoComplete: string
}

function Field({ id, name, type, label, autoComplete }: FieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        maxLength={type === 'email' ? 254 : 120}
        autoComplete={autoComplete}
        className="rounded-md border border-line bg-paper px-4 py-3 text-base transition-[border-color] duration-150 outline-none focus-visible:border-accent"
      />
    </div>
  )
}

function SubmitButton({
  status,
  labels,
}: {
  status: Status
  labels: ContactFormLabels
}): ReactElement {
  const text =
    status === 'sending'
      ? labels.sending
      : status === 'success'
        ? `✓ ${labels.success}`
        : labels.submit

  return (
    <motion.button
      layout
      type="submit"
      disabled={status === 'sending'}
      aria-busy={status === 'sending'}
      transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
      className="pressable overflow-hidden rounded-md bg-accent px-6 py-3 font-semibold text-on-accent shadow-card disabled:cursor-progress"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          className="block whitespace-nowrap"
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
