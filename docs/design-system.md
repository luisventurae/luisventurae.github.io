# Sistema de diseño

Fuente de verdad en código: `apps/web/src/styles/tokens.css`. Tailwind v4 lo consume con `@theme`, así que cada token existe también como utilidad (`bg-paper`, `text-ink`, `ease-out-strong`…). Este documento describe los tokens y cómo usarlos; si cambias un valor, cámbialo en ambos sitios en el mismo commit.

## Índice

1. [Color](#1-color)
2. [Tipografía](#2-tipografía)
3. [Espaciado y layout](#3-espaciado-y-layout)
4. [Radios y sombras](#4-radios-y-sombras)
5. [Motion](#5-motion)
6. [Componentes base](#6-componentes-base)
7. [Tema claro / oscuro](#7-tema-claro--oscuro)
8. [Consistencia entre agentes](#8-consistencia-entre-agentes)

## 1. Color

| Token                  | Claro     | Oscuro    | Uso                               |
| ---------------------- | --------- | --------- | --------------------------------- |
| `--color-paper`        | `#f7f3ec` | `#12100e` | Fondo de página                   |
| `--color-paper-raised` | `#ffffff` | `#1c1916` | Cards, drawer, terminal           |
| `--color-ink`          | `#16130f` | `#f4efe6` | Texto principal                   |
| `--color-ink-muted`    | `#5e5850` | `#a39b8f` | Texto secundario (AA sobre papel) |
| `--color-line`         | `#e4ddd1` | `#2e2a25` | Bordes y divisores                |
| `--color-accent`       | `#ff5a36` | `#ff6b4a` | Fondo de CTA, foco, marcas        |
| `--color-accent-ink`   | `#b8321a` | `#ff8c70` | Acento usado como **texto** (AA)  |
| `--color-on-accent`    | `#16130f` | `#16130f` | Texto sobre fondo de acento       |
| `--color-lime`         | `#c8f04b` | `#b5dc3a` | Juego: Frontend                   |
| `--color-violet`       | `#6a4cf0` | `#9a83ff` | Juego: Backend                    |
| `--color-sky`          | `#4cc3ff` | `#5fcbff` | Juego: Otros                      |

Reglas: un acento por vista; los colores de juego nunca para párrafos.

## 2. Tipografía

| Token            | Valor                                                   |
| ---------------- | ------------------------------------------------------- |
| `--font-display` | `'Bricolage Grotesque Variable', system-ui, sans-serif` |
| `--font-sans`    | `'Instrument Sans Variable', system-ui, sans-serif`     |
| `--font-mono`    | `'JetBrains Mono Variable', ui-monospace, monospace`    |

Escala fluida (`clamp`, de 360 px a 1440 px de viewport):

| Token            | Rango            | Uso                       |
| ---------------- | ---------------- | ------------------------- |
| `--text-hero`    | 3.5rem → 10.5rem | Nombre en el hero         |
| `--text-display` | 2.5rem → 5rem    | Títulos de sección        |
| `--text-title`   | 1.5rem → 2.25rem | Títulos de cards y drawer |
| `--text-body`    | 1rem → 1.125rem  | Texto                     |
| `--text-small`   | 0.875rem         | Metadatos, chips          |

Display: `letter-spacing: -0.04em`, `line-height: 0.9`. Texto: `line-height: 1.6`, ancho máx. `65ch`.

## 3. Espaciado y layout

- Base de 4 px (escala por defecto de Tailwind).
- `--space-section`: `clamp(5rem, 12vw, 10rem)` entre secciones.
- `--container`: `72rem`; gutter `--gutter`: `clamp(1rem, 4vw, 2.5rem)`.

## 4. Radios y sombras

| Token           | Valor                       | Uso                        |
| --------------- | --------------------------- | -------------------------- |
| `--radius-sm`   | `0.5rem`                    | Chips, inputs              |
| `--radius-md`   | `1rem`                      | Botones, cards             |
| `--radius-lg`   | `1.75rem`                   | Drawer, terminal, imágenes |
| `--shadow-card` | sombra en dos capas, cálida | Cards en reposo            |
| `--shadow-lift` | sombra más amplia           | Cards en hover / arrastre  |

## 5. Motion

| Token                  | Valor                             | Uso                                   |
| ---------------------- | --------------------------------- | ------------------------------------- |
| `--ease-out-strong`    | `cubic-bezier(0.23, 1, 0.32, 1)`  | Entradas, respuesta a interacción     |
| `--ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | Movimiento en pantalla                |
| `--ease-drawer`        | `cubic-bezier(0.32, 0.72, 0, 1)`  | Drawer y sheets                       |
| `--duration-press`     | `140ms`                           | `:active`                             |
| `--duration-fast`      | `180ms`                           | Hover, tooltips, chips                |
| `--duration-base`      | `240ms`                           | Menús, cambios de estado              |
| `--duration-slow`      | `420ms`                           | Solo decorativo / entradas de sección |

Springs (Motion, en `apps/web/src/lib/motion.ts`):

| Nombre           | Config                                            | Uso                                |
| ---------------- | ------------------------------------------------- | ---------------------------------- |
| `SPRING_PLAYFUL` | `{ type: 'spring', duration: 0.5, bounce: 0.3 }`  | Letras del hero, stickers          |
| `SPRING_SNAPPY`  | `{ type: 'spring', duration: 0.35, bounce: 0.1 }` | Layout del stack, tabs             |
| `SPRING_TILT`    | `{ stiffness: 150, damping: 15 }`                 | Tilt de cards siguiendo el puntero |

Stagger: 40 ms entre elementos.

### Revelado al hacer scroll

Las secciones bajo el hero se revelan la primera vez que entran en pantalla (`lib/reveal.ts` + CSS en `global.css`):

| Pieza                  | Uso                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `data-reveal`          | Contenedor observado (solo nodos de Astro, nunca de React). Recibe `data-inview` una sola vez.                     |
| `.reveal-item`         | Hijo animado (`reveal-rise`, 700 ms, `--ease-out-strong`, 24 px). Stagger con `--reveal-index` × 60 ms, tope de 6. |
| `.reveal-title`        | Variante con blur para los títulos de sección, coherente con la entrada del hero.                                  |
| `.reveal-children`     | Escalona sus hijos directos de forma automática (útil para markdown renderizado).                                  |
| `data-reveal="self"`   | El propio contenedor se anima.                                                                                     |
| `<mark>` en "Sobre mí" | Marcador lima que se dibuja (`background-size`, 700 ms, `--ease-in-out-strong`) sobre las cifras clave.            |

Reglas: el estado oculto solo aplica bajo `html.js`. Si el módulo no arranca en 3 s, la clase `no-reveal` lo muestra todo. Las animaciones usan `fill-mode: backwards`, así que no bloquean después el hover ni el `scale` de `.pressable`. Con reduced motion, el revelado es un fundido de 400 ms sin movimiento.

Entrada del hero: las letras del nombre usan `hero-rise` (700 ms, blur) porque son decoración. El texto de apoyo (badge, rol, datos clave, rol rotativo, tagline, CTAs) usa `hero-fade`: 360 ms, `translate` de 8 px sin blur y retrasos de 0 a 240 ms. Así los datos clave se leen antes de que termine el nombre. El rol rotativo hace un crossfade de 320 ms con blur de 4 px. Reglas completas en [`development-rules.md` › Accesibilidad y motion](development-rules.md#11-accesibilidad-y-motion).

## 6. Componentes base

| Componente     | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`       | Variantes `primary` (fondo acento), `ghost`; `:active` con la propiedad `scale: 0.97` (no `transform`, para componer con Motion; si el elemento usa `transition-[…]`, debe incluir `scale`); foco con anillo `--color-accent`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Chip`         | Píldora con borde `--color-line`; estado activo con color de juego de su categoría. En el stack, el tamaño depende del nivel de uso (`daily` > `production` > `exploring`, ver `chipSize()`), con una leyenda debajo; nunca muestra notas numéricas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Card`         | `--color-paper-raised`, `--radius-lg`, `--shadow-card`. Tilt solo con puntero fino (3° en las destacadas, 6° en el resto). Al hacer scroll, cada tarjeta sube 40 px (700 ms) y su captura se abre como un telón (`clip-path`, 750 ms, `--ease-drawer`); la columna derecha va 90 ms detrás. En hover, la captura hace `scale: 1.04`. La isla usa `useScrollReveal` y nunca oculta lo que ya está en pantalla al hidratar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Drawer`       | Vaul; `--ease-drawer`; handle visible; swipe para cerrar y para cambiar de proyecto. En móvil es un sheet pegado al borde inferior; desde `md` flota a 1.5 rem del borde, con las cuatro esquinas y `--shadow-lift` (`--initial-transform` para salir del todo y sin el `::after` de vaul). El cuerpo se desvanece bajo la cabecera y en el borde inferior (`.drawer-scroll`, `mask-image`) con scrollbar fina.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `Gallery`      | Slider de capturas dentro del drawer (`ProjectGallery`). Pista nativa con `scroll-snap` (swipe con inercia real, sin scrollbar visible), alto 16:10 con tope de `min(52dvh, 30rem)` para que el texto se vea. Las capturas verticales (`mediaFrame`: alto > ancho) van en un marco de teléfono (borde `ink`, `--shadow-lift`) sobre papel; las de escritorio llenan el marco desde arriba. Etiqueta mono "Móvil/Escritorio". Flechas (chevrons sobre la imagen, fondo `ink` translúcido y sin borde) solo con puntero fino, para no confundirse con las del proyecto: en la cabecera del drawer, desde `md`, estas dicen "Proyecto anterior / siguiente" y el contador "Proyecto 2 de 10"; puntos con _roving tabindex_ (← / → cambian de captura y no de proyecto). Un swipe sobre la pista no llega al drawer. Botones y clics con scroll suave; teclado y reduced motion, instantáneo. En la tarjeta, una píldora indica cuántas capturas hay. |
| `Timeline`     | Experiencia en `<ol class="timeline">`. La línea (`::before`, de lima a `--color-line`) se dibuja con el scroll (`animation-timeline: view()`, estática si no hay soporte o con reduced motion). Cada entrada se revela por su cuenta: período → contenido → chips. Los puntos entran con un rebote corto (`scale` desde 0.6, `cubic-bezier(0.34, 1.56, 0.64, 1)`). El trabajo actual emite un único "ping". En hover (puntero fino) o foco, el punto crece a 1.5 y los pasados se oscurecen; lo mismo al llegar por ancla (`:target`) desde el enlace "En <empresa>" de un caso de estudio. Cada empleo lista sus casos de estudio como chips enlace (`.case-link`, `pressable`, borde que pasa a `ink` en hover y flecha que avanza 2 px), que abren el drawer del caso sin mover la página; sin JS, llevan a la tarjeta.                                                                                                                       |
| `Magnifier`    | Lupa invisible sobre "Sobre mí" (`lib/magnifier.ts`, `data-magnifier`), solo con puntero fino y sin reduced motion. Las letras dentro de un radio de 64 px crecen hasta 1.25 con caída smoothstep según la distancia; la lupa sigue al puntero con un retardo corto (independiente de los Hz), entra en ~250 ms y sale más rápido. Solo anima `scale` por letra, sin variables CSS heredadas. El texto se parte en tiempo ocioso sin mover la maquetación; la copia partida es `aria-hidden` y un gemelo `sr-only` conserva el texto para lectores de pantalla. No se activa si el bloque tiene contenido interactivo.                                                                                                                                                                                                                                                                                                                            |
| `Badge`        | Píldora de disponibilidad del hero: borde `--color-line`, fondo `--color-paper-raised`, punto lima estático (sin pulso: la información no se anima).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `VacancyMatch` | La tarjeta entra al hacer scroll (32 px) y sus chips caen en cascada (10 px, 60 ms, tope de 6). Chips `button[aria-pressed]` con `pressable` y color en `ease`. Medidor `scaleX` con `transform-origin: left` y spring (`duration 0.5`, `bounce 0.2`), sin animación con reduced motion. El porcentaje se anuncia en `aria-live="polite"` y hace un "pop" con spring (0.85 → 1, `bounce 0.35`) en cada cambio. Al llegar al 100 %, un único brillo cruza la barra (900 ms). Pruebas y CTA entran en 200 ms `ease-out` (4 px) y salen en 120 ms. La isla hidrata 400 px antes de entrar en pantalla.                                                                                                                                                                                                                                                                                                                                               |
| `Terminal`     | Siempre oscura (`--terminal-bg`, `--terminal-fg`, `--terminal-muted`, `--terminal-error`) en ambos temas; mono; sin animaciones (se usa con teclado).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## 7. Tema claro / oscuro

- Atributo `data-theme="light|dark"` en `<html>`, inicializado antes del primer pintado con un script inline (preferencia guardada → `prefers-color-scheme`).
- El cambio de tema usa View Transitions con un reveal circular desde el botón; con reduced motion es un fundido simple.

## 8. Consistencia entre agentes

Varios agentes (Claude Code, Codex…) y skills de diseño trabajan en este repo. Para que el estilo no derive:

**Orden de autoridad** (si dos fuentes chocan, gana la de arriba):

1. `apps/web/src/styles/tokens.css` (valores).
2. Este documento y [branding.md](branding.md) (reglas y criterio).
3. Componentes existentes en `apps/web/src/components/` (patrones ya aprobados).
4. Skills de `.claude/skills/` y `.agents/skills/` (`animate`, `apple-design`, `emil-design-eng`…): son guías generales de oficio. Nunca sustituyen los tokens ni la paleta del proyecto; si una skill sugiere un color, easing o duración propios, se traduce al token más cercano.

**Antes de escribir UI:**

- Carga y sigue la skill `emil-design-eng` (Emil Kowalski) para cualquier decisión de pulido, componentes y animación; es la skill de diseño por defecto del proyecto. Se aplica siempre dentro de los tokens y la paleta.
- Lee este documento y `branding.md`, y busca un componente parecido que reutilizar o extender antes de crear uno nuevo.
- Usa solo utilidades y variables que existan en `tokens.css` (`bg-paper`, `text-ink`, `ease-out-strong`…).

**Prohibido sin un change de OpenSpec que lo apruebe:**

- Hardcodear colores, `cubic-bezier(...)`, duraciones, radios o sombras fuera de `tokens.css`.
- Añadir fuentes, un segundo color de acento, librerías de UI o de iconos nuevas.
- Cambiar el valor de un token o añadir uno nuevo. Si hace falta, se cambia en `tokens.css` y en este documento en el mismo commit.
- Rediseñar un componente existente «de paso» mientras se hace otra tarea.

**Al terminar un cambio de UI:**

- Busca valores sueltos: `rg -n "#[0-9a-fA-F]{3,8}\b|cubic-bezier" apps/web/src --glob '!**/tokens.css'`.
- Comprueba el checklist de accesibilidad y motion de [development-rules.md](development-rules.md#11-accesibilidad-y-motion) y ambos temas (claro/oscuro).

**Excepciones conocidas** (no copiar como patrón): los `<meta name="theme-color">` de `layouts/Base.astro` (el navegador no lee variables CSS) y las curvas puntuales de `ThemeToggle.tsx` y `dot-pop` en `global.css`.
