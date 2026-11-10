# Tasks

## 1. Paquete y núcleo de troceado

- [x] 1.1 Crear el workspace `packages/agent-rag` (package.json, tsconfig, vitest) y el script `rag` raíz — verificar: `npm install`, `npm run typecheck`
- [x] 1.2 Tests rojos y troceador de TypeScript por declaración con rango de líneas y `kind` code/test — verificar: `npx vitest run packages/agent-rag`
- [x] 1.3 Tests rojos y troceador de Markdown por sección con rango de líneas (docs y specs) y de commits — verificar: `npx vitest run packages/agent-rag`

## 2. Búsqueda e índice

- [x] 2.1 Tests rojos y búsqueda híbrida: BM25 con tokenizador de identificadores, coseno con `Embedder` fake y fusión RRF; filtro por `kind` — verificar: `npx vitest run packages/agent-rag`
- [x] 2.2 Tests rojos y constructor de índice incremental por hash de archivo, con puertos `FileSource`, `Embedder`, `IndexStore` y fakes — verificar: `npx vitest run packages/agent-rag`

## 3. Adaptadores y CLI

- [x] 3.1 Adaptadores `git-file-source` y `json-index-store` con tests — verificar: `npx vitest run packages/agent-rag`
- [x] 3.2 Adaptador `transformers-embedder` (modelo en `.cache/agent-rag/models/`), `allowScripts` si hace falta — verificar: `npm install`, `npm run lint:unused`
- [x] 3.3 `cli.ts`: `search`, `index`, `status`, salida compacta y `--json`, refresco automático y degradación a solo BM25 con aviso — verificar: ejecutar los escenarios de la spec a mano

## 4. Documentación y cierre

- [x] 4.1 Crear `docs/agent-rag.md`; actualizar `docs/README.md`, `docs/architecture.md`, `AGENTS.md` y `CLAUDE.md` (cuándo `rag`, cuándo `rg`) — verificar: enlaces resuelven
- [ ] 4.2 Ejecución final — verificar: `npm run verify`, `openspec validate add-agent-rag --strict`, y archivar
