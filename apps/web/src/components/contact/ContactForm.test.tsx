import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockMatchMedia } from '../../../vitest.setup'
import { startDownload } from '../../lib/download'
import { ContactForm, type ContactFormProps } from './ContactForm'

const captcha = vi.hoisted(() => ({ token: 'captcha-token' as string | null }))

vi.mock('./useTurnstile', () => ({
  useTurnstile: () => ({
    setContainer: () => undefined,
    token: captcha.token,
    reset: () => undefined,
  }),
}))
vi.mock('../../lib/download', () => ({ startDownload: vi.fn() }))

const props: ContactFormProps = {
  locale: 'es',
  api_url: 'https://api.example.com',
  turnstile_site_key: 'site-key',
  labels: {
    email: 'Email',
    company: 'Empresa',
    submit: 'Obtener CV',
    sending: 'Verificando…',
    success: '¡Listo!',
    download_again: 'Descargar de nuevo',
    errors: {
      invalid_request: 'Revisa los datos.',
      captcha_failed: 'Captcha inválido.',
      rate_limited: 'Demasiados intentos.',
      payload_too_large: 'Muy grande.',
      invalid_token: 'Expiró.',
      not_found: 'No encontrado.',
      internal_error: 'Error interno.',
      network: 'Sin conexión.',
      captcha_missing: 'Completa el captcha.',
    },
  },
}

async function fillAndSubmit(): Promise<void> {
  await userEvent.type(screen.getByLabelText('Email'), 'recruiter@company.com')
  await userEvent.type(screen.getByLabelText('Empresa'), 'ACME')
  await userEvent.click(screen.getByRole('button', { name: 'Obtener CV' }))
}

describe('ContactForm', () => {
  beforeEach(() => {
    captcha.token = 'captcha-token'
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    mockMatchMedia()
    vi.mocked(startDownload).mockClear()
  })

  it('requests the CV and starts the download', async () => {
    const fetcher = vi.fn(async (_url: string, _init?: RequestInit) =>
      Response.json({
        download_url: 'https://api.example.com/cv/abc',
        expires_at: '2026-11-10T10:00:00.000Z',
      }),
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
    expect(startDownload).toHaveBeenCalledWith('https://api.example.com/cv/abc')
    expect(await screen.findByRole('link', { name: 'Descargar de nuevo' })).toHaveAttribute(
      'href',
      'https://api.example.com/cv/abc',
    )
  })

  it('shows the localized API error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ error: { code: 'rate_limited' } }, { status: 429 })),
    )
    render(<ContactForm {...props} />)
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent('Demasiados intentos.')
    expect(startDownload).not.toHaveBeenCalled()
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
