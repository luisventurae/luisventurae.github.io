# Entorno local

## Índice

1. [Requisitos](#1-requisitos)
2. [Arranque con Docker Compose](#2-arranque-con-docker-compose)
3. [Servicios](#3-servicios)
4. [Sin Docker](#4-sin-docker)
5. [Problemas frecuentes](#5-problemas-frecuentes)

## 1. Requisitos

- Docker con Compose v2.
- Opcional: Node 24.22.2 (`.nvmrc`) para trabajar sin Docker.

## 2. Arranque con Docker Compose

```bash
docker compose up            # web, api, mailpit
```

No hace falta ningún secreto: ver [`security.md` › Desarrollo local](security.md#4-desarrollo-local). Para cambiar valores públicos, copia `.env.example` a `.env`.

## 3. Servicios

| Servicio  | URL                   | Qué hace                                                                                                           |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `web`     | http://localhost:4321 | Astro en modo dev con HMR.                                                                                         |
| `api`     | http://localhost:8787 | Worker con `wrangler dev`; KV y R2 emulados y persistidos en el volumen `wrangler_state`; siembra el CV de prueba. |
| `mailpit` | http://localhost:8025 | Bandeja donde llegan las notificaciones del formulario.                                                            |
| `deps`    | —                     | `npm ci` dentro del contenedor (volumen `node_modules`).                                                           |

## 4. Sin Docker

```bash
npm install
cp apps/api/.dev.vars.example apps/api/.dev.vars
npm run dev                  # api en :8787 y web en :4321
```

## 5. Problemas frecuentes

| Síntoma                    | Solución                                                                         |
| -------------------------- | -------------------------------------------------------------------------------- |
| `EACCES` en `node_modules` | `docker compose down -v` para recrear los volúmenes con el propietario correcto. |
