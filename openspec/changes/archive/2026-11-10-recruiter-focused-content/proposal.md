# Proposal

## Why

El portafolio se presenta como "Full Stack Web Engineer" con el motion al frente, pero el objetivo es conseguir un puesto **backend Node.js, remoto o híbrido en Perú**. Un reclutador revisa la página en 6–10 segundos y hoy no encuentra lo que busca:

- años de experiencia;
- empleo actual (Prestamype desde 2024-06);
- disponibilidad;
- historial laboral;
- resultados por proyecto.

Además, el perfil solo se lee desde la terminal, y el proyecto más reciente visible es de 2023.

## What Changes

- **Posicionamiento**: el rol pasa a "Backend Engineer · Node.js" en el hero, los metadatos, las imágenes OG y el JSON-LD. El frontend y el motion quedan como complemento.
- **Datos clave fijos en el hero**: años de experiencia (calculados desde 2019-01, sin editar a mano), stack principal y disponibilidad (remoto/híbrido, Perú). No rotan y se leen sin JavaScript.
- **Secciones nuevas**:
  - "Sobre mí", que renderiza el perfil;
  - "Experiencia", una línea de tiempo con empresa, modalidad (fulltime, part time, freelance), fechas y proyectos.
- **Nuevo orden de secciones**: Sobre mí → Experiencia → Proyectos → Stack → CV → Terminal.
- **Stack por nivel de uso**: el nivel numérico autoevaluado (1–10) se reemplaza por tres niveles: "uso diario", "en producción" y "explorando". Se añaden AWS CDK, microservicios, arquitectura hexagonal, chatbots y Claude Code, y se retiran tecnologías residuales.
- **Proyectos como casos de estudio**: contexto, reto, rol, decisiones y resultado, con proyectos destacados. Se añade "Este portafolio" como proyecto.
- **Juego "Match de vacante"** antes del formulario del CV: el reclutador marca los requisitos de su vacante, ve un porcentaje de coincidencia honesto con pruebas concretas y puede saltar directo al formulario.
- **BREAKING (API)**: `POST /contact` ya no devuelve la URL de descarga. Envía al email del reclutador un enlace firmado de 7 días (el PDF sigue en R2), con límite por destinatario. Acepta `interests` opcionales, que se incluyen en la notificación al dueño.
- **Proveedor de correo**: Resend reemplaza a Cloudflare Email Routing, que solo permite enviar a destinos verificados.
- **Rebuild anual programado**, para que los años de experiencia se actualicen sin intervención.

## Capabilities

### New Capabilities

- `career-profile`: presentación profesional del autor:
  - sección "Sobre mí";
  - línea de tiempo de experiencia laboral;
  - años de experiencia calculados desde el inicio de su carrera.
- `vacancy-match`: juego opcional que compara los requisitos de una vacante con el perfil y conduce al formulario del CV.

### Modified Capabilities

- `hero`: el rol pasa a Backend Engineer, aparece la línea fija de datos clave y disponibilidad, y los roles rotativos pasan a ser complementarios.
- `site-shell`: orden de secciones de la página principal.
- `stack-map`: peso visual por nivel de uso en lugar de nivel numérico.
- `projects-showcase`: proyectos destacados y estructura de caso de estudio.
- `contact-api`: entrega del CV por correo con un enlace firmado de 7 días, límite por destinatario, campo `interests` y notificación ampliada.
- `delivery-pipeline`: despliegue programado anual.

## Impact

- **Web (`apps/web`)**:
  - `data/` (site, skills, projects, experiencia y requisitos nuevos);
  - `content/` (perfil, proyectos, colección nueva de experiencia);
  - `i18n/{es,en,fr}`;
  - componentes: Hero, StackMap, ProjectGrid, ContactForm, y los nuevos ExperienceTimeline y VacancyMatch;
  - `HomePage.astro`, `Nav.astro`, imágenes OG;
  - E2E.
- **Shared (`packages/shared`)**: `ContactRequestSchema` (`interests`), `ContactResponseSchema` (`{ status: 'sent' }`) y el enum de requisitos.
- **API (`apps/api`)**:
  - `core/contact.ts`;
  - el puerto `EmailSender`;
  - el adaptador Resend (nuevo), Mailpit para cualquier destinatario y un error nuevo `email_failed`;
  - `config.ts` (`RESEND_API_KEY`, `EMAIL_TRANSPORT`);
  - `wrangler.toml` (se elimina el binding `send_email`).
- **Infra**:
  - cuenta de Resend con dominio verificado (SPF/DKIM);
  - secret `RESEND_API_KEY`;
  - cron anual en `.github/workflows/deploy.yml`.
- **Docs**: deployment, security, architecture, branding, design-system.
