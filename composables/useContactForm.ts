type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface ContactPayload {
  email: string
  company: string
  captchaToken: string
}

interface WorkerResponse {
  success: boolean
  message?: string
}

interface ContactFormComposable {
  status: Ref<FormStatus>
  errorMessage: Ref<string>
  submit: (payload: ContactPayload) => Promise<void>
  reset: () => void
}

export const useContactForm = (): ContactFormComposable => {
  const config = useRuntimeConfig()
  const status = ref<FormStatus>('idle')
  const errorMessage = ref<string>('')

  const validatePayload = (payload: ContactPayload): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!payload.email || !emailRegex.test(payload.email)) {
      return 'Ingresa un email válido.'
    }
    if (!payload.company || payload.company.trim().length < 2) {
      return 'Ingresa el nombre de tu empresa (mínimo 2 caracteres).'
    }
    if (!payload.captchaToken) {
      return 'Completa el captcha antes de continuar.'
    }
    return null
  }

  const submit = async (payload: ContactPayload): Promise<void> => {
    const validationError = validatePayload(payload)
    if (validationError) {
      errorMessage.value = validationError
      status.value = 'error'
      return
    }

    status.value = 'loading'
    errorMessage.value = ''

    const workerUrl = config.public.workerUrl as string
    if (!workerUrl) {
      errorMessage.value = 'Servicio de contacto no disponible.'
      status.value = 'error'
      return
    }

    try {
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.email.trim(),
          company: payload.company.trim(),
          'cf-turnstile-response': payload.captchaToken,
        }),
      })

      const data = await response.json() as WorkerResponse

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? 'Error al enviar el formulario.')
      }

      status.value = 'success'
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de red. Intenta más tarde.'
      errorMessage.value = message
      status.value = 'error'
    }
  }

  const reset = (): void => {
    status.value = 'idle'
    errorMessage.value = ''
  }

  return { status, errorMessage, submit, reset }
}
