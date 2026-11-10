# Design

## Context

Ver `proposal.md` › Why. Restricciones: el frontend debe ser estático (GitHub Pages, rama `gh-pages`); el backend corre en Cloudflare Workers; el RAG no debe generar coste ni requerir claves en producción; convenciones en `docs/development-rules.md`; arquitectura descrita en `docs/architecture.md`.

## Goals / Non-Goals

**Goals:**

- HTML prerenderizado por idioma con interactividad aislada en islas.
- Backend con dependencias invertidas: casos de uso testeables con fakes.
- Un único origen de contenido para el sitio y el corpus del RAG.
- `docker compose up` deja todo funcionando, incluido el RAG.

**Non-Goals:**

- Chat con LLM en producción.
- CMS o panel de administración.
- Analítica o tracking.

## Decisions

1. **Astro + islas React** frente a SPA con Vite o Vue. Astro genera HTML estático por idioma (SEO y rendimiento) y React da acceso al ecosistema de motion/gestos (Motion, Vaul, Sonner). _Alternativas_: SPA React (peor SEO y primera carga), Vue (menos herramientas de gestos de calidad).
2. **TypeScript 7 para `tsc` + `@typescript/typescript6` para herramientas.** TS 7 nativo aún no expone API JS; typescript-eslint y astro check la necesitan. `typescript` apunta al paquete compat de TS 6 y TS 7 vive en el alias `typescript7`, usado por `npm run typecheck`. _Alternativa_: quedarse en TS 6 (incumple el requisito).
3. **API con hexagonal ligera y Hono.** `core/` (puertos + casos de uso como funciones con `deps` inyectadas) y `adapters/` (rutas Hono de entrada y adaptadores de salida); `main.ts` como composition root por request a partir de `env`. _Alternativas_: handler único (el worker actual), difícil de probar; capas completas tipo clean architecture, excesivas para tres casos de uso.
4. **CV en R2**: el PDF por idioma vive en un bucket R2 (`CV_BUCKET`, claves `cv/<lang>.pdf`, fallback `es`). `POST /contact` válido devuelve una URL de descarga firmada (HMAC con `DOWNLOAD_TOKEN_SECRET`, expira en 10 min); `GET /cv/:token` verifica la firma y sirve el PDF desde R2. Así el CV deja de ser público en el repositorio y queda detrás de captcha + rate limit. Puertos `CvStorage` y `TokenSigner`. En local, Wrangler emula R2 y un script siembra el PDF. _Alternativa_: enviar el PDF por email al solicitante, descartada porque Email Routing solo envía a direcciones verificadas.
5. **Email**: binding `send_email` de Email Routing en producción y Mailpit (API HTTP) en local, detrás del puerto `EmailSender`. MailChannels dejó de ser gratuito para Workers.
6. **RAG**: embeddings `bge-m3` y generación `qwen3:4b-instruct` vía Ollama (la variante _thinking_ de `qwen3:4b` ignora `think:false` y filtra su razonamiento en la respuesta); índice serializado en KV (`RAG_INDEX_KV`), similitud coseno en memoria (corpus de decenas de fragmentos). Rutas `/rag/*` registradas solo con `RAG_ENABLED=true`. _Alternativas_: Vectorize (no emulado en local), WebLLM en el navegador (descargas pesadas).
7. **Búsqueda en producción**: MiniSearch sobre `search-index.json` prerenderizado con los mismos fragmentos, sin modelos.
8. **Contenido**: colecciones de Astro (markdown por idioma) validadas con zod; `skills.ts` tipado. El CLI de ingesta lee los mismos archivos.
9. **Motion**: CSS transitions para lo predecible, Motion para springs/gestos; tokens de easing/duración en `tokens.css`; `prefers-reduced-motion` respetado.
10. **CI/CD**: `ci.yml` en PRs y en `develop`; `release-pr.yml` abre/actualiza el PR `develop → master` cuando CI pasa en `develop`; `deploy.yml` en `master` publica la web en `gh-pages` y despliega el Worker si cambió.

## Risks / Trade-offs

- [TS 7 y herramientas del ecosistema desalineadas] → alias documentado; revisar al salir typescript-eslint con soporte TS 7.
- [Contenido escaso: los proyectos solo tienen una línea de descripción] → textos base redactados a partir del sitio actual y marcados `TODO(media)` para enriquecer.
- [Modelos de Ollama pesados (varios GB)] → servicio `ollama-pull` one-shot y volumen persistente; documentado en `docs/local-environment.md`.
- [Email Routing requiere dominio en Cloudflare] → documentado en `docs/deployment.md`; el adaptador es intercambiable.
- [Animaciones costosas en móviles] → solo `transform`/`opacity`, tilt desactivado con puntero grueso.

## Migration Plan

1. Rama `feat/portfolio-v3` desde `develop`, commits por chunk.
2. PR a `develop`; CI verde; PR automático `develop → master`.
3. Antes del merge a `master`: crear secrets en GitHub, KV y Email Routing en Cloudflare, actualizar `PUBLIC_API_URL`.
4. Rollback: revertir el merge en `master`; el workflow vuelve a publicar la versión anterior en `gh-pages`.
