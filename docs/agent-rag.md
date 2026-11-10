# RAG para agentes

Búsqueda híbrida local sobre el código y la documentación del repositorio, pensada para que agentes (Claude Code, Codex) localicen información sin leer archivos enteros. Es una herramienta de desarrollo: no forma parte del sitio ni de la API, y no usa Ollama ni servidores.

## Índice

1. [Cuándo usarlo](#1-cuándo-usarlo)
2. [Comandos](#2-comandos)
3. [Qué indexa](#3-qué-indexa)
4. [Cómo funciona](#4-cómo-funciona)
5. [Límites y problemas frecuentes](#5-límites-y-problemas-frecuentes)

## 1. Cuándo usarlo

| Necesitas                                                | Usa                     |
| -------------------------------------------------------- | ----------------------- |
| Preguntas conceptuales: «¿dónde se valida el captcha?»   | `rag search`            |
| Localizar una convención, una spec o una decisión pasada | `rag search --kind ...` |
| Una cadena exacta, un nombre de variable, un import      | `rg`                    |
| Leer un archivo del que ya conoces la ruta               | `Read`                  |

El resultado de `rag search` es una ubicación `ruta:línea_ini-línea_fin`: lee solo ese rango.

## 2. Comandos

```bash
npm run -s rag -- search "dónde se valida el captcha" [--k 8] [--kind code|test|doc|spec|commit] [--json]
npm run -s rag -- index [--rebuild]
npm run -s rag -- status
```

- `-s` silencia las cabeceras de npm para que la salida sea limpia.
- `search` actualiza el índice solo si detecta cambios; no hace falta ejecutar `index` antes.
- `index --rebuild` regenera todo (úsalo si cambias de modelo o sospechas de un índice corrupto).
- `--json` devuelve `path`, `start_line`, `end_line`, `kind`, `symbol`, `score` y `excerpt`.
- `AGENT_RAG_LEXICAL=1` omite el modelo de embeddings (más rápido, solo búsqueda léxica).

Ejemplo de salida:

```
1. apps/api/src/core/ports.ts:3-7  [code]  CaptchaVerifier  0.0303
     export interface CaptchaVerifier {
       verify(token: string, client_ip: string): Promise<boolean>
     }
```

## 3. Qué indexa

Los archivos versionados con `git ls-files` (respeta `.gitignore`), salvo `.agents/`, `.claude/`, lockfiles y binarios.

| Tipo     | Origen                                   | Fragmento                                          |
| -------- | ---------------------------------------- | -------------------------------------------------- |
| `code`   | `.ts`, `.tsx`, `.astro`, `.mjs`, config  | Declaración de primer nivel o ventana de 60 líneas |
| `test`   | `*.test.ts(x)`, `e2e/`                   | Cada caso `it` dentro de su `describe`             |
| `doc`    | `docs/`, `README.md`, `AGENTS.md`        | Sección `#`–`###` con su ruta de títulos           |
| `spec`   | `openspec/` (los archivados pesan menos) | Sección `#`–`###`                                  |
| `commit` | Últimos 200 commits                      | Asunto, cuerpo y archivos tocados                  |

## 4. Cómo funciona

1. **Troceado**: el código se parte con el AST de TypeScript; el Markdown por secciones, conservando los rangos de líneas.
2. **Léxico**: BM25 (MiniSearch) con un tokenizador que parte `camelCase`, `snake_case` y rutas, y descarta palabras vacías en español e inglés.
3. **Semántico**: embeddings locales en proceso (`Xenova/multilingual-e5-small`) y similitud coseno.
4. **Fusión**: Reciprocal Rank Fusion de ambos rankings.
5. **Índice**: `.cache/agent-rag/index.json` (ignorado por git). Se actualiza por hash de contenido de archivo: solo se re-trocea y se re-embebe lo que cambió.

## 5. Límites y problemas frecuentes

| Síntoma                                           | Causa y solución                                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| La primera ejecución tarda ~1,5 min               | Indexa ~1000 fragmentos en CPU y descarga el modelo (~120 MB) a `.cache/agent-rag/models/`. Solo ocurre una vez. |
| `⚠ semantic search unavailable`                   | No se pudo cargar el modelo (p. ej. sin red la primera vez). Los resultados son solo léxicos; reintenta con red. |
| Resultados raros tras cambiar de modelo           | `npm run -s rag -- index --rebuild`.                                                                             |
| Un archivo nuevo no aparece                       | Solo se indexan archivos versionados: haz `git add` primero.                                                     |
| Una consulta con el nombre exacto no lo encuentra | Usa `rg`; la búsqueda semántica no sustituye a la exacta.                                                        |
