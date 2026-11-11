# Luis Ventura E — Portafolio

Hola, soy Luis, Backend Engineer especializado en Node.js. Este repositorio es mi portafolio y también una muestra de cómo trabajo: el código, las decisiones y el historial están a la vista.

**En vivo:** [luisventurae.github.io](https://luisventurae.github.io) · ES / EN / FR

## Qué puedes tocar

- **Arrastra mi nombre**: cada letra vuelve a su sitio con un muelle.
- **Elige una tecnología** del stack y mira qué proyectos la usan.
- **Abre un proyecto** y desliza para pasar al siguiente (o usa ← →).
- **Abre la terminal** con la tecla `` ` `` y prueba `help`, `cat ticker` o `ask ¿qué bases de datos usas?`.

## Qué demuestra este repositorio

| Habilidad                                                               | Dónde verla                                                                                   |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Interfaces con motion cuidado (springs, gestos, reduced motion)         | [`apps/web/src/components`](apps/web/src/components), [design system](docs/design-system.md)  |
| Arquitectura hexagonal ligera y SOLID en el backend                     | [`apps/api/src/core`](apps/api/src/core) (casos de uso) y [`adapters`](apps/api/src/adapters) |
| TDD + E2E + auditoría de accesibilidad                                  | `*.test.ts(x)` junto al código, [`apps/web/e2e`](apps/web/e2e)                                |
| Seguridad en un repo público (OWASP, CSP, URLs firmadas, cero secretos) | [`docs/security.md`](docs/security.md)                                                        |
| SEO técnico: hreflang, Open Graph, JSON-LD para rich results            | [`apps/web/src/layouts/Base.astro`](apps/web/src/layouts/Base.astro)                          |
| Desarrollo guiado por especificaciones                                  | [`openspec/`](openspec)                                                                       |
| CI/CD `develop → master` con despliegue a GitHub Pages y Cloudflare     | [`.github/workflows`](.github/workflows)                                                      |

## Stack

Astro + islas de React 19 · TypeScript 7 · Tailwind CSS v4 · Motion · Vaul — Cloudflare Workers + Hono · KV · R2 — Vitest · Playwright · axe — npm workspaces · Docker Compose · OpenSpec.

## Correrlo en local

Necesitas Docker. No hace falta ningún secreto.

```bash
docker compose up   # web :4321 · api :8787 · correo :8025
```

Sin Docker: `npm install && npm run dev` (detalles en [`docs/local-environment.md`](docs/local-environment.md)).

```bash
npm run verify     # formato, lint, tipos y tests con cobertura
npm run test:e2e   # Playwright contra el build de producción
```

## Documentación

Todo lo técnico está en [`docs/`](docs/README.md): reglas de desarrollo, arquitectura, branding, seguridad y despliegue.

## Licencia

[MIT](LICENSE)
