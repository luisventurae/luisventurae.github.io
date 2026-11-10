---
title: Ticker
summary: Real-time omnichannel customer service platform
role: Full Stack Developer
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

### Outcome

Agents handle conversations from different channels without switching tools, and messages arrive instantly.

<!-- TODO(content): añadir cifras reales (usuarios, volumen, tiempos, tamaño del equipo). -->
