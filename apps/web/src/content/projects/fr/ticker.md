---
title: Ticker
summary: Plateforme omnicanale de service client en temps réel
role: Lead Developer
---

Plateforme web qui réunit le service client de plusieurs canaux dans une seule boîte de réception en temps réel.

### Contexte

Securitec servait ses clients sur plusieurs canaux, chacun dans un outil différent.

### Défi

Faire arriver instantanément les messages de tous les canaux dans une seule boîte, même avec un backend réparti sur plusieurs instances.

### Décisions techniques

- Services backend avec NestJS sur Node.js, et MongoDB comme stockage principal.
- WebSockets pour la livraison en temps réel, avec Redis pour distribuer les événements entre instances.
- Frontend Vue et Nuxt pour la boîte de réception des agents.
- Intégrations avec WhatsApp, Messenger, Instagram et SMS, et une passerelle de paiement.
- Je l’ai développé de zéro et dirigé l’équipe ; il est en production depuis 5 ans chez de grands clients B2B.

### Résultat

Les agents traitent les conversations de différents canaux sans changer d’outil, et les messages arrivent instantanément.
