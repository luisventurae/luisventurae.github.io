# Tasks

## 1. Documentación base y OpenSpec

- [x] 1.1 Reglas de desarrollo, branding, design system, arquitectura e índice en `docs/` — verificar: enlaces del índice resuelven
- [x] 1.2 Inicializar OpenSpec y crear el change con proposal, design, specs y tasks — verificar: `openspec validate rebuild-portfolio-v3 --strict`

## 2. Monorepo y herramientas

- [x] 2.1 Eliminar la app Nuxt y `worker/`; crear `package.json` raíz con workspaces y scripts — verificar: `npm install` sin errores
- [x] 2.2 `packages/config` con tsconfig base (TS 7 strict), ESLint flat (naming-convention, jsx-a11y) y Prettier — verificar: `npm run lint`, `npm run format:check`, `npm run typecheck`
- [x] 2.3 Vitest configurado por workspace con umbrales de cobertura — verificar: `npm test`

## 3. Entorno local

- [x] 3.1 `Dockerfile.dev`, `docker-compose.yml` (web, api, ollama, ollama-pull, mailpit, rag-ingest) y `.env.example` — verificar: `docker compose config`
- [x] 3.2 `docs/local-environment.md` — verificar: enlazado desde `docs/README.md`

## 4. Contratos compartidos

- [x] 4.1 Schemas zod de contact (request/response/errores) y rag (ask, index, eventos de stream) en `packages/shared` con tests — verificar: `npm test -w packages/shared`

## 5. API (hexagonal ligera)

- [x] 5.1 Puertos y caso de uso `submitContactRequest` con fakes (captcha, rate limit, firma, notificación tolerante a fallos) — verificar: tests unitarios
- [x] 5.2 Adaptadores Turnstile, KV rate limiter, firma HMAC, R2 CV storage, email (`send_email` y Mailpit) — verificar: tests de adaptadores
- [x] 5.3 App Hono: `POST /contact`, `GET /cv/:token`, CORS y cabeceras de seguridad; composition root en `main.ts` — verificar: tests HTTP con bindings simulados y `wrangler deploy --dry-run`

## 6. Web: base

- [x] 6.1 Astro + React + Tailwind v4, `tokens.css`, fuentes, layout con tema sin flash y CSP por meta — verificar: `npm run build -w apps/web`
- [x] 6.3 SEO: canonical, hreflang, sitemap, robots.txt, Open Graph/Twitter con imagen 1200×630 por idioma y JSON-LD (`ProfilePage`/`Person`/`WebSite`/`ItemList`) — verificar: tests de `src/lib/seo` que validan campos requeridos y E2E que parsea el JSON-LD
- [x] 6.2 Rutas `/`, `/en/`, `/fr/`, strings UI tipados, selector de idioma y toggle de tema con View Transitions — verificar: tests de `src/lib/i18n` y build

## 7. Web: contenido

- [x] 7.1 Colecciones `profile` y `projects` (ES/EN/FR) migradas del sitio actual y `skills.ts` — verificar: build valida schemas; test de enlaces tecnología → proyectos

## 8. Web: hero y navegación

- [x] 8.1 Hero con letras arrastrables, rol rotativo y respeto de reduced motion; nav y footer — verificar: tests de componente

## 9. Web: stack interactivo

- [x] 9.1 Filtro por categoría, resaltado de proyectos por tecnología, teclado y táctil — verificar: tests de componente y de lógica en `src/lib`

## 10. Web: proyectos

- [x] 10.1 Grid con tilt y drawer con galería, navegación por botones/flechas/swipe con resistencia en bordes y placeholder de media — verificar: tests de lógica de swipe y de componente

## 11. Web: formulario de CV

- [x] 11.1 Formulario con Turnstile, cliente de API tipado, estados con morph y toast, descarga del CV — verificar: tests de componente con API simulada

## 12. RAG local

- [x] 12.1 Casos de uso `indexDocuments` y `askQuestion` (coseno, preferencia de idioma, umbral de relevancia, streaming) con fakes — verificar: tests unitarios
- [x] 12.2 Adaptadores Ollama y KV vector index; rutas `/rag/*` solo con `RAG_ENABLED` — verificar: test de 404 con RAG deshabilitado
- [x] 12.3 `packages/rag-ingest`: lectura de contenido, chunking y carga — verificar: tests de chunking

## 13. Terminal

- [x] 13.1 Parser y comandos en `src/lib/terminal` con historial y autocompletado — verificar: tests unitarios
- [x] 13.2 `search-index.json` prerenderizado, búsqueda MiniSearch y `ask` con fallback — verificar: tests de lógica
- [x] 13.3 Componente Terminal con atajo de teclado — verificar: test de componente

## 14. E2E

- [x] 14.1 Playwright: idioma, tema, stack → proyectos, drawer, terminal y formulario (API simulada) — verificar: `npm run test:e2e`

## 15. CI/CD y README

- [ ] 15.1 `ci.yml` (incluye gitleaks y `npm audit`), `release-pr.yml`, `deploy.yml`, Dependabot — verificar: `actionlint`
- [ ] 15.2 `docs/deployment.md` y README raíz corto — verificar: enlaces del índice

## Workflow follow-up

- `openspec archive rebuild-portfolio-v3` cuando el cambio esté desplegado.
