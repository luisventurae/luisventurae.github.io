# Reglas de desarrollo

Convenciones obligatorias del monorepo. Si una regla no aplica a un caso concreto, la excepción se documenta aquí antes de usarla.

## Índice

1. [Nombres](#1-nombres)
2. [Tipado estricto](#2-tipado-estricto)
3. [Funciones](#3-funciones)
4. [SOLID y arquitectura del backend](#4-solid-y-arquitectura-del-backend) (hexagonal ligera)
5. [Monorepo](#5-monorepo)
6. [Formato y lint](#6-formato-y-lint)
7. [TDD y pruebas](#7-tdd-y-pruebas)
8. [Idioma](#8-idioma)
9. [Documentación](#9-documentación)
10. [Branding y sistema de diseño](#10-branding-y-sistema-de-diseño)
11. [Accesibilidad y motion](#11-accesibilidad-y-motion)
12. [Git y commits](#12-git-y-commits)
13. [Especificaciones con OpenSpec](#13-especificaciones-con-openspec)
14. [Repositorio público: secretos](#14-repositorio-público-secretos)

---

## 1. Nombres

| Elemento                                      | Convención         | Ejemplo                            |
| --------------------------------------------- | ------------------ | ---------------------------------- |
| Variables, parámetros, propiedades locales    | `snake_case`       | `project_list`, `user_email`       |
| Funciones y métodos                           | `camelCase`        | `getProjects()`, `sendEmail()`     |
| Clases, interfaces, tipos, enums, componentes | `PascalCase`       | `ProjectDrawer`, `EmailSender`     |
| Constantes de módulo inmutables               | `UPPER_SNAKE_CASE` | `RAG_TOP_K`, `MAX_ATTEMPTS`        |
| Archivos de componentes (`.tsx`, `.astro`)    | `PascalCase`       | `ProjectDrawer.tsx`, `Base.astro`  |
| Resto de archivos                             | `kebab-case`       | `chunk-text.ts`, `rate-limiter.ts` |

- Los tipos e interfaces no llevan prefijos (`Project`, no `IProject` ni `TProject`).
- Una variable o parámetro que contiene una función (callbacks, handlers de React) se nombra como función: `const handleClick = () => …`, `createApp(resolveDeps)`.
- Los componentes de React son funciones pero se nombran en `PascalCase` (JSX lo exige).
- Los schemas de zod describen tipos y se nombran como tipos con sufijo `Schema`: `ContactRequestSchema`.
- **Excepciones permitidas**: claves impuestas por APIs externas (`'cf-turnstile-response'`), props de librerías (`className`, `onClick`), rutas y archivos que el framework exige (`[lang]/index.astro`, `content.config.ts`, `wrangler.toml`), variables de entorno (`PUBLIC_API_URL`).
- La regla `@typescript-eslint/naming-convention` hace cumplir esta tabla.

## 2. Tipado estricto

- `strict: true` y `noUncheckedIndexedAccess: true` en todos los workspaces.
- Prohibido `any`. Usar `unknown` y estrechar con guards o zod.
- Las funciones exportadas declaran su tipo de retorno.
- Todo dato que cruza una frontera (contenido markdown, request/response HTTP, variables de entorno, respuestas de Ollama) se valida con un schema de zod.
- **TypeScript 7** (`tsc` nativo) es el verificador de tipos (`npm run typecheck`). Como TS 7 todavía no expone API de JavaScript, las herramientas que la necesitan (typescript-eslint, astro check) usan `@typescript/typescript6` instalado bajo el nombre `typescript`; TS 7 vive en el alias `typescript7`.

## 3. Funciones

- Máximo ~40 líneas y una sola responsabilidad.
- Early returns en lugar de `if` anidados.
- Sin `export default`, salvo donde el framework lo exija (configs, páginas Astro, entrypoint del Worker).
- Funciones puras siempre que se pueda; los efectos se aíslan en los bordes.

## 4. SOLID y arquitectura del backend

SOLID aplica a todo el código y es **obligatorio en `apps/api`**.

| Principio                 | Cómo se aplica                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **S**ingle responsibility | Un caso de uso por función; las rutas HTTP solo traducen request ⇄ caso de uso.                                                              |
| **O**pen/closed           | Proveedores nuevos (otro email, otro LLM) se añaden con un adaptador nuevo, sin tocar los casos de uso.                                      |
| **L**iskov substitution   | Todo adaptador cumple el contrato completo de su puerto; los fakes de test también.                                                          |
| **I**nterface segregation | Puertos pequeños y específicos (`CaptchaVerifier`, `RateLimiter`, `EmailSender`, `EmbeddingProvider`, `ChatModel`, `VectorIndexRepository`). |
| **D**ependency inversion  | Los casos de uso dependen de puertos (interfaces); las implementaciones se inyectan en el composition root.                                  |

### Hexagonal ligera

El backend es pequeño, así que se usa una **arquitectura hexagonal (puertos y adaptadores) en versión ligera**: dos carpetas y un composition root, sin capas extra, sin clases donde una función basta.

```
apps/api/src/
  core/         puertos (interfaces) + casos de uso como funciones puras que reciben sus dependencias
    ports.ts    CaptchaVerifier, RateLimiter, EmailSender, EmbeddingProvider, ChatModel, VectorIndexRepository
    contact.ts  submitContactRequest(deps, input)
    rag.ts      indexDocuments(deps, input), askQuestion(deps, input)
  adapters/     implementaciones de los puertos y entrada HTTP
    http/       app Hono y rutas (adaptador de entrada): validan, llaman al caso de uso, mapean errores
    turnstile.ts, kv-rate-limiter.ts, email-*.ts, ollama.ts, kv-vector-index.ts
  main.ts       composition root: construye los adaptadores a partir de `env` y exporta el Worker
```

Reglas:

- `core/` no importa nada de `adapters/` ni de Hono/Cloudflare; solo de `packages/shared` y de sí mismo.
- Un caso de uso = una función exportada con un objeto `deps` tipado con los puertos que necesita (y nada más).
- Las rutas HTTP son delgadas: sin lógica de negocio.
- Los casos de uso se prueban con fakes en memoria de los puertos; los adaptadores con tests de integración acotados.
- No se añaden capas (repositorios genéricos, servicios de dominio, DTOs duplicados) hasta que haga falta de verdad.

En el frontend se aplican los mismos principios a escala: la lógica pura vive en `src/lib/`, los componentes solo componen y renderizan, y el acceso a la API pasa por un cliente tipado.

## 5. Monorepo

- npm workspaces: `apps/*` y `packages/*`.
- Cada dependencia se declara en el workspace que la usa; en la raíz solo herramientas transversales.
- Los contratos compartidos (schemas zod, tipos) viven solo en `packages/shared`.
- Una app nunca importa código de otra app.

## 6. Formato y lint

- **Prettier** es la única autoridad de formato (`npm run format`, `npm run format:check` en CI). No se discute estilo en review.
- ESLint (flat config) con `typescript-eslint`, `naming-convention`, `jsx-a11y` y `eslint-plugin-astro`.
- Cero warnings en CI.

## 7. TDD y pruebas

- Ciclo **red → green → refactor**: el test se escribe primero y debe fallar antes de escribir el código.
- Tests junto al código: `foo.ts` → `foo.test.ts`.
- **Unit e integración**: Vitest (+ Testing Library para componentes de React).
- **E2E**: Playwright en `apps/web/e2e/` para los flujos clave (idioma, tema, stack → proyectos, drawer, terminal, formulario).
- Cobertura mínima **80 %** en `apps/api`, `packages/*` y `apps/web/src/lib`.
- Ningún commit con tests, lint o typecheck en rojo.

## 8. Idioma

- Código, identificadores, comentarios, mensajes de commit y nombres de ramas: **inglés**.
- Documentación de `docs/` y specs de OpenSpec: **español**.
- Contenido del sitio: ES (por defecto), EN y FR.

## 9. Documentación

- [`docs/README.md`](README.md) es el índice general y enlaza cada documento.
- Cada documento empieza con su propio **índice** de secciones.
- La documentación se actualiza en el mismo commit que el cambio que describe.
- El `README.md` de la raíz es corto y para humanos; el detalle técnico vive en `docs/`.

## 10. Branding y sistema de diseño

- Identidad (voz, tono, nombre, paleta, tipografías): [`docs/branding.md`](branding.md).
- Tokens, escalas, componentes base y motion: [`docs/design-system.md`](design-system.md).
- En código, `apps/web/src/styles/tokens.css` es la **única fuente de valores** (color, tipografía, espaciado, radios, sombras, easings, duraciones). Tailwind los consume vía `@theme`.
- Prohibido hardcodear colores, duraciones o easings fuera de los tokens.

## 11. Accesibilidad y motion

Checklist obligatorio en cada cambio de UI:

- [ ] Easings personalizados de los tokens; nunca `ease-in` en UI.
- [ ] Animaciones de interfaz < 300 ms (las decorativas o explicativas pueden durar más).
- [ ] Elementos presionables con `:active { transform: scale(0.97) }`.
- [ ] Nada aparece desde `scale(0)`: mínimo `scale(0.9)` + `opacity`.
- [ ] Solo se animan `transform`, `opacity` (y `clip-path`/`filter` puntualmente).
- [ ] Hover animado solo dentro de `@media (hover: hover) and (pointer: fine)`.
- [ ] Acciones de teclado sin animación.
- [ ] `prefers-reduced-motion` elimina desplazamientos y conserva fades.
- [ ] Foco visible, HTML semántico, ARIA solo donde haga falta.
- [ ] Contraste WCAG AA y todo operable con teclado.
- [ ] `jsx-a11y` sin errores.

## 12. Git y commits

- Flujo de ramas: `feat/*` / `fix/*` → `develop` → `master` (producción).
- Commits pequeños por unidad lógica (chunks), con [Conventional Commits](https://www.conventionalcommits.org/): `feat(web): …`, `fix(api): …`, `docs: …`.
- Sin trailers de atribución (`Co-Authored-By`, etc.).

## 13. Especificaciones con OpenSpec

- Todo cambio funcional empieza como un _change_ en `openspec/changes/<id>/` (proposal, design, tasks y specs delta).
- `openspec validate <id> --strict` antes de implementar.
- Las tareas de `tasks.md` se marcan al cerrar cada chunk; al terminar se archiva con `openspec archive <id>`.

## 14. Repositorio público: secretos

El repositorio es público. Política completa en [`security.md`](security.md). Lo mínimo:

- Nunca commitear secretos, tokens, IDs de cuenta ni datos personales; solo plantillas `.example` con valores vacíos.
- Los secretos se leen en tiempo de ejecución (Cloudflare secrets, GitHub Actions secrets) y se validan sin imprimir su valor.
- El entorno local funciona sin secretos reales (claves de prueba, Mailpit, R2 emulado).
- gitleaks en CI; ante una fuga, rotar primero.
