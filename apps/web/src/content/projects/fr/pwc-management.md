---
title: Système de gestion
summary: Système interne de gestion commerciale et opérationnelle
role: Full Stack Developer
---

Système interne pour gérer le volet commercial et opérationnel de Pool Work Confort.

### Contexte

Les devis, les ventes et l’inventaire étaient gérés à la main, séparément de la boutique en ligne.

### Défi

Automatiser le travail quotidien de l’équipe et garder l’inventaire cohérent avec la boutique en ligne.

### Décisions techniques

- Application avec Node.js et TypeScript, interface Astro et déploiement avec Docker.
- Génération automatique de devis en PDF avec React PDF, suivi des ventes et de l’inventaire.
- Enregistrement des prix et des coûts, avec les marges visibles et les taux de change du jour.
- Mise à jour des produits synchronisée avec la boutique en ligne.
- Envoi d’e-mails via le microservice interne.

### Résultat

L’équipe génère ses devis, suit ses ventes et met à jour l’inventaire depuis un seul système, avec une boutique toujours à jour.
