# Arquitectura

## Índice

1. [Visión general](#1-visión-general)
2. [Workspaces](#2-workspaces)
3. [Flujo de datos](#3-flujo-de-datos)
4. [Decisiones clave](#4-decisiones-clave)

## 1. Visión general

Monorepo con **npm workspaces**. El frontend es un sitio estático publicado en GitHub Pages; el backend es un Cloudflare Worker. El RAG solo funciona en local.

```
┌──────────────────────────┐        ┌───────────────────────────────┐
│ apps/web (Astro + React) │──HTTP──▶ apps/api (Cloudflare Worker) │
│ GitHub Pages (gh-pages)  │        │  /contact   (prod + local)    │
└──────────┬───────────────┘        │  /rag/*     (solo local)      │
           │ content/**             └───────┬───────────────┬───────┘
           ▼                                │               │
┌──────────────────────────┐                ▼               ▼
│ packages/rag-ingest (CLI)│──/rag/index──▶ KV         Ollama (local)
└──────────────────────────┘
        packages/shared: contratos zod usados por web, api e ingest
```

## 2. Workspaces

| Workspace             | Responsabilidad                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/web`            | Sitio Astro con islas React: hero, stack, proyectos, terminal, formulario. Contenido en `src/content/`.                              |
| `apps/api`            | Worker con Hono, arquitectura hexagonal ligera: `core/` (puertos + casos de uso) y `adapters/` (HTTP, Turnstile, KV, email, Ollama). |
| `packages/shared`     | Schemas zod, tipos de los contratos HTTP y chunking de markdown compartido.                                                          |
| `packages/rag-ingest` | CLI que lee `search-index.json` de la web, genera embeddings y carga el índice en la API local.                                      |
| `packages/config`     | Configuración compartida de TypeScript, ESLint y Prettier.                                                                           |

## 3. Flujo de datos

- **Contenido**: los markdown de `apps/web/src/content/` alimentan el sitio (colecciones de Astro) y el corpus del RAG.
- **Contacto**: formulario → `POST /contact` → verifica Turnstile → rate limit (KV) → notificación por email.
- **Fragmentos**: la web prerenderiza `search-index.json` (perfil, proyectos y stack troceados con `chunkMarkdown` de `packages/shared`). Es la fuente única para la búsqueda de producción y para el RAG.
- **RAG (local)**: `rag-ingest` lee `search-index.json` → embeddings con Ollama → `POST /rag/index` → KV. La terminal envía `ask` → `POST /rag/ask` → embedding de la pregunta → top-k por coseno → respuesta en streaming del modelo.
- **Producción sin RAG**: `/rag/*` no existe; la terminal usa búsqueda de texto (MiniSearch) sobre `search-index.json`, generado en el build.

## 4. Decisiones clave

| Decisión                                   | Motivo                                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Astro + islas React                        | HTML estático por idioma (SEO, rendimiento) e interactividad solo donde aporta.                |
| Hono en el Worker                          | Router mínimo y tipado, ideal para rutas delgadas sobre casos de uso.                          |
| Índice vectorial en KV + coseno en memoria | El corpus es pequeño (decenas de fragmentos); una base vectorial sería excesiva.               |
| RAG solo local                             | Sin coste de inferencia ni claves en producción; demuestra el pipeline completo en desarrollo. |
| Email por binding `send_email`             | MailChannels dejó de ser gratuito para Workers; Email Routing es nativo. Mailpit en local.     |
