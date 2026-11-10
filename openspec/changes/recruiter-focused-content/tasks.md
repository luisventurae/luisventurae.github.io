# Tasks

Cada grupo es un commit (Conventional Commits, sin trailers de atribución) y se cierra con `npm run verify` en verde. Si el grupo toca la web, también con `npm run test:e2e`.

## 1. Propuesta (`docs(openspec): propose recruiter-focused-content`)

- [x] 1.1 Escribir proposal, specs, design y tasks; verificar con `openspec validate recruiter-focused-content --strict`

## 2. Años de experiencia (`feat(web): compute years of experience from career start`)

- [x] 2.1 TDD de `yearsOfExperience` en `apps/web/src/lib/experience.ts` (2019-01 → 2026-11-10 = 7; 2027-01-01 = 8; mes incompleto no suma); verificar con `npm test`
- [x] 2.2 Añadir `CAREER_START` a `data/site.ts` (la disponibilidad vive en i18n) y `careerYears()` a `lib/experience.ts`; interpolar `{years}` en `loadProfile` mediante `interpolateYears` (con tests en `experience.test.ts`); verificar con `npm test`
- [x] 2.3 Corregir `asu-cuenta` en `data/projects.ts` a 2019-01 → 2019-08 y ajustar `projects.test.ts` si fija fechas; verificar con `npm test`

## 3. Hero y metadatos (`feat(web): position hero and metadata as backend engineer`)

- [x] 3.1 Hero: línea fija de datos clave con `{years}` y badge de disponibilidad, roles complementarios en es/en/fr y stickers Node.js/AWS/TypeScript; test en `Hero.test.tsx` que confirme que los datos fijos no cambian al avanzar la rotación; verificar con `npm test`
- [x] 3.2 `PERSON.job_title = 'Backend Engineer · Node.js'`, `meta.title` y `meta.description` en es/en/fr, `jobTitle` del JSON-LD (`seo.test.ts`), y regenerar las imágenes OG con `apps/web/scripts/generate-og.mjs`; verificar con `npm test` y comprobando visualmente `public/og/*.png`
- [x] 3.3 E2E: el hero muestra "7 años", Node.js y la disponibilidad con JavaScript desactivado (`shell.spec.ts`); verificar con `npm run test:e2e`
- [x] 3.4 Actualizar el rol y la esencia en `docs/branding.md`; verificar que `rg "Full Stack Web Engineer" apps docs` solo devuelve menciones históricas
- [x] 3.5 Pasada de motion con el enfoque Emil Kowalski (pedida durante la implementación): coreografía `hero-fade` para el texto de apoyo del hero, crossfade del rol más corto y transición `ease` en los enlaces de la línea de tiempo; verificar con capturas a 150/400 ms y `npm run test:e2e`

## 4. Sobre mí y Experiencia (`feat(web): add about and experience sections`)

- [x] 4.1 Reescribir `content/profile/{es,en,fr}.md`:
  - qué hace (backend Node.js, microservicios, AWS CDK, arquitectura hexagonal, chatbots);
  - qué busca (backend Node.js, remoto o híbrido, Perú);
  - idiomas.

  Verificar que el primer párrafo sigue sirviendo para `whoami` (test de terminal).

- [x] 4.2 Colección `experience`:
  - esquema con `role` en `content.config.ts`;
  - `data/experience.ts`: Prestamype (full-time, 2024-06 → actual, `TODO(content)`), Securitec (full-time, 2019-09 → 2023-10), Asu Cuenta (full-time, 2019-01 → 2019-08), Pool Work Confort (part-time, fechas `TODO(content)`), Instituto Cepeban (freelance), Busconsulting (freelance);
  - markdown es/en/fr;
  - `loadExperience` con test de orden cronológico inverso.

  Verificar con `npm test`.

- [x] 4.3 `ExperienceTimeline.astro` y la sección "Sobre mí" en `HomePage.astro`, con el nuevo orden de secciones y la `Nav` alineada; i18n de los títulos, modalidad y "actualidad"; verificar con `npm run build -w apps/web`
- [x] 4.4 Incluir la experiencia en `search-documents.ts` (test existente ampliado) y quitar Facebook de `SOCIAL_LINKS`; verificar con `npm test`
- [x] 4.5 E2E: orden de secciones y de la navegación en `/` y `/fr/`, primera entrada Prestamype con "actualidad" y Cepeban como freelance; verificar con `npm run test:e2e`
- [x] 4.6 Documentar la colección de experiencia en `docs/architecture.md` y los componentes en `docs/design-system.md`; verificar los enlaces del índice de `docs/README.md`

## 5. Stack por niveles (`refactor(web): group stack by usage tier`)

- [x] 5.1 Reemplazar `level` por `tier` en `data/skills.ts`:
  - añadir `aws-cdk`, `microservices`, `hexagonal-architecture`, `chatbots` y `claude-code`;
  - AWS pasa a `daily`;
  - quitar Solidity, Spring Boot, cPanel y Heroku.

  Verificar con `npm run typecheck`.

- [x] 5.2 `StackMap`: `chipSize(tier)` con leyenda localizada de los 3 niveles, y `knows_about` con `tier !== 'exploring'`; tests en `StackMap.test.tsx`; verificar con `npm test`
- [x] 5.3 Terminal `skills`: mostrar el tier localizado en lugar del número (`commands.test.ts`); verificar con `npm test`
- [x] 5.4 Actualizar `docs/design-system.md` (chips por tier); verificar con `npm run format:check`

