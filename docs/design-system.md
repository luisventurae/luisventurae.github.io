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

## 1. Color

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--color-paper` | `#f7f3ec` | `#12100e` | Fondo de página |
| `--color-paper-raised` | `#ffffff` | `#1c1916` | Cards, drawer, terminal |
| `--color-ink` | `#16130f` | `#f4efe6` | Texto principal |
| `--color-ink-muted` | `#5e5850` | `#a39b8f` | Texto secundario (AA sobre papel) |
| `--color-line` | `#e4ddd1` | `#2e2a25` | Bordes y divisores |
| `--color-accent` | `#ff5a36` | `#ff6b4a` | Fondo de CTA, foco, marcas |
| `--color-accent-ink` | `#b8321a` | `#ff8c70` | Acento usado como **texto** (AA) |
| `--color-on-accent` | `#16130f` | `#16130f` | Texto sobre fondo de acento |
| `--color-lime` | `#c8f04b` | `#b5dc3a` | Juego: Frontend |
| `--color-violet` | `#7a5cff` | `#9a83ff` | Juego: Backend |
| `--color-sky` | `#4cc3ff` | `#5fcbff` | Juego: Otros |

Reglas: un acento por vista; los colores de juego nunca para párrafos.

## 2. Tipografía

| Token | Valor |
| --- | --- |
| `--font-display` | `'Bricolage Grotesque Variable', system-ui, sans-serif` |
| `--font-sans` | `'Instrument Sans Variable', system-ui, sans-serif` |
| `--font-mono` | `'JetBrains Mono Variable', ui-monospace, monospace` |

Escala fluida (`clamp`, de 360 px a 1440 px de viewport):

| Token | Rango | Uso |
| --- | --- | --- |
| `--text-hero` | 4.5rem → 13rem | Nombre en el hero |
| `--text-display` | 2.5rem → 5rem | Títulos de sección |
| `--text-title` | 1.5rem → 2.25rem | Títulos de cards y drawer |
| `--text-body` | 1rem → 1.125rem | Texto |
| `--text-small` | 0.875rem | Metadatos, chips |

Display: `letter-spacing: -0.04em`, `line-height: 0.9`. Texto: `line-height: 1.6`, ancho máx. `65ch`.

## 3. Espaciado y layout

- Base de 4 px (escala por defecto de Tailwind).
- `--space-section`: `clamp(5rem, 12vw, 10rem)` entre secciones.
- `--container`: `72rem`; gutter `--gutter`: `clamp(1rem, 4vw, 2.5rem)`.

## 4. Radios y sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `--radius-sm` | `0.5rem` | Chips, inputs |
| `--radius-md` | `1rem` | Botones, cards |
| `--radius-lg` | `1.75rem` | Drawer, terminal, imágenes |
| `--shadow-card` | sombra en dos capas, cálida | Cards en reposo |
| `--shadow-lift` | sombra más amplia | Cards en hover / arrastre |

## 5. Motion

| Token | Valor | Uso |
| --- | --- | --- |
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entradas, respuesta a interacción |
| `--ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | Movimiento en pantalla |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawer y sheets |
| `--duration-press` | `140ms` | `:active` |
| `--duration-fast` | `180ms` | Hover, tooltips, chips |
| `--duration-base` | `240ms` | Menús, cambios de estado |
| `--duration-slow` | `420ms` | Solo decorativo / entradas de sección |

Springs (Motion, en `apps/web/src/lib/motion.ts`):

| Nombre | Config | Uso |
| --- | --- | --- |
| `SPRING_PLAYFUL` | `{ type: 'spring', duration: 0.5, bounce: 0.3 }` | Letras del hero, stickers |
| `SPRING_SNAPPY` | `{ type: 'spring', duration: 0.35, bounce: 0.1 }` | Layout del stack, tabs |
| `SPRING_TILT` | `{ stiffness: 150, damping: 15 }` | Tilt de cards siguiendo el puntero |

Stagger: 40 ms entre elementos. Reglas completas en [`development-rules.md` › Accesibilidad y motion](development-rules.md#11-accesibilidad-y-motion).

## 6. Componentes base

| Componente | Notas |
| --- | --- |
| `Button` | Variantes `primary` (fondo acento), `ghost`; `:active scale(0.97)`; foco con anillo `--color-accent`. |
| `Chip` | Píldora con borde `--color-line`; estado activo con color de juego de su categoría. |
| `Card` | `--color-paper-raised`, `--radius-lg`, `--shadow-card`; tilt solo con puntero fino. |
| `Drawer` | Vaul; `--ease-drawer`; handle visible; swipe para cerrar y para cambiar de proyecto. |
| `Terminal` | Fondo `--color-ink` y texto `--color-paper` en ambos temas; mono; cursor parpadeante (se detiene con reduced motion). |

## 7. Tema claro / oscuro

- Atributo `data-theme="light|dark"` en `<html>`, inicializado antes del primer pintado con un script inline (preferencia guardada → `prefers-color-scheme`).
- El cambio de tema usa View Transitions con un reveal circular desde el botón; con reduced motion es un fundido simple.
