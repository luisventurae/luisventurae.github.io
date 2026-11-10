# Entorno local

## Índice

1. [Requisitos](#1-requisitos)
2. [Arranque con Docker Compose](#2-arranque-con-docker-compose)
3. [Servicios](#3-servicios)
4. [RAG local](#4-rag-local)
5. [Sin Docker](#5-sin-docker)
6. [Problemas frecuentes](#6-problemas-frecuentes)

## 1. Requisitos

- Docker con Compose v2.
- ~8 GB libres para los modelos de Ollama (`bge-m3` ≈ 1.2 GB, `qwen3:4b-instruct` ≈ 2.5 GB).
- Opcional: Node 24.22.2 (`.nvmrc`) para trabajar sin Docker.

## 2. Arranque con Docker Compose

```bash
docker compose up            # web, api, ollama, mailpit (+ descarga de modelos la primera vez)
docker compose --profile tools run --rm rag-ingest   # carga el índice del RAG
```

No hace falta ningún secreto: ver [`security.md` › Desarrollo local](security.md#4-desarrollo-local). Para cambiar modelos, copia `.env.example` a `.env`.

## 3. Servicios

| Servicio      | URL                      | Qué hace                                                                                                           |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `web`         | http://localhost:4321    | Astro en modo dev con HMR.                                                                                         |
| `api`         | http://localhost:8787    | Worker con `wrangler dev`; KV y R2 emulados y persistidos en el volumen `wrangler_state`; siembra el CV de prueba. |
| `mailpit`     | http://localhost:8025    | Bandeja donde llegan las notificaciones del formulario.                                                            |
| `ollama`      | interno (`ollama:11434`) | Servidor de modelos. No se expone para no chocar con un Ollama instalado en el host.                               |
| `ollama-pull` | —                        | Descarga los modelos una vez y termina.                                                                            |
| `deps`        | —                        | `npm ci` dentro del contenedor (volumen `node_modules`).                                                           |
| `rag-ingest`  | —                        | Perfil `tools`: trocea el contenido, genera embeddings y los carga en la API.                                      |

## 4. RAG local

1. `docker compose up` y espera a que `ollama-pull` termine.
2. `docker compose --profile tools run --rm rag-ingest`.
3. Abre http://localhost:4321, ve a la terminal y escribe `ask ¿con qué bases de datos has trabajado?`.

Repite el paso 2 cada vez que cambie el contenido de `apps/web/src/content/`.

## 5. Sin Docker

```bash
npm install
ollama pull bge-m3 && ollama pull qwen3:4b-instruct
cp apps/api/.dev.vars.example apps/api/.dev.vars
npm run dev                  # api en :8787 y web en :4321
npm run ingest -w packages/rag-ingest
```

## 6. Problemas frecuentes

| Síntoma                                  | Solución                                                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `EACCES` en `node_modules`               | `docker compose down -v` para recrear los volúmenes con el propietario correcto. |
| `ask` responde que el RAG no está activo | Ejecuta el ingest (paso 2) y comprueba `RAG_ENABLED=true` en el servicio `api`.  |
| Respuestas lentas                        | Usa un modelo más pequeño en `.env` (`RAG_CHAT_MODEL=llama3.2:1b`).              |
