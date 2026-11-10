import type { UiStrings } from './es'

export const en: UiStrings = {
  meta: {
    title: 'Luis Ventura E — Full Stack Web Engineer',
    description:
      'I build web software that feels right: interfaces crafted to the detail and backends that handle real traffic. JavaScript and TypeScript end to end.',
    og_image_alt: 'Luis Ventura E — Full Stack Web Engineer',
  },
  a11y: {
    skip_to_content: 'Skip to content',
    main_nav: 'Main navigation',
    language: 'Language',
    theme_to_dark: 'Switch to dark theme',
    theme_to_light: 'Switch to light theme',
  },
  nav: {
    stack: 'Stack',
    projects: 'Projects',
    terminal: 'Terminal',
    contact: 'Contact',
  },
  hero: {
    greeting: "Hi, I'm",
    roles: [
      'Full Stack Web Engineer',
      'Design in motion',
      'Backends that scale',
      'TypeScript end to end',
    ],
    tagline:
      'I build web software that feels right: every detail measured, every interaction intentional.',
    drag_hint: 'Drag the letters',
    cta_projects: 'See projects',
    cta_terminal: 'Open the terminal',
  },
  stack: {
    title: 'Stack',
    intro: 'Pick a technology and see which projects I used it in.',
    all: 'All',
    categories: { backend: 'Backend', frontend: 'Frontend', other: 'Other' },
    no_projects: 'No project on this list uses it (yet).',
    used_in: (count: number): string =>
      count === 1 ? 'Used in 1 project' : `Used in ${count} projects`,
    clear: 'Clear selection',
  },
  projects: {
    title: 'Projects',
    intro: "A selection of what I've built. Open them and swipe through.",
    open: 'View details',
    period: 'Period',
    technologies: 'Technologies',
    visit: 'Visit site',
    previous: 'Previous project',
    next: 'Next project',
    close: 'Close',
    swipe_hint: 'Swipe to change project',
    present: 'Present',
  },
  terminal: {
    title: 'Terminal',
    intro: 'Explore the portfolio my way. Type `help` to start.',
    shortcut_hint: 'Shortcut: ` key',
    input_label: 'Terminal command',
  },
  contact: {
    title: "Let's talk?",
    intro: 'Leave your email and company and download my resume instantly.',
    email: 'Email',
    company: 'Company',
    submit: 'Get resume',
    sending: 'Verifying…',
    success: 'Done! Your download has started.',
    download_again: 'Download again',
    errors: {
      invalid_request: 'Check the email and company.',
      captcha_failed: "We couldn't verify the captcha. Please try again.",
      rate_limited: 'Too many attempts. Wait a few minutes.',
      payload_too_large: 'The request is too large.',
      invalid_token: 'The download link expired.',
      not_found: "We couldn't find that resource.",
      internal_error: 'Something failed on our side. Try again later.',
      network: "Can't reach the server.",
      captcha_missing: 'Complete the captcha first.',
    },
  },
  footer: {
    built_with: 'Made with Astro, React and a lot of care for details.',
    source: 'View the source',
    rights: 'All rights reserved.',
  },
}
