---
title: PWC Mailer
summary: Logiciel d’envoi automatisé d’e-mails
role: Backend Developer
---

Outil interne pour programmer et envoyer automatiquement des campagnes d’e-mails.

### Contexte

Les campagnes étaient préparées et envoyées à la main.

### Défi

Programmer des envois en masse de façon fiable et connaître le statut de chaque e-mail.

### Décisions techniques

- Service avec AdonisJS sur Node.js et MySQL.
- Modèles réutilisables et files d’envoi pour ne pas saturer le fournisseur.
- Suivi du statut de chaque envoi.

### Résultat

Les campagnes se programment et partent toutes seules, avec le statut de chaque e-mail.

<!-- TODO(content): añadir cifras reales (usuarios, volumen, tiempos, tamaño del equipo). -->
