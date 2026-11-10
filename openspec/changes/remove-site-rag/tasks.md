# Tasks

## 1. Web: terminal sin `ask`

- [x] 1.1 Tests rojos: `ask` responde "comando desconocido"; sin `ask` en `help` ni en autocompletado — verificar: `npx vitest run apps/web/src/lib/terminal apps/web/src/components/terminal`
- [x] 1.2 Borrar `ask-client.ts` (+ test), el comando `ask` y sus textos i18n (es/en/fr); retirar `PUBLIC_API_URL` de la terminal si queda sin uso — verificar: tests de terminal en verde, `npm run typecheck`

## 2. API y shared sin RAG

- [x] 2.1 Borrar `rag-routes`, `core/rag`, `adapters/ollama`, `adapters/kv-vector-index` (con sus tests), puertos `EmbeddingProvider`/`ChatModel`/`VectorIndexRepository`, fakes y cableado en `main.ts` y `config.ts` — verificar: `npx vitest run apps/api`
- [x] 2.2 Test de que `/rag/ask` responde 404; quitar `RAG_ENABLED`, `RAG_INDEX_KV` y `OLLAMA_HOST`/`RAG_*` de `wrangler.toml`, `.dev.vars.example` y config — verificar: tests de config y de la app
- [x] 2.3 Borrar `packages/shared/src/rag.ts` y su export; conservar `chunking.ts` si lo usa `search-index.json` — verificar: `npm run lint:unused`

## 3. `rag-ingest` y Docker

- [ ] 3.1 Borrar `packages/rag-ingest` y sus referencias (workspaces, knip, vitest, tsconfig, lockfile) — verificar: `npm install`, `npm run lint:unused`
- [ ] 3.2 Quitar `ollama`, `ollama-pull`, `rag-ingest`, `ollama_models` y variables `RAG_*` de `docker-compose.yml` y `.env.example` — verificar: `docker compose config`, `docker compose up` sin servicios de modelos

## 4. Documentación e índice para agentes

- [ ] 4.1 Reescribir `docs/README.md` como índice de búsqueda (pregunta → documento) y añadir la guía "buscar con `rg` en `docs/` y `openspec/`" — verificar: enlaces resuelven
- [ ] 4.2 Referenciar el índice en `CLAUDE.md` — verificar: lectura manual
- [ ] 4.3 Limpiar menciones de Ollama/RAG en `architecture`, `local-environment`, `security`, `development-rules`, `deployment`, README raíz y `openspec/config.yaml` — verificar: `rg -i "ollama|rag" docs README.md openspec/config.yaml` sin restos
- [ ] 4.4 Ejecución final — verificar: `npm run verify` y `npm run test:e2e`; PR a `develop` indicando `docker volume rm luisventurae-github-io_ollama_models`
