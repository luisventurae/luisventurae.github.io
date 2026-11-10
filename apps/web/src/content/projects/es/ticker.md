---
title: Ticker
summary: Plataforma omnicanal de atención al cliente en tiempo real
role: Full Stack Developer
---

Plataforma web que centraliza la atención al cliente de varios canales en una sola bandeja en tiempo real.

### Contexto

Securitec atendía a sus clientes por distintos canales, y cada uno vivía en una herramienta diferente.

### Reto

Que los mensajes de todos los canales llegaran al instante a una sola bandeja, aunque el backend corriera en varias instancias.

### Decisiones técnicas

- Servicios backend con NestJS sobre Node.js y MongoDB como almacenamiento principal.
- WebSockets para entregar los mensajes en tiempo real, con Redis para distribuir los eventos entre instancias.
- Frontend con Vue y Nuxt para la bandeja de los agentes.

### Resultado

Los agentes atienden conversaciones de distintos canales sin cambiar de herramienta, y los mensajes llegan al instante.

<!-- TODO(content): añadir cifras reales (usuarios, volumen, tiempos, tamaño del equipo). -->
