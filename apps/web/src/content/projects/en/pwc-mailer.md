---
title: PWC Mailer
summary: Automated email delivery software
role: Backend Developer
---

Internal tool to schedule and send email campaigns automatically.

### Context

Email campaigns were prepared and sent by hand.

### Challenge

Schedule bulk sends reliably and know the status of every email.

### Technical decisions

- Service with AdonisJS on Node.js and MySQL.
- Reusable templates and send queues so the provider is never flooded.
- Status tracking for every send.

### Outcome

Campaigns are scheduled and sent automatically, with visibility on each email’s status.

<!-- TODO(content): añadir cifras reales (usuarios, volumen, tiempos, tamaño del equipo). -->
