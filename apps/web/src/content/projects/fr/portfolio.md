---
title: Ce portfolio
summary: Site statique et API serverless avec TDD, i18n et RAG pour agents
role: Design, frontend et backend
---

Le site que tu consultes. C’est aussi un exemple de ma façon de travailler : le code, les décisions et l’historique sont publics.

### Contexte

Je voulais un portfolio qui montre un jugement d’ingénieur, pas seulement une liste de technologies.

### Défi

Envoyer mon CV aux recruteurs sans exposer de données ni ouvrir une porte au spam, depuis un site statique rapide et accessible en trois langues.

### Décisions techniques

- API sur Cloudflare Workers avec Hono et une architecture hexagonale légère : cas d’usage purs et adaptateurs pour Turnstile, KV, R2 et l’e-mail.
- Liens de téléchargement signés par HMAC et limites par IP pour protéger le CV.
- Site statique avec Astro et des îlots React ; animations utiles qui respectent `prefers-reduced-motion`.
- Spécifications d’abord avec OpenSpec, TDD avec Vitest, E2E et accessibilité avec Playwright et axe, et CI/CD avec GitHub Actions.
- Un RAG local (BM25 + embeddings) pour que les agents de développement trouvent le code et les décisions sans lire des fichiers entiers.

### Résultat

Un site en es, en et fr publié automatiquement depuis `master`, avec l’API et le web testés de bout en bout.
