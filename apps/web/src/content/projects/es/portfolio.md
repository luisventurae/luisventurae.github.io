---
title: Este portafolio
summary: Sitio estático y API serverless con TDD, i18n y RAG para agentes
role: Diseño, frontend y backend
---

El sitio que estás viendo. Es también una muestra de cómo trabajo: el código, las decisiones y el historial son públicos.

### Contexto

Quería un portafolio que demostrara criterio de ingeniería, no solo una lista de tecnologías.

### Reto

Entregar el CV a reclutadores sin exponer datos ni abrir una vía de spam, con un sitio estático, rápido y accesible en tres idiomas.

### Decisiones técnicas

- API en Cloudflare Workers con Hono y arquitectura hexagonal ligera: casos de uso puros y adaptadores para Turnstile, KV, R2 y correo.
- Enlaces de descarga firmados con HMAC y límites de uso por IP para proteger el CV.
- Sitio estático con Astro e islas de React; motion con intención y respeto por `prefers-reduced-motion`.
- Especificaciones primero con OpenSpec, TDD con Vitest, E2E y accesibilidad con Playwright y axe, y CI/CD con GitHub Actions.
- Un RAG local (BM25 + embeddings) para que los agentes de desarrollo encuentren código y decisiones sin leer archivos enteros.

### Resultado

Un sitio en es, en y fr que se publica solo desde `master`, con la API y la web probadas de punta a punta.
