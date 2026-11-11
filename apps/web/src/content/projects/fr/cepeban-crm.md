---
title: Cepeban CRM
summary: Synchronisation en temps réel entre la plateforme de service client et le CRM
role: Backend Developer (freelance)
---

Service backend qui tient à jour le Zoho CRM de l’Instituto Cepeban avec les données de sa plateforme de service client, sans intervention manuelle.

### Contexte

Les données des contacts vivaient dans deux systèmes qui ne communiquaient pas.

### Défi

Garder les deux systèmes cohérents en temps réel, sans saisie manuelle et sans exposer d’identifiants.

### Décisions techniques

- Service sur mesure avec NestJS sur Node.js, à usage privé pour l’institut.
- Webhooks en temps réel : chaque mise à jour d’un contact ou assignation d’une conversation à un conseiller crée ou met à jour sa fiche dans Zoho CRM.
- Authentification auprès de Zoho CRM avec des jetons qui se renouvellent seuls.
- Traduction des données et des champs personnalisés du contact vers le modèle du CRM.

### Résultat

Les contacts et les assignations arrivent dans le CRM instantanément, sans saisie manuelle.
