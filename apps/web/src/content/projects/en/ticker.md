---
title: Ticker
summary: Real-time omnichannel customer service platform
role: Lead Developer
---

Web platform that brings customer service from several channels into a single real-time inbox.

### Context

Securitec served its customers through several channels, each living in a different tool.

### Challenge

Deliver messages from every channel to one inbox instantly, even with the backend running on several instances.

### Technical decisions

- Backend services with NestJS on Node.js, with MongoDB as the main store.
- WebSockets for real-time delivery, with Redis distributing events across instances.
- Vue and Nuxt frontend for the agents’ inbox.
- Integrations with WhatsApp, Messenger, Instagram and SMS, plus a payment gateway.
- I built it from scratch and led the team; it has now been in production for 5 years with large B2B customers.

### Outcome

Agents handle conversations from different channels without switching tools, and messages arrive instantly.
