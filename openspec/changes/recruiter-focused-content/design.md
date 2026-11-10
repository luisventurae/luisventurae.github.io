# Design

## Context

Estado actual relevante (ver `proposal.md` › Why para la motivación):

- **Contenido**: colecciones de Astro `projects` y `profile` en `apps/web/src/content/`. Los datos que no dependen del idioma viven en `src/data/` (`projects.ts`, `skills.ts`, `site.ts`). `loadProfile` solo alimenta la terminal y el índice de búsqueda.
- **Stack**: `skills.ts` guarda un `level` de 1 a 10. `StackMap.chipSize()` decide el peso visual a partir de ese nivel, y `HomePage.astro` lo usa para `knows_about` (`level >= 6`).
- **API** (Hono en Workers, hexagonal):
  - `submitContactRequest` hace captcha → rate limit por IP (KV, `createKvRateLimiter` con una política fija) → firma el token (10 min) → `notifyOwner` → devuelve `download_url`;
  - el PDF vive en R2 (`createR2CvStorage`, clave `cv/<locale>.pdf`) y se sirve en `/cv/:token`;
  - el correo sale por el binding `send_email` (Cloudflare Email Routing), que solo puede enviar a destinos verificados.
- **Web estática** en GitHub Pages. Todo se renderiza en build, y el deploy corre en cada push a `master` o con `workflow_dispatch`.

## Goals / Non-Goals

**Goals:**

- Que los datos clave para un reclutador se lean sin JavaScript y sin interacción.
- Mantener la personalidad del sitio (motion con intención, enfoque Emil Kowalski) sin que oculte información.
- Que el CV llegue al correo del reclutador sin abrir un vector de spam.

**Non-Goals:**

- Redactar el detalle de Prestamype: queda para la siguiente fase, marcado como `TODO(content)`.
- Sustituir R2 como almacenamiento del CV o cambiar el flujo de descarga `/cv/:token`.
- Añadir analítica o un CRM de los intereses: solo viajan en la notificación al dueño.

## Decisions

### D1. Años de experiencia calculados en build + rebuild anual

`yearsOfExperience(start: 'YYYY-MM', now: Date)` es una función pura en `apps/web/src/lib/experience.ts`: meses completos / 12, redondeado hacia abajo. `CAREER_START` vive en `data/site.ts`. Los textos usan el token `{years}`, que se interpola en las cadenas de i18n y en el markdown del perfil dentro de `loadProfile`.

- **Por qué**: la web es estática, así que calcular en build no tiene coste ni provoca desajustes de hidratación. Como la carrera empieza en enero, la cifra solo cambia una vez al año, y un `schedule` anual (2 de enero) en `deploy.yml` la mantiene al día.
- **Alternativa descartada**: recalcular en el cliente. Añade JS al hero y produce un desajuste entre SSR e hidratación justo en el cambio de año.

### D2. Experiencia como colección, igual que proyectos

`data/experience.ts` guarda los datos que no dependen del idioma: `id`, `company`, `kind`, `start`, `end?`, `project_slugs`, `techs`. `content/experience/<locale>/<id>.md` guarda `role` y el resumen. `loadExperience(locale)` las une de la misma forma que `loadProjects`. `ExperienceTimeline.astro` es estático y reutiliza `formatPeriod`, con un "actualidad" localizado.

- **Por qué**: así se mantiene un solo patrón de contenido (los datos en TS tipado y el texto en markdown por idioma), y la línea de tiempo queda indexada en `search-index.json` para la terminal.

### D3. Niveles de uso en lugar de nivel numérico

En `Skill`, `level: number` se reemplaza por `tier: 'daily' | 'production' | 'exploring'`. `chipSize(tier)` y `knows_about` pasan a filtrar `tier !== 'exploring'`. La terminal (`skills`) muestra el tier localizado en lugar del número.

- **Por qué**: las autoevaluaciones numéricas eran inconsistentes (MongoDB 4 frente a Mongoose 9) y restan credibilidad. Tres niveles se explican solos.

### D4. Hero: datos fijos fuera de la rotación

La línea de datos clave y el badge de disponibilidad son HTML estático dentro del island del Hero, renderizados en SSR. La rotación solo afecta a los roles complementarios. Los stickers pasan a Node.js, AWS y TypeScript.

- **Motion**: no cambia el blur crossfade existente. El badge entra junto con la animación de entrada (CSS, sin bloquear la lectura).

### D5. "Match de vacante"

