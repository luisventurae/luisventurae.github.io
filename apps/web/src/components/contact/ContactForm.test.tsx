import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockMatchMedia } from '../../../vitest.setup'
import { ContactForm, type ContactFormProps } from './ContactForm'

const captcha = vi.hoisted(() => ({ token: 'captcha-token' as string | null }))

vi.mock('./useTurnstile', () => ({
  useTurnstile: () => ({
    setContainer: () => undefined,
    token: captcha.token,
    reset: () => undefined,
  }),
}))

const props: ContactFormProps = {
  locale: 'es',
  api_url: 'https://api.example.com',
  turnstile_site_key: 'site-key',
  labels: {
    email: 'Email',
    company: 'Empresa',
    submit: 'Enviarme el CV',
    sending: 'Enviando…',
    success: '¡Enviado!',
    check_inbox: 'Revisa {email}: el enlace vence en 7 días.',
    errors: {
      invalid_request: 'Revisa los datos.',
      captcha_failed: 'Captcha inválido.',
      rate_limited: 'Demasiados intentos.',
      payload_too_large: 'Muy grande.',
      invalid_token: 'Expiró.',
      not_found: 'No encontrado.',
      internal_error: 'Error interno.',
      email_failed: 'No pudimos enviar el correo.',
      network: 'Sin conexión.',
      captcha_missing: 'Completa el captcha.',
    },
  },
}

async function fillAndSubmit(): Promise<void> {
  await userEvent.type(screen.getByLabelText('Email'), 'recruiter@company.com')
  await userEvent.type(screen.getByLabelText('Empresa'), 'ACME')
  await userEvent.click(screen.getByRole('button', { name: 'Enviarme el CV' }))
}

describe('ContactForm', () => {
  beforeEach(() => {
    captcha.token = 'captcha-token'
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    mockMatchMedia()
  })

  it('requests the CV and asks to check the inbox', async () => {
    const fetcher = vi.fn(async (_url: string, _init?: RequestInit) =>
      Response.json({ status: 'sent' }),
    )
    vi.stubGlobal('fetch', fetcher)
    render(<ContactForm {...props} />)
    await fillAndSubmit()

    expect(JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body))).toEqual({
      email: 'recruiter@company.com',
      company: 'ACME',
      locale: 'es',
      captcha_token: 'captcha-token',
    })
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Revisa recruiter@company.com: el enlace vence en 7 días.',
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('sends the selected interests with the request', async () => {
    const fetcher = vi.fn(async (_url: string, _init?: RequestInit) =>
      Response.json({ status: 'sent' }),
    )
    vi.stubGlobal('fetch', fetcher)
    render(<ContactForm {...props} interests={['nodejs', 'aws']} />)
    await fillAndSubmit()
    expect(JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body))).toMatchObject({
      interests: ['nodejs', 'aws'],
    })
  })

  it('explains when the email could not be sent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ error: { code: 'email_failed' } }, { status: 502 })),
    )
    render(<ContactForm {...props} />)
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos enviar el correo.')
  })

  it('shows the localized API error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ error: { code: 'rate_limited' } }, { status: 429 })),
    )
    render(<ContactForm {...props} />)
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent('Demasiados intentos.')
  })

  it('asks to complete the captcha first', async () => {
    captcha.token = null
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    render(<ContactForm {...props} />)
    await fillAndSubmit()
    expect(screen.getByRole('alert')).toHaveTextContent('Completa el captcha.')
    expect(fetcher).not.toHaveBeenCalled()
  })
})
