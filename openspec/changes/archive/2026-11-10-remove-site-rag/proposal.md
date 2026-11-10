# Proposal

## Why

El RAG con Ollama (embeddings + chat) solo existía en local, exigía ~4 GB de modelos y tres servicios extra en Docker, y su único valor real es de desarrollo: encontrar información rápido en la documentación. Para eso, que Claude Code o Codex lean un índice y usen `grep`/`rg` sobre `docs/` y `openspec/` es más rápido, sin infraestructura ni código que mantener.

## What Changes

- **BREAKING** Se elimina el RAG del sitio: rutas `/rag/*`, caso de uso `rag.ts`, adaptadores `ollama.ts` y `kv-vector-index.ts`, `packages/rag-ingest`, schemas `rag` de `packages/shared`, binding `RAG_INDEX_KV` y variables `RAG_*`/`OLLAMA_HOST`.
- **BREAKING** Se eliminan de `docker-compose.yml` los servicios `ollama`, `ollama-pull` y `rag-ingest` y el volumen `ollama_models`.
- La terminal pierde el comando `ask`; `search` (MiniSearch sobre `search-index.json`) se mantiene como única vía de consulta.
- `docs/README.md` pasa a ser el índice de búsqueda para agentes (qué documento responde qué) y `CLAUDE.md` lo referencia junto con la indicación de usar `rg` sobre `docs/` y `openspec/`.
- Se actualizan los docs que mencionan Ollama/RAG (`architecture`, `local-environment`, `security`, `development-rules`, `deployment`, README raíz).

## Capabilities

### Modified Capabilities

- `terminal`: se quita el comando `ask` y su fallback.
- `local-environment`: el arranque ya no incluye servidor de modelos ni carga de índice.

### Removed Capabilities

- `local-rag`: indexado y respuestas con fuentes.

## Impact

- Código: `apps/api` (rutas, core, adapters, config, wrangler.toml), `packages/rag-ingest` (se borra), `packages/shared` (rag.ts; `chunking.ts` se conserva si lo usa `search-index.json`), `apps/web` (terminal, ask-client, i18n).
- Infra: `docker-compose.yml`, `.env.example`, `apps/api/.dev.vars.example`, `Dockerfile.dev`.
- Dependencias: se retiran las del workspace `rag-ingest`; `knip` debe quedar limpio.
- Este change depende de las capacidades definidas en `rebuild-portfolio-v3` (aún sin archivar): sus deltas se aplican sobre esas specs.