## 6. Casos de estudio (`feat(web): restructure projects as case studies`)

- [ ] 6.1 Añadir `featured` a `ProjectMeta` y `role` al esquema de proyectos; el drawer muestra el rol; `ProjectGrid` da doble ancho a los destacados (test en `ProjectGrid.test.tsx`); verificar con `npm test`
- [ ] 6.2 Reescribir los 7 proyectos en es/en/fr con Contexto, Reto, Decisiones y Resultado, marcando las cifras desconocidas con `TODO(content)` en comentarios; verificar con `npm run build -w apps/web`
- [ ] 6.3 Proyecto nuevo `portfolio` (destacado, con `url` al repo y textos es/en/fr) con captura generada con Playwright o el placeholder; Ticker destacado; verificar con `npm run test:e2e` (el JSON-LD `ItemList` coincide con las tarjetas)

## 7. CV por correo (`feat(api): email the CV link via Resend with per-recipient limit`)

- [ ] 7.1 `packages/shared`: `VACANCY_REQUIREMENT_IDS`, `interests` opcional (máx. 12) en `ContactRequestSchema`, `ContactResponseSchema = { status: 'sent' }` y `email_failed` en `API_ERROR_CODES`; tests en `contact.test.ts`; verificar con `npm test`
- [ ] 7.2 TDD de `core/contact.ts`:
  - límite por destinatario con hash;
  - TTL de 7 días;
  - `sendCvLink` con la URL;
  - el correo no contiene `company`;
  - `email_failed` → 502;
  - notificación al dueño con intereses y sin bloquear;
  - plantillas en `core/cv-email.ts`.

  Verificar con `npm test`.

- [ ] 7.3 Adaptadores: `createResendEmailSender` (tests con fetch falso: payload, cabecera Bearer, error en no-2xx) y Mailpit para cualquier destinatario; eliminar el sender de Cloudflare; verificar con `npm test`
- [ ] 7.4 `config.ts` (`resend` | `mailpit`, `RESEND_API_KEY` obligatorio con resend y en producción), `main.ts` (segunda política de rate limit), `wrangler.toml` sin `send_email`, `.dev.vars.example`; tests de config; verificar con `npm test` y `npm run typecheck`
- [ ] 7.5 Web: `api-client.ts` y `ContactForm.tsx` con éxito "Revisa tu correo" y mensaje `email_failed` en es/en/fr; eliminar `startDownload` y `download_again` (`knip` limpio); verificar con `npm run verify`
- [ ] 7.6 Actualizar `docs/deployment.md` (Resend, DNS SPF/DKIM, secret), `docs/security.md` (secretos, límite por destinatario) y `docs/architecture.md` (flujo de contacto); verificar que los pasos documentados coinciden con `wrangler.toml`

## 8. Match de vacante (`feat(web): add vacancy match game before the CV form`)

- [ ] 8.1 TDD de `lib/vacancy-match.ts` (`matchScore`: 100 + 50 = 75, vacío → null) y `data/vacancy-match.ts` con textos y pruebas en es/en/fr; verificar con `npm test`
- [ ] 8.2 `VacancyMatch.tsx`:
  - chips con `aria-pressed`;
  - pruebas reveladas;
  - medidor con `scaleX` y spring;
  - `aria-live`;
  - reduced motion;
  - "Saltar al formulario" con foco al primer campo;
  - se pasan los `interests` a `ContactForm`.

  Tests en `VacancyMatch.test.tsx`; verificar con `npm test`.

- [ ] 8.3 Integrar el juego en la sección CV de `HomePage.astro`, con E2E en `interactions.spec.ts` (seleccionar, ver 75%, saltar, enviar con `interests` en el body); verificar con `npm run test:e2e`
- [ ] 8.4 Revisar el motion con el skill `review-animations` y aplicar lo que salga; documentar el medidor y los chips en `docs/design-system.md`; verificar con `npm run verify`

## 9. Rebuild anual (`ci: rebuild yearly to refresh years of experience`)

- [ ] 9.1 Añadir `schedule: cron '0 12 2 1 *'` a `.github/workflows/deploy.yml`, comprobando que los jobs (incluido el filtro de cambios de la API) se comportan bien con el evento `schedule`; documentarlo en `docs/deployment.md`; verificar con `actionlint` o revisando el YAML y lanzando `workflow_dispatch` después del merge

## 10. Verificación integral

- [ ] 10.1 Con `docker compose up`: completar el juego y el formulario, ver en Mailpit el correo al reclutador (enlace de 7 días, sin la empresa) y la notificación al dueño con intereses, y descargar el PDF desde R2 local
- [ ] 10.2 Capturas en es, en y fr, en móvil y escritorio, con el skill `run`, para revisar el hero, la línea de tiempo y el juego

## Workflow follow-up

- Completar los `TODO(content)`: Prestamype, cargos, fechas de Pool Work, cifras y PDF del CV en EN/FR en R2.
- Configurar Resend y el secret antes del merge a `master`.
- Archivar el cambio con `/opsx:archive` tras el despliegue.
