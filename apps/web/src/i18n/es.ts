export const es = {
  meta: {
    title: 'Luis Ventura E — Full Stack Web Engineer',
    description:
      'Construyo software web que se siente bien: interfaces cuidadas al detalle y backends que aguantan tráfico real. JavaScript y TypeScript de punta a punta.',
    og_image_alt: 'Luis Ventura E — Full Stack Web Engineer',
  },
  a11y: {
    skip_to_content: 'Saltar al contenido',
    main_nav: 'Navegación principal',
    language: 'Idioma',
    theme_to_dark: 'Cambiar a tema oscuro',
    theme_to_light: 'Cambiar a tema claro',
  },
  nav: {
    stack: 'Stack',
    projects: 'Proyectos',
    terminal: 'Terminal',
    contact: 'Contacto',
  },
  hero: {
    greeting: 'Hola, soy',
    roles: [
      'Full Stack Web Engineer',
      'Diseño en movimiento',
      'Backends que escalan',
      'TypeScript de punta a punta',
    ],
    tagline:
      'Construyo software web que se siente bien: cada detalle medido, cada interacción con intención.',
    drag_hint: 'Arrastra las letras',
    cta_projects: 'Ver proyectos',
    cta_terminal: 'Abrir la terminal',
  },
  stack: {
    title: 'Stack',
    intro: 'Elige una tecnología y mira en qué proyectos la usé.',
    all: 'Todo',
    categories: { backend: 'Backend', frontend: 'Frontend', other: 'Otros' },
    no_projects: 'Ningún proyecto de esta lista la usa (todavía).',
    used_in: (count: number): string =>
      count === 1 ? 'Usada en 1 proyecto' : `Usada en ${count} proyectos`,
    clear: 'Quitar selección',
  },
  projects: {
    title: 'Proyectos',
    intro: 'Una selección de lo que he construido. Ábrelos y desliza para recorrerlos.',
    open: 'Ver detalle',
    period: 'Período',
    technologies: 'Tecnologías',
    visit: 'Visitar sitio',
    previous: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    close: 'Cerrar',
    swipe_hint: 'Desliza para cambiar de proyecto',
    present: 'Actualidad',
  },
  terminal: {
    title: 'Terminal',
    intro: 'Recorre el portafolio a mi manera. Escribe `help` para empezar.',
    shortcut_hint: 'Atajo: tecla `',
    input_label: 'Comando de la terminal',
  },
  contact: {
    title: '¿Hablamos?',
    intro: 'Déjame tu email y empresa y descarga mi CV al instante.',
    email: 'Email',
    company: 'Empresa',
    submit: 'Obtener CV',
    sending: 'Verificando…',
    success: '¡Listo! Tu descarga comenzó.',
    download_again: 'Descargar de nuevo',
    errors: {
      invalid_request: 'Revisa el email y la empresa.',
      captcha_failed: 'No pudimos verificar el captcha. Inténtalo de nuevo.',
      rate_limited: 'Demasiados intentos. Espera unos minutos.',
      payload_too_large: 'La solicitud es demasiado grande.',
      invalid_token: 'El enlace de descarga expiró.',
      not_found: 'No encontramos el recurso.',
      internal_error: 'Algo falló de nuestro lado. Inténtalo más tarde.',
      network: 'Sin conexión con el servidor.',
      captcha_missing: 'Completa el captcha primero.',
    },
  },
  footer: {
    built_with: 'Hecho con Astro, React y mucho cuidado por los detalles.',
    source: 'Ver el código',
    rights: 'Todos los derechos reservados.',
  },
}

export type UiStrings = typeof es
