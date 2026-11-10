# Seguridad y manejo de secretos

Este repositorio es **público**: se publica para mostrar cómo se construyó el portafolio. Todo lo que se commitea debe poder leerlo cualquiera, también en el historial de git.

## Índice

1. [Principios](#1-principios)
2. [Inventario de valores](#2-inventario-de-valores)
3. [Dónde vive cada secreto](#3-dónde-vive-cada-secreto)
4. [Desarrollo local](#4-desarrollo-local)
5. [CI/CD](#5-cicd)
6. [Código](#6-código)
7. [Si se filtra un secreto](#7-si-se-filtra-un-secreto)
8. [OWASP](#8-owasp)

## 1. Principios

- **Ningún secreto en el repositorio**, ni en código, ni en configuración, ni en tests, ni en documentación, ni en mensajes de commit.
- Solo se commitean **plantillas** (`.env.example`, `.dev.vars.example`) con valores vacíos o claramente falsos.
- Los secretos se cargan en tiempo de ejecución desde el gestor correspondiente (Cloudflare secrets, GitHub Actions secrets).
- **Mínimo privilegio**: cada token tiene solo los permisos que necesita.
- Datos personales (email del propietario, emails de quienes piden el CV) se tratan como secretos: no se commitean ni se registran en logs.

## 2. Inventario de valores

| Valor                                       | ¿Secreto?                | Notas                                                                                                                       |
| ------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY`                 | No                       | Clave pública de Turnstile, va en el HTML.                                                                                  |
| `PUBLIC_API_URL`                            | No                       | URL pública del Worker.                                                                                                     |
| `TURNSTILE_SECRET_KEY`                      | **Sí**                   | Cloudflare secret del Worker.                                                                                               |
| `DOWNLOAD_TOKEN_SECRET`                     | **Sí**                   | Firma HMAC de las URLs del CV. Mínimo 32 bytes aleatorios.                                                                  |
| `NOTIFY_EMAIL`                              | **Sí** (dato personal)   | Destino de las notificaciones. Cloudflare secret; nunca en `wrangler.toml`.                                                 |
| `ALLOWED_ORIGIN`                            | No                       | Origen permitido por CORS. Variable normal.                                                                                 |
| `CLOUDFLARE_API_TOKEN`                      | **Sí**                   | Solo en GitHub Actions (environment `production`), con permiso _Workers Scripts: Edit_ y _Workers KV / R2_ sobre la cuenta. |
| `CLOUDFLARE_ACCOUNT_ID`                     | Sensible                 | GitHub Actions secret.                                                                                                      |
| IDs de KV / nombre del bucket R2            | Sensible (no credencial) | GitHub Actions _variables_; se inyectan en el despliegue, el `wrangler.toml` del repo solo tiene marcadores.                |
| Claves de prueba de Turnstile (`1x0000…AA`) | No                       | Públicas y documentadas por Cloudflare; solo para local y CI.                                                               |

## 3. Dónde vive cada secreto

- **Producción (Worker)**: `wrangler secret put <NOMBRE> --env production`. Nunca en `[vars]`.
- **GitHub Actions**: _Settings › Environments › production › Secrets_. Los workflows que los usan declaran `environment: production`.
- **Local**: `.env` (raíz, para Docker Compose) y `apps/api/.dev.vars`, ambos ignorados por git.

## 4. Desarrollo local

- `docker compose up` funciona **sin ningún secreto real**: Turnstile usa las claves de prueba, el email va a Mailpit y el R2 es el emulado por Wrangler.
- `DOWNLOAD_TOKEN_SECRET` local tiene un valor por defecto marcado como `local-dev-only`; la API **se niega a arrancar en producción** si el secreto falta, mide menos de 32 caracteres o contiene `local-dev-only`.
- Nunca copiar valores de producción a archivos locales que puedan acabar commiteados.

## 5. CI/CD

- **gitleaks** se ejecuta en cada PR y push para detectar secretos.
- Workflows con `permissions` mínimos por job; acciones de terceros fijadas por SHA.
- Los PR usan `pull_request` (nunca `pull_request_target`), así los forks no acceden a secretos.
- Los secretos solo existen en jobs de despliegue sobre `master` con `environment: production`.
- Se recomienda activar en GitHub: _Secret scanning_ y _Push protection_.

## 6. Código

- La configuración se valida con zod al arrancar: si falta un secreto, error explícito sin imprimir su valor.
- Los logs nunca incluyen tokens, cabeceras de autorización, emails ni cuerpos de petición completos.
- Las comparaciones de firmas son de tiempo constante.
- Los errores devueltos al cliente son códigos genéricos; el detalle va solo al log del servidor.

## 7. Si se filtra un secreto

1. **Rotarlo de inmediato** en su origen (Cloudflare, GitHub). Borrar el commit no basta: el historial público ya lo expuso.
2. Actualizar el valor en el gestor de secretos y redesplegar.
3. Revisar logs de uso del secreto comprometido.
4. Documentar el incidente en el PR que lo corrige (sin incluir el valor).

## 8. OWASP

Referencias: [OWASP Top 10 (2021)](https://owasp.org/Top10/) y [ASVS](https://owasp.org/www-project-application-security-verification-standard/) nivel 1 como checklist. Cómo se cubre cada riesgo relevante:

| Riesgo OWASP                       | Medida en este proyecto                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 Broken Access Control          | CORS limitado a `ALLOWED_ORIGIN`; `/rag/*` no existe en producción; descarga del CV solo con token HMAC firmado y con expiración.                                                                                                                                     |
| A02 Cryptographic Failures         | HMAC-SHA-256 vía WebCrypto, secreto ≥ 32 bytes, comparación en tiempo constante; todo el tráfico por HTTPS (GitHub Pages y Workers).                                                                                                                                  |
| A03 Injection                      | Validación con zod de todo input (longitudes máximas, formatos); sin SQL; Markdown propio renderizado en build; salida de la terminal como texto, nunca `innerHTML`; prompt del RAG con el contexto delimitado y la pregunta tratada como dato.                       |
| A04 Insecure Design                | Specs con escenarios de abuso (captcha, rate limit, tokens manipulados) antes de implementar; casos de uso testeados con fakes.                                                                                                                                       |
| A05 Security Misconfiguration      | Cabeceras en la API (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, CSP `default-src 'none'`); en la web, CSP por `<meta>` (`default-src 'self'`, Turnstile y la API permitidos explícitamente) y `referrer` estricto; errores genéricos al cliente. |
| A06 Vulnerable Components          | `npm audit --audit-level=high` en CI, Dependabot para npm y GitHub Actions, acciones fijadas por SHA, lockfile commiteado.                                                                                                                                            |
| A07 Identification & Auth Failures | No hay cuentas de usuario; el abuso se controla con Turnstile verificado en servidor y rate limit por IP.                                                                                                                                                             |
| A08 Software & Data Integrity      | Despliegue solo desde CI sobre `master`; sin scripts de terceros salvo Turnstile (dominio fijo); sin `pull_request_target`.                                                                                                                                           |
| A09 Logging & Monitoring           | Logs estructurados de eventos de seguridad (captcha fallido, rate limit, token inválido) sin PII ni secretos.                                                                                                                                                         |
| A10 SSRF                           | La API no hace peticiones a URLs provistas por el usuario; los destinos (Turnstile, Ollama, Mailpit) vienen de configuración.                                                                                                                                         |

Límites adicionales: cuerpo de petición máximo 4 KB en `/contact` y 2 KB en `/rag/ask`; pregunta ≤ 500 caracteres.
