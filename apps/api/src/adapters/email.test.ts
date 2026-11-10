import { describe, expect, it, vi } from 'vitest'

import { buildRawEmail, createCloudflareEmailSender, createMailpitEmailSender } from './email'

const addresses = { from: 'portfolio@example.dev', to: 'owner@example.test' }
const message = { subject: 'CV solicitado por ACME', text: 'Hola' }

describe('buildRawEmail', () => {
  it('produces headers, an encoded subject and the body', () => {
    const raw = buildRawEmail(addresses, message, new Date(Date.UTC(2026, 0, 1)))
    expect(raw).toContain('From: Portfolio <portfolio@example.dev>')
    expect(raw).toContain('To: <owner@example.test>')
    expect(raw).toMatch(/Subject: =\?UTF-8\?B\?.+\?=/)
    expect(raw).toContain('Date: Thu, 01 Jan 2026 00:00:00 GMT')
    expect(raw.endsWith('\r\n\r\nHola')).toBe(true)
  })
})

describe('createCloudflareEmailSender', () => {
  it('sends the raw message through the binding', async () => {
    const send = vi.fn(async () => undefined)
    const createMessage = vi.fn((from: string, to: string, raw: string) => ({ from, to, raw }))
    await createCloudflareEmailSender({ send }, addresses, createMessage).notifyOwner(message)
    expect(createMessage).toHaveBeenCalledWith(
      addresses.from,
      addresses.to,
      expect.stringContaining('Hola'),
    )
    expect(send).toHaveBeenCalledOnce()
  })
})

describe('createMailpitEmailSender', () => {
  it('posts to the Mailpit send API', async () => {
    const fetcher = vi.fn(async () => new Response('{}')) as unknown as typeof fetch
    await createMailpitEmailSender('http://mailpit:8025/', addresses, fetcher).notifyOwner(message)
    const [url, init] = vi.mocked(fetcher).mock.calls[0] ?? []
    expect(url).toBe('http://mailpit:8025/api/v1/send')
    expect(JSON.parse(String(init?.body))).toMatchObject({
      Subject: message.subject,
      To: [{ Email: addresses.to }],
    })
  })

  it('throws when Mailpit fails', async () => {
    const fetcher = vi.fn(async () => new Response('', { status: 500 })) as unknown as typeof fetch
    await expect(
      createMailpitEmailSender('http://m', addresses, fetcher).notifyOwner(message),
    ).rejects.toThrow()
  })
})
