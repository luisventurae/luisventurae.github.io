import type { UiStrings } from './es'

export const fr: UiStrings = {
  meta: {
    title: 'Luis Ventura E — Full Stack Web Engineer',
    description:
      'Je construis des logiciels web agréables à utiliser : des interfaces soignées dans le détail et des backends qui tiennent un vrai trafic. JavaScript et TypeScript de bout en bout.',
    og_image_alt: 'Luis Ventura E — Full Stack Web Engineer',
  },
  a11y: {
    skip_to_content: 'Aller au contenu',
    main_nav: 'Navigation principale',
    language: 'Langue',
    theme_to_dark: 'Passer au thème sombre',
    theme_to_light: 'Passer au thème clair',
  },
  nav: {
    stack: 'Stack',
    projects: 'Projets',
    terminal: 'Terminal',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Salut, je suis',
    roles: [
      'Full Stack Web Engineer',
      'Design en mouvement',
      'Des backends qui tiennent',
      'TypeScript de bout en bout',
    ],
    tagline:
      'Je construis des logiciels web agréables : chaque détail mesuré, chaque interaction voulue.',
    drag_hint: 'Fais glisser les lettres',
    cta_projects: 'Voir les projets',
    cta_terminal: 'Ouvrir le terminal',
  },
  stack: {
    title: 'Stack',
    intro: 'Choisis une technologie et vois dans quels projets je l’ai utilisée.',
    all: 'Tout',
    categories: { backend: 'Backend', frontend: 'Frontend', other: 'Autres' },
    no_projects: 'Aucun projet de cette liste ne l’utilise (pour l’instant).',
    used_in: (count: number): string =>
      count === 1 ? 'Utilisée dans 1 projet' : `Utilisée dans ${count} projets`,
    clear: 'Effacer la sélection',
  },
  projects: {
    title: 'Projets',
    intro: 'Une sélection de ce que j’ai construit. Ouvre-les et fais-les défiler.',
    open: 'Voir le détail',
    period: 'Période',
    technologies: 'Technologies',
    visit: 'Visiter le site',
    previous: 'Projet précédent',
    next: 'Projet suivant',
    close: 'Fermer',
    swipe_hint: 'Fais glisser pour changer de projet',
    present: 'Aujourd’hui',
  },
  terminal: {
    title: 'Terminal',
    intro: 'Parcours le portfolio à ma façon. Tape `help` pour commencer.',
    shortcut_hint: 'Raccourci : touche `',
    input_label: 'Commande du terminal',
  },
  contact: {
    title: 'On en parle ?',
    intro: 'Laisse ton email et ton entreprise et télécharge mon CV tout de suite.',
    email: 'Email',
    company: 'Entreprise',
    submit: 'Obtenir le CV',
    sending: 'Vérification…',
    success: 'C’est parti ! Ton téléchargement a commencé.',
    download_again: 'Télécharger à nouveau',
    errors: {
      invalid_request: 'Vérifie l’email et l’entreprise.',
      captcha_failed: 'Impossible de vérifier le captcha. Réessaie.',
      rate_limited: 'Trop de tentatives. Attends quelques minutes.',
      payload_too_large: 'La requête est trop volumineuse.',
      invalid_token: 'Le lien de téléchargement a expiré.',
      not_found: 'Ressource introuvable.',
      internal_error: 'Un problème est survenu de notre côté. Réessaie plus tard.',
      network: 'Impossible de joindre le serveur.',
      captcha_missing: 'Complète d’abord le captcha.',
    },
  },
  footer: {
    built_with: 'Fait avec Astro, React et beaucoup de soin pour les détails.',
    source: 'Voir le code',
    rights: 'Tous droits réservés.',
  },
}
