# Proposal

## Why

Con `remove-site-rag` los agentes (Claude Code, Codex) quedaron buscando solo con `rg` sobre `docs/` y `openspec/`. Eso no cubre el código: las preguntas conceptuales («¿dónde se valida el captcha?», «¿cómo se firma el token del CV?») obligan a encadenar varios `rg` y a leer archivos enteros. Hace falta una herramienta de desarrollo, local y sin servicios, que devuelva los fragmentos relevantes con ruta y rango de líneas.

## What Changes

- Nuevo workspace `packages/agent-rag` con un CLI invocable como `npm run rag -- <comando>`: `search`, `index` y `status`.
- Recuperación híbrida: léxica (BM25) y semántica (embeddings locales en proceso, sin servidor), fusionadas con Reciprocal Rank Fusion.
- Corpus: código de `apps/` y `packages/` (troceado por declaración), tests, `docs/`, `openspec/` y commits recientes.
- Índice incremental en `.cache/agent-rag/` (ignorado por git); `search` lo actualiza solo si detecta cambios.
- Si el modelo de embeddings no está disponible, la búsqueda degrada a solo BM25 con un aviso.
- `AGENTS.md`, `CLAUDE.md` y `docs/` explican cuándo usar `rag` y cuándo `rg`.

No cambia la API, el sitio ni Docker: el RAG del sitio sigue eliminado.

## Capabilities

### New Capabilities

- `agent-rag`: búsqueda híbrida sobre el código y la documentación del repositorio, pensada para agentes.

## Impact

- Código: `packages/agent-rag` (nuevo), script `rag` en el `package.json` raíz, exclusión de `cli.ts` de la cobertura en `vitest.config.ts`.
- Dependencias: `minisearch` y `@huggingface/transformers` (solo en el nuevo workspace). Posible entrada en `allowScripts` si el runtime nativo la exige.
- Docs: `AGENTS.md`, `CLAUDE.md`, `docs/README.md`, `docs/architecture.md` y nuevo `docs/agent-rag.md`.
- Descarga única del modelo (~120 MB) en `.cache/agent-rag/models/`.
