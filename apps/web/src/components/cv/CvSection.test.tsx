import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { mockMatchMedia } from '../../../vitest.setup'
import { es } from '../../i18n/es'
import { CvSection, type CvSectionProps } from './CvSection'

vi.mock('../contact/useTurnstile', () => ({
  useTurnstile: () => ({
    setContainer: () => undefined,
    token: 'captcha-token',
    reset: () => undefined,
  }),
}))

const props: CvSectionProps = {
  locale: 'es',
  api_url: 'https://api.example.com',
  turnstile_site_key: 'site-key',
  match_labels: es.cv_match,
  form_labels: {
    email: es.contact.email,
    company: es.contact.company,
    submit: es.contact.submit,
    sending: es.contact.sending,
    success: es.contact.success,
    check_inbox: es.contact.check_inbox,
    errors: es.contact.errors,
  },
}

const chip = (name: string): HTMLElement => screen.getByRole('button', { name })

describe('CvSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    mockMatchMedia()
  })

  it('toggles requirements with the keyboard and exposes the pressed state', async () => {
    render(<CvSection {...props} />)
    chip('Node.js').focus()
    await userEvent.keyboard(' ')
    expect(chip('Node.js')).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard(' ')
    expect(chip('Node.js')).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows evidence and an honest score for the selection', async () => {
    render(<CvSection {...props} />)
    expect(screen.getByText(es.cv_match.empty)).toBeInTheDocument()
    await userEvent.click(chip('AWS'))
    expect(screen.getByText(/AWS CDK en Prestamype/)).toBeInTheDocument()
    await userEvent.click(chip('Java'))
    expect(screen.getByText('75%')).toBeInTheDocument()
    await userEvent.click(chip('Presencial'))
    expect(screen.getByText(/Busco roles remotos o híbridos/)).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('celebrates a full match once with a light sweep on the meter', async () => {
    render(<CvSection {...props} />)
    await userEvent.click(chip('Node.js'))
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(document.querySelector('.meter-shine')).not.toBeNull()
    await userEvent.click(chip('Java'))
    expect(document.querySelector('.meter-shine')).toBeNull()
  })

  it('hides the percentage again when nothing is selected', async () => {
    render(<CvSection {...props} />)
    await userEvent.click(chip('AWS'))
    await userEvent.click(chip('AWS'))
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument()
    expect(screen.getByText(es.cv_match.empty)).toBeInTheDocument()
  })

  it('skips straight to the form and focuses the email field', async () => {
    render(<CvSection {...props} />)
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Saltar al formulario/ }))
    expect(await screen.findByLabelText('Email')).toHaveFocus()
  })

  it('offers the call to action after a selection and sends the interests', async () => {
    const fetcher = vi.fn(async (_url: string, _init?: RequestInit) =>
      Response.json({ status: 'sent' }),
    )
    vi.stubGlobal('fetch', fetcher)
    render(<CvSection {...props} />)
    expect(screen.queryByRole('button', { name: /Recibe el CV/ })).not.toBeInTheDocument()
    await userEvent.click(chip('Node.js'))
    await userEvent.click(chip('AWS'))
    await userEvent.click(screen.getByRole('button', { name: /Recibe el CV/ }))

    const form = (await screen.findByLabelText('Email')).closest('form')
    if (!form) throw new Error('form not found')
    await userEvent.type(within(form).getByLabelText('Email'), 'recruiter@company.com')
    await userEvent.type(within(form).getByLabelText('Empresa'), 'ACME')
    await userEvent.click(within(form).getByRole('button', { name: es.contact.submit }))

    expect(JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body))).toMatchObject({
      interests: ['nodejs', 'aws'],
    })
    await expect.poll(() => screen.queryByRole('button', { name: /Recibe el CV/ })).toBeNull()
  })
})
