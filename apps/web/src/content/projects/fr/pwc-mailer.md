---
title: PWC Mailer
summary: Microservice interne qui envoie tous les e-mails de la plateforme
role: Backend Developer
---

Microservice qui traite tous les envois d’e-mails de la plateforme de Pool Work Confort.

### Contexte

Les e-mails du site et des systèmes internes partaient via des services d’envoi tiers.

### Défi

Centraliser tous les envois dans un service interne que n’importe quelle application pourrait utiliser.

### Décisions techniques

- Service avec Node.js et TypeScript sur Cloudflare Workers.
- Envoi par SMTP, sans fournisseur d’e-mail tiers.
- Connexion sécurisée avec Cloudflare Zero Trust et bonnes pratiques de sécurité.
- Intégré au site web et au système de gestion.

### Résultat

Tous les e-mails de la plateforme partent d’un seul service interne.
