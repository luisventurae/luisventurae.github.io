import type { EmailMessageInput, EmailSender } from '../core/ports'

export interface EmailAddresses {
  /** Sender on a domain verified with the provider. */
  from: string
  /** Owner's address for notifications (a secret, never in the repo). */
  to: string
}

const SENDER_NAME = 'Luis Ventura E'
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface ResendConfig extends EmailAddresses {
  api_key: string
}

/** Production: Resend HTTP API, which can deliver to any recipient. */
export function createResendEmailSender(
  config: ResendConfig,
  fetcher: typeof fetch = fetch,
): EmailSender {
  const send = async (to: string, message: EmailMessageInput): Promise<void> => {
    const response = await fetcher(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${config.from}>`,
        to: [to],
        subject: message.subject,
        text: message.text,
      }),
    })
    // Only the status is reported: provider bodies may echo addresses or account details.
    if (!response.ok) throw new Error(`Resend responded ${response.status}`)
  }
  return {
    notifyOwner: (message) => send(config.to, message),
    sendCvLink: (to, message) => send(to, message),
  }
}

/** Local: Mailpit HTTP API (http://localhost:8025) catches every email. */
export function createMailpitEmailSender(
  base_url: string,
  addresses: EmailAddresses,
  fetcher: typeof fetch = fetch,
): EmailSender {
  const send = async (to: string, message: EmailMessageInput): Promise<void> => {
    const response = await fetcher(`${base_url.replace(/\/$/, '')}/api/v1/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: { Email: addresses.from, Name: SENDER_NAME },
        To: [{ Email: to }],
        Subject: message.subject,
        Text: message.text,
      }),
    })
    if (!response.ok) throw new Error(`Mailpit responded ${response.status}`)
  }
  return {
    notifyOwner: (message) => send(addresses.to, message),
    sendCvLink: (to, message) => send(to, message),
  }
}