- **Datos**: `data/vacancy-match.ts` define `{ id, strength: 1 | 0.5 | 0, skill_ids }`. El enum de ids vive en `packages/shared` (`VACANCY_REQUIREMENT_IDS`) para que la web y la API validen lo mismo. Los textos de cada requisito y su prueba están en i18n.
- **Puntuación**: `matchScore(ids)` es una función pura (promedio × 100, redondeado). Es honesta a propósito: incluye requisitos parciales y no cumplidos para que el número sea creíble.
- **UI** (`components/cv/VacancyMatch.tsx`):
  - chips `<button aria-pressed>` con la clase `pressable`;
  - medidor animado con `transform: scaleX()` (solo transform, `transform-origin: left`) y el spring de `lib/motion.ts` con `bounce` 0.2. Es una interacción ocasional, así que admite animación;
  - porcentaje en `aria-live="polite"`;
  - con reduced motion, sin transición de escala;
  - pruebas reveladas con opacity + translateY(4px), `ease-out` 200 ms;
  - "Saltar al formulario" siempre visible.
- **Al revelar el formulario**: aparece debajo con `AnimatePresence` (opacity + y, 200 ms `ease-out`), el foco va al primer campo y se le pasan los `interests`.
- **Alternativas descartadas**: "Enruta el request" (demasiado técnico para reclutadores), raspa y descubre, memoria.

### D6. CV por correo con Resend; el PDF sigue en R2

- `ContactResponse` pasa a `{ status: 'sent' }`.
- `submitContactRequest` hace, en este orden:
  1. captcha;
  2. rate limit por IP (5 cada 10 min);
  3. rate limit por destinatario: `contact:to:<sha256(email en minúsculas)>`, 2 cada 24 h, con una segunda instancia de `createKvRateLimiter` y su propia política;
  4. firma del token (`DOWNLOAD_TTL_MS` = 7 días);
  5. `email.sendCvLink({ to, locale, download_url })`;
  6. `notifyOwner` con los intereses.
- `downloadCv` y el adaptador R2 no cambian.
- **Puerto**: `EmailSender` gana `sendCvLink(input)`. Las plantillas del correo al reclutador están en `core/cv-email.ts` (es/en/fr, texto plano), sin ningún campo libre del usuario.
- **Adaptadores**:
  - `createResendEmailSender({ api_key, from, owner })` hace `fetch` a `https://api.resend.com/emails`; un no-2xx lanza error;
  - Mailpit acepta cualquier destinatario;
  - se elimina `createCloudflareEmailSender` y el binding `send_email`, y las notificaciones al dueño también pasan por Resend (un solo proveedor).
- **Errores**: `email_failed` → 502, añadido a `API_ERROR_CODES` y a los mensajes de la web.
- **Config**: `EMAIL_TRANSPORT: 'resend' | 'mailpit'`, y `RESEND_API_KEY` es obligatorio cuando el transporte es `resend`. En producción, `assertProductionSafe` exige `resend`.
- **Por qué no devolver también la URL**: enviarla por correo verifica el email. Si además se devolviera, el formulario se podría saltar con un correo falso.
- **Alternativas descartadas**:
  - Cloudflare Email Service: era beta y su disponibilidad en la cuenta no está confirmada;
  - SES: necesita firma SigV4 y salir del sandbox.

### D7. Proyectos destacados y caso de estudio

- `ProjectMeta` gana `featured?: true`, y el esquema de contenido gana `role`.
- `ProjectGrid` aplica `sm:col-span-2` a los destacados.
- El drawer muestra el rol junto al período.
- El markdown sigue las secciones Contexto, Reto, Decisiones y Resultado.
- Nuevo slug `portfolio`, con `url` al repositorio y una captura generada con Playwright (o el placeholder de iniciales mientras tanto).

## Risks / Trade-offs

- [Un remitente nuevo cae en spam] → dominio verificado con SPF/DKIM/DMARC en Resend, texto plano sin enlaces de terceros y asunto claro.
- [Bombardeo de correos a terceros] → captcha + límite por IP + límite por destinatario (hash) + ningún texto libre en el cuerpo.
- [Cambio breaking de `ContactResponse`] → web y API viven en el mismo repo y comparten el esquema de `packages/shared`. Primero se despliega la API y después la web; durante unos minutos, la web antigua mostraría un error genérico.
- [Las cifras de los casos de estudio no existen aún] → `TODO(content)` visible en el repo, nunca en la página. El texto se redacta sin inventar números.
- [Un fallo en el cron anual deja los años desactualizados] → `workflow_dispatch` manual sigue disponible, y un test fija el cálculo.

## Migration Plan

1. Crear la cuenta de Resend, verificar el dominio de `EMAIL_FROM` y ejecutar `wrangler secret put RESEND_API_KEY --env production`.
2. Subir los PDF `cv/en.pdf` y `cv/fr.pdf` a R2 cuando existan; mientras tanto, el fallback a `es` funciona.
3. Merge a `master`: el deploy publica primero la API y después la web.
4. Rollback: revertir el merge. El binding `send_email` vuelve con el revert de `wrangler.toml`.

## Open Questions

- Cargos exactos en cada empresa y fechas de Pool Work Confort (contenido; no cambia ni la spec ni las tareas).
- Detalle y cifras de Prestamype (siguiente fase).
