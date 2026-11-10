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

| Workspace            | Responsabilidad                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/web`           | Sitio Astro con islas React: hero, sobre mí, experiencia, proyectos, stack, CV, terminal. Contenido en `src/content/`.                                       |
| `apps/api`           | Worker con Hono, arquitectura hexagonal ligera: `core/` (puertos + casos de uso) y `adapters/` (HTTP, Turnstile, KV, email).                                 |
| `packages/shared`    | Schemas zod, tipos de los contratos HTTP y chunking de markdown compartido.                                                                                  |
| `packages/agent-rag` | CLI de desarrollo para agentes: búsqueda híbrida (BM25 + embeddings locales) sobre código, docs, specs, tests y commits. Ver [`agent-rag.md`](agent-rag.md). |
| `packages/config`    | Configuración compartida de TypeScript, ESLint y Prettier.                                                                                                   |

## 3. Flujo de datos

- **Contenido**: los markdown de `apps/web/src/content/` alimentan el sitio (colecciones de Astro) y la búsqueda de la terminal. Hay tres colecciones: `profile/<locale>.md`, `projects/<locale>/<slug>.md` y `experience/<locale>/<id>.md`. Los datos que no dependen del idioma viven en `src/data/` (`projects.ts`, `experience.ts`, `skills.ts`, `site.ts`), y `lib/content.ts` los une con el texto localizado.
- **Años de experiencia**: `careerYears()` (`lib/experience.ts`) los calcula en el build desde `CAREER_START` (`data/site.ts`). Los textos usan el token `{years}`, que se interpola en el hero, en la descripción meta y en el perfil.
- **Contacto (CV)**: juego "Match de vacante" (opcional) → formulario → `POST /contact` → verifica Turnstile → rate limit por IP y por destinatario (KV) → firma un enlace de 7 días → Resend envía el enlace al reclutador → notificación al dueño con los requisitos marcados. La respuesta solo confirma el envío (`{ status: 'sent' }`); el PDF se sirve desde R2 en `/cv/:token`.
- **Fragmentos**: la web prerenderiza `search-index.json` (perfil, experiencia, proyectos y stack troceados con `chunkMarkdown` de `packages/shared`). Es la fuente única de la búsqueda de la terminal.
- **Búsqueda**: la terminal usa búsqueda de texto (MiniSearch) sobre `search-index.json`, generado en el build.

## 4. Decisiones clave

| Decisión            | Motivo                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Astro + islas React | HTML estático por idioma (SEO, rendimiento) e interactividad solo donde aporta.                                    |
| Hono en el Worker   | Router mínimo y tipado, ideal para rutas delgadas sobre casos de uso.                                              |
| Email por Resend    | Email Routing solo envía a destinos verificados; Resend entrega a cualquier reclutador por HTTP. Mailpit en local. |
