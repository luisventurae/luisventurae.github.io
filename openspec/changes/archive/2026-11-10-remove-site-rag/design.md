# Design

## Context

El RAG fue pensado como demostración técnica local. Ya no se quiere como funcionalidad del sitio. La necesidad vigente es que los agentes encuentren documentación rápido. El corpus (`docs/`, `openspec/`) es de pocas decenas de archivos Markdown: `rg` responde en milisegundos y no hay problema de recall que embeddings resuelvan.

## Goals / Non-Goals

**Goals:**

- Dejar de depender de Ollama y de cualquier modelo local.
- Mantener `search` en la terminal con el mismo `search-index.json`.
- Un índice de documentación claro para agentes.

**Non-Goals:**

- Sustituir el RAG por otro (MCP, embeddings en proceso): descartado por exceso para el tamaño del corpus.
- Cambiar la búsqueda de producción.

## Decisions

| Decisión                                                    | Motivo                                                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Borrar el código RAG en lugar de dejarlo tras `RAG_ENABLED` | Knip y la regla de código muerto (`development-rules` §6) lo prohíben; un flag apagado es deuda. |
| Conservar `chunkMarkdown` y `search-index.json`             | Los usa `search`; solo se retira lo exclusivo del RAG (verificar con knip).                      |
| Agentes: índice en `docs/README.md` + `rg`                  | Cero infraestructura; se mantiene en el mismo commit que el cambio documentado (§9).             |
| Quitar `RAG_INDEX_KV` de wrangler                           | Sin uso; el namespace de KV real (si existe) se borra a mano fuera del repo.                     |

## Risks / Trade-offs

- Se pierde la demo "pregunta en lenguaje natural" del portafolio → aceptado; `search` cubre la consulta.
- El volumen Docker `ollama_models` queda huérfano en las máquinas existentes → documentar `docker volume rm` en el PR.
- Las specs de `rebuild-portfolio-v3` (sin archivar) aún describen el RAG → los deltas de este change deben archivarse después de ese change, o este debe archivarse con sus deltas ya reconciliados.

## Migration Plan

Un solo PR a `develop`, en chunks: (1) quitar web/terminal, (2) quitar API y shared, (3) quitar `rag-ingest` y Docker, (4) docs e índice. Rollback: revertir el PR.
