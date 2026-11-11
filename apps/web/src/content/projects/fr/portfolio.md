---
title: Ce portfolio
summary: Site statique avec une API serverless, des tests automatiques et trois langues
role: Design, frontend et backend
---

Ce site même. Je l’ai aussi construit pour montrer ma façon de travailler : le code, les décisions et l’historique sont visibles.

### Contexte

Je voulais que le portfolio montre comment je réfléchis et je construis, pas seulement une liste de technologies.

### Défi

Pouvoir envoyer mon CV aux recruteurs sans l’exposer ni ouvrir la porte au spam, sur un site statique, rapide et accessible, en trois langues.

### Décisions techniques

- API sur Cloudflare Workers avec Hono. J’ai séparé la logique des services externes (Turnstile, KV, R2 et e-mail) grâce à une architecture hexagonale légère.
- Le CV se télécharge via un lien signé qui expire, avec des limites d’envoi par IP et par destinataire.
- Site avec Astro et des composants React seulement là où ils sont utiles. Les animations respectent `prefers-reduced-motion`.
- Chaque changement part d’une spécification OpenSpec, avec des tests unitaires en Vitest, des tests de bout en bout et d’accessibilité avec Playwright et axe. Le déploiement tourne sur GitHub Actions.
- Un outil de recherche local (BM25 et embeddings) que les agents de développement utilisent pour trouver du code et des décisions sans lire des fichiers entiers.

### Résultat

Le site se publie tout seul quand les changements arrivent sur `master`, en espagnol, anglais et français, avec l’API et le web couverts par des tests.
