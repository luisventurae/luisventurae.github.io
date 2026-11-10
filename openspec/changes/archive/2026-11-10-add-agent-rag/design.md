# Design

## Context

El corpus tiene unos cientos de archivos (~200 versionados), así que no hace falta una base vectorial. Lo que importa es que el agente gaste pocos tokens: resultados con `ruta:línea_ini-línea_fin` y un extracto corto, para leer después solo ese rango.

## Goals / Non-Goals

**Goals:**

- Responder preguntas conceptuales sobre código, docs, specs, tests e historial.
- Cero servicios: todo corre en el proceso del CLI.
- Índice siempre fresco sin paso manual.
- Degradar con elegancia si falta el modelo.

**Non-Goals:**

- Servidor MCP o endpoints HTTP (se eligió CLI).
- Sustituir a `rg` para cadenas exactas.
- Formar parte del sitio o de CI.

## Decisions

| Decisión                                                                      | Motivo                                                                                                         |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Híbrida BM25 + embeddings con RRF                                             | BM25 es exacto con identificadores; los embeddings cubren sinónimos y preguntas en lenguaje natural.           |
| Embeddings en proceso con `@huggingface/transformers`                         | Sin Ollama ni Docker; funciona offline tras la primera descarga.                                               |
| Modelo `multilingual-e5-small`                                                | Pequeño (~120 MB) y multilingüe: docs en español, código en inglés.                                            |
| MiniSearch para la parte léxica                                               | Ya se usa en `apps/web`; soporta tokenizador propio.                                                           |
| Troceado por AST de TypeScript para `.ts/.tsx`                                | Un fragmento por declaración da resultados con sentido y rango exacto; la API de TypeScript ya está instalada. |
| Troceador de Markdown propio                                                  | `chunkMarkdown` descarta formato y no devuelve líneas; aquí hacen falta ambas cosas.                           |
| Archivos desde `git ls-files`                                                 | Respeta `.gitignore` y excluye binarios y dependencias sin reglas propias.                                     |
| Índice JSON en `.cache/agent-rag/`                                            | Corpus pequeño; coseno en memoria. `.cache` ya está ignorado.                                                  |
| Reindexado por hash de contenido de archivo                                   | Solo se re-trocea y re-embebe lo que cambió.                                                                   |
| Modelo y almacenamiento tras puertos (`Embedder`, `IndexStore`, `FileSource`) | Tests con fakes y cobertura ≥ 80 % sin descargar el modelo.                                                    |

## Risks / Trade-offs

- `onnxruntime-node` puede requerir un script de instalación bloqueado por `allowScripts` → permitirlo explícitamente o usar el runtime WASM.
- La primera ejecución descarga el modelo → se avisa en la salida y se cachea.
- Un índice obsoleto da respuestas viejas → `search` comprueba hashes antes de responder.

## Migration Plan

Aditivo: ningún sistema existente cambia. Rollback: borrar `packages/agent-rag` y el script `rag`.
