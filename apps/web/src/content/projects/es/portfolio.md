---
title: Este portafolio
summary: Sitio estático con API serverless, pruebas automáticas y tres idiomas
role: Diseño, frontend y backend
---

Este mismo sitio. Lo construí también para mostrar cómo trabajo, así que el código, las decisiones y el historial están a la vista.

### Contexto

Quería que el portafolio enseñara cómo pienso y construyo, no solo una lista de tecnologías.

### Reto

Poder enviar mi CV a reclutadores sin dejarlo expuesto ni abrir la puerta al spam, en un sitio estático, rápido y accesible, en tres idiomas.

### Decisiones técnicas

- API en Cloudflare Workers con Hono. Separé la lógica de los servicios externos (Turnstile, KV, R2 y correo) con una arquitectura hexagonal ligera.
- El CV se descarga con un enlace firmado que vence, y hay límites de envíos por IP y por destinatario.
- Sitio con Astro y componentes de React solo donde hacen falta. Las animaciones respetan `prefers-reduced-motion`.
- Cada cambio parte de una especificación en OpenSpec, con pruebas unitarias en Vitest y de punta a punta y accesibilidad con Playwright y axe. El despliegue corre en GitHub Actions.
- Un buscador local (BM25 y embeddings) que usan los agentes de desarrollo para encontrar código y decisiones sin leer archivos completos.

### Resultado

El sitio se publica solo al integrar en `master`, en español, inglés y francés, con la API y la web cubiertas por pruebas.
