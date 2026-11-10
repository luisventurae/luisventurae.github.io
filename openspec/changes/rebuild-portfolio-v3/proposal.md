# Proposal

## Why

El portafolio actual (Nuxt 3 + SCSS) cumple, pero no demuestra el nivel actual de oficio: el motion es básico, no hay interacción memorable y el backend es un único archivo sin pruebas. Se rehace para que el propio sitio sea la prueba de las habilidades: interfaz cuidada al detalle, arquitectura limpia, pruebas y un pipeline RAG.

## What Changes

- **BREAKING** Se elimina la app Nuxt y el directorio `worker/`; el repositorio pasa a ser un monorepo con npm workspaces.
- Nuevo frontend estático (Astro + islas React, TS 7) con hero tipográfico interactivo (sin foto), stack interactivo, proyectos en drawer con gestos, terminal interactiva y formulario de CV.
- Nueva API en Cloudflare Workers con arquitectura hexagonal ligera (SOLID) que reemplaza al worker de contacto; el envío de email pasa a Email Routing (`send_email`) y Mailpit en local.
- Pipeline RAG local: ingesta del contenido del sitio, embeddings y respuestas en streaming con Ollama; deshabilitado en producción.
- Entorno local completo con Docker Compose.
- CI/CD en GitHub Actions con el flujo `develop → master` y despliegue a `gh-pages` y Cloudflare.
- **BREAKING** Se elimina la descarga directa del CV y la foto del banner.
- Se conservan i18n (ES/EN/FR con las mismas URLs), el toggle de tema y el formulario con Turnstile.

## Capabilities

### New Capabilities
- `site-shell`: estructura del sitio, rutas por idioma, tema claro/oscuro, navegación, SEO y accesibilidad base.
- `hero`: presentación principal con tipografía interactiva.
- `stack-map`: mapa de tecnologías explorable y enlazado con los proyectos.
- `projects-showcase`: listado de proyectos y vista de detalle con navegación por gestos.
- `terminal`: terminal interactiva con comandos de navegación, búsqueda y preguntas.
- `contact-api`: solicitud de CV por email protegida con captcha y rate limit.
- `local-rag`: indexado del contenido y respuesta a preguntas con fuentes, solo en local.
- `local-environment`: levantar todo el sistema en local con un solo comando.
- `delivery-pipeline`: verificación automática de cambios y despliegue de web y API.

### Modified Capabilities

## Impact

- Se reemplaza todo el código de la raíz (Nuxt) y `worker/`.
- Nuevas dependencias: Astro, React 19, Motion, Vaul, Sonner, Tailwind v4, MiniSearch, Hono, zod, Vitest, Playwright, ESLint, Prettier, TypeScript 7.
- Variables de entorno renombradas: `NUXT_PUBLIC_*` → `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_API_URL`.
- Cloudflare: nuevo binding `send_email`, KV `RATE_LIMIT_KV` y `RAG_INDEX_KV` (este último solo local).
- GitHub: nuevos workflows y secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
