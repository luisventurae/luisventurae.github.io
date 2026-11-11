# Despliegue

## Índice

1. [Flujo de ramas](#1-flujo-de-ramas)
2. [Workflows](#2-workflows)
3. [Configuración de GitHub](#3-configuración-de-github)
4. [Configuración de Cloudflare](#4-configuración-de-cloudflare)
5. [Primer despliegue](#5-primer-despliegue)
6. [Rollback](#6-rollback)

## 1. Flujo de ramas

```
feat/* ──PR──▶ develop ──(CI verde)──▶ PR automático develop → master ──merge──▶ master ──▶ producción
```

- `develop` integra; `master` es producción. Nada se despliega desde otra rama.
- El merge del PR de release lo hace una persona.

## 2. Workflows

| Archivo          | Cuándo                                                                    | Qué hace                                                                                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`         | PR a `develop`/`master`, push a `develop`, y reutilizado por `deploy.yml` | gitleaks, `npm audit` (alto), Prettier, ESLint, TS 7, Vitest con cobertura, build de la web, bundle del Worker y Playwright.                                                                                                                                         |
| `release-pr.yml` | CI verde tras un push a `develop`                                         | Crea o actualiza el PR `develop → master` con la lista de commits.                                                                                                                                                                                                   |
| `deploy.yml`     | Push a `master`, manual, o cada 2 de enero (cron)                         | Repite CI; publica `apps/web/dist` en `gh-pages`; despliega el Worker solo si cambió `apps/api`, `packages/shared` o el lockfile. El cron anual solo reconstruye la web para que los años de experiencia (calculados en el build desde 2019-01) se actualicen solos. |
| `dependabot.yml` | Semanal                                                                   | Actualizaciones de npm y de acciones contra `develop`.                                                                                                                                                                                                               |

Todas las acciones de terceros están fijadas por SHA y cada job declara `permissions` mínimos.

## 3. Configuración de GitHub

En **Settings › Environments › production**:

| Tipo   | Nombre                  | Valor                                                                                                      |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Secret | `CLOUDFLARE_API_TOKEN`  | Token con _Workers Scripts: Edit_, _Workers KV Storage: Edit_, _Workers R2 Storage: Edit_ sobre la cuenta. |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | ID de la cuenta de Cloudflare.                                                                             |

En **Settings › Secrets and variables › Actions › Variables** (repositorio):

| Variable                    | Ejemplo                                          | Uso                                           |
| --------------------------- | ------------------------------------------------ | --------------------------------------------- |
| `PUBLIC_API_URL`            | `https://portfolio-api.<subdominio>.workers.dev` | URL pública del Worker, usada por la web.     |
| `PUBLIC_TURNSTILE_SITE_KEY` | clave de sitio de Turnstile                      | Pública, va en el HTML.                       |
| `RATE_LIMIT_KV_ID`          | id del namespace KV                              | Se inyecta en `wrangler.toml` al desplegar.   |
| `CV_BUCKET_NAME`            | `portfolio-cv`                                   | Bucket R2 del CV.                             |
| `EMAIL_FROM`                | `cv@tu-dominio`                                  | Remitente en un dominio verificado en Resend. |

Las variables `PUBLIC_*` se validan con zod al compilar la web (`apps/web/src/lib/public-env.ts`): si una está definida pero vacía o no es válida, el build de despliegue falla con `Invalid public env: <NOMBRE>` en lugar de publicar una web que apunte a `localhost`. El build de comprobación de `ci.yml` no las usa: compila con los mismos valores de prueba que el e2e.

Opcional: secret `RELEASE_PR_TOKEN` (token _fine-grained_ con permiso de PR) para que el PR de release dispare CI; con `GITHUB_TOKEN` el PR se crea pero GitHub no ejecuta workflows sobre él.

Recomendado (no lo configura el repositorio):

- **Branch protection** en `master` y `develop`: exigir los checks de CI y PR para mergear.
- **Secret scanning** y **Push protection** activados.
- **Settings › Pages**: fuente _Deploy from a branch_, rama `gh-pages`, carpeta `/`.

## 4. Configuración de Cloudflare

```bash
cd apps/api
npx wrangler kv namespace create RATE_LIMIT_KV          # → RATE_LIMIT_KV_ID
npx wrangler r2 bucket create portfolio-cv              # → CV_BUCKET_NAME
npx wrangler r2 object put portfolio-cv/cv/es.pdf --file ./CV-es.pdf --remote
npx wrangler r2 object put portfolio-cv/cv/en.pdf --file ./CV-en.pdf --remote
npx wrangler r2 object put portfolio-cv/cv/fr.pdf --file ./CV-fr.pdf --remote

npx wrangler secret put TURNSTILE_SECRET_KEY --env production
npx wrangler secret put DOWNLOAD_TOKEN_SECRET --env production   # openssl rand -base64 48
npx wrangler secret put NOTIFY_EMAIL --env production
npx wrangler secret put RESEND_API_KEY --env production         # clave de envío de Resend
```

- **Resend**: verifica el dominio de `EMAIL_FROM` añadiendo en tu DNS los registros SPF, DKIM y (recomendado) DMARC que indica Resend. Crea una API key con permiso solo de envío (_sending access_) para ese dominio. Resend envía tanto el CV al reclutador como la notificación a `NOTIFY_EMAIL`.
- El CV vive en el bucket R2 privado (`cv/<locale>.pdf`). El correo lleva un enlace firmado a `/cv/:token` que vence a los 7 días.
- **Turnstile**: un sitio con dominio `luisventurae.github.io`.
- Si falta un CV en algún idioma, la API sirve el español.

La API valida la configuración al arrancar y se niega a funcionar en producción con secretos de desarrollo o Mailpit (ver [`security.md`](security.md)).

## 5. Primer despliegue

1. Configura GitHub y Cloudflare (secciones 3 y 4).
2. Ejecuta **Actions › Deploy › Run workflow** sobre `master` para desplegar API y web juntas.
3. Comprueba `https://<worker>/health` y el formulario en el sitio publicado.

## 6. Rollback

- **Web**: revierte el commit en `master` (o vuelve a ejecutar Deploy sobre un commit anterior); `gh-pages` se regenera.
- **API**: `npx wrangler rollback --env production` desde `apps/api`, o revierte y vuelve a desplegar.
