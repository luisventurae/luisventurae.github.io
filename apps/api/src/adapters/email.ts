import type { EmailMessageInput, EmailSender } from '../core/ports'

export interface EmailAddresses {
  from: string
  to: string
}

/** Builds a minimal RFC 5322 text/plain message (enough for owner notifications). */
export function buildRawEmail(
  addresses: EmailAddresses,
  message: EmailMessageInput,
  date: Date,
): string {
  const subject = `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(message.subject)))}?=`
  return [
    `From: Portfolio <${addresses.from}>`,
    `To: <${addresses.to}>`,
    `Subject: ${subject}`,
    `Date: ${date.toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${addresses.from.split('@')[1] ?? 'localhost'}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    message.text,
  ].join('\r\n')
}

export interface SendEmailBinding {
  send(message: unknown): Promise<void>
}

/** Production: Cloudflare Email Routing `send_email` binding. */
export function createCloudflareEmailSender(
  binding: SendEmailBinding,
  addresses: EmailAddresses,
  createMessage: (from: string, to: string, raw: string) => unknown,
): EmailSender {
  return {
    async notifyOwner(message) {
      const raw = buildRawEmail(addresses, message, new Date())
      await binding.send(createMessage(addresses.from, addresses.to, raw))
    },
  }
}

/** Local: Mailpit HTTP API (http://localhost:8025). */
export function createMailpitEmailSender(
  base_url: string,
  addresses: EmailAddresses,
  fetcher: typeof fetch = fetch,
): EmailSender {
  return {
    async notifyOwner(message) {
      const response = await fetcher(`${base_url.replace(/\/$/, '')}/api/v1/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: { Email: addresses.from, Name: 'Portfolio' },
          To: [{ Email: addresses.to }],
          Subject: message.subject,
          Text: message.text,
        }),
      })
      if (!response.ok) throw new Error(`Mailpit responded ${response.status}`)
    },
  }
}
