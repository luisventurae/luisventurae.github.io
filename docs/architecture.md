# Arquitectura

## Índice

1. [Visión general](#1-visión-general)
2. [Workspaces](#2-workspaces)
3. [Flujo de datos](#3-flujo-de-datos)
4. [Decisiones clave](#4-decisiones-clave)

## 1. Visión general

Monorepo con **npm workspaces**. El frontend es un sitio estático publicado en GitHub Pages; el backend es un Cloudflare Worker.

```
┌──────────────────────────┐        ┌───────────────────────────────┐
│ apps/web (Astro + React) │──HTTP──▶ apps/api (Cloudflare Worker) │
│ GitHub Pages (gh-pages)  │        │  /contact · /cv/:token        │
└──────────────────────────┘        └───────┬───────────────┬───────┘
                                            ▼               ▼
                                    KV (rate limit)    R2 (CV) · Email
        packages/shared: contratos zod y chunking usados por web y api
```

## 2. Workspaces

| Workspace         | Responsabilidad                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`        | Sitio Astro con islas React: hero, stack, proyectos, terminal, formulario. Contenido en `src/content/`.                      |
| `apps/api`        | Worker con Hono, arquitectura hexagonal ligera: `core/` (puertos + casos de uso) y `adapters/` (HTTP, Turnstile, KV, email). |
| `packages/shared` | Schemas zod, tipos de los contratos HTTP y chunking de markdown compartido.                                                  |
| `packages/config` | Configuración compartida de TypeScript, ESLint y Prettier.                                                                   |

## 3. Flujo de datos

- **Contenido**: los markdown de `apps/web/src/content/` alimentan el sitio (colecciones de Astro) y la búsqueda de la terminal.
- **Contacto**: formulario → `POST /contact` → verifica Turnstile → rate limit (KV) → notificación por email.
- **Fragmentos**: la web prerenderiza `search-index.json` (perfil, proyectos y stack troceados con `chunkMarkdown` de `packages/shared`). Es la fuente única de la búsqueda de la terminal.
- **Búsqueda**: la terminal usa búsqueda de texto (MiniSearch) sobre `search-index.json`, generado en el build.

## 4. Decisiones clave

| Decisión                       | Motivo                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Astro + islas React            | HTML estático por idioma (SEO, rendimiento) e interactividad solo donde aporta.            |
| Hono en el Worker              | Router mínimo y tipado, ideal para rutas delgadas sobre casos de uso.                      |
| Email por binding `send_email` | MailChannels dejó de ser gratuito para Workers; Email Routing es nativo. Mailpit en local. |
