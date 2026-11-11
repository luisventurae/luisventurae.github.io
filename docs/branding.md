# Branding

Identidad del portafolio de Luis Ventura E. Los valores concretos (hex, tamaños, curvas) viven en [`design-system.md`](design-system.md) y en `apps/web/src/styles/tokens.css`. Este documento explica el **por qué**.

## Índice

1. [Esencia](#1-esencia)
2. [Voz y tono](#2-voz-y-tono)
3. [Nombre y firma](#3-nombre-y-firma)
4. [Paleta](#4-paleta)
5. [Tipografía](#5-tipografía)
6. [Personalidad del movimiento](#6-personalidad-del-movimiento)
7. [Imágenes y multimedia](#7-imágenes-y-multimedia)
8. [Qué evitar](#8-qué-evitar)

## 1. Esencia

**Un ingeniero backend que se divierte construyendo cosas que se sienten bien.** El sitio es _playful_ y expresivo, pero cada detalle está medido: el juego demuestra oficio, no lo reemplaza.

El público principal son reclutadores que buscan un perfil backend Node.js (remoto o híbrido, Perú). Rol, años de experiencia y stack principal se leen en el hero sin esperar ni interactuar; sobre el nombre van las redes sociales, y la preferencia remoto o híbrido se explica en "Sobre mí": la información clave nunca rota ni depende de una animación.

Tres ideas guía:

- **Tócalo**: casi todo responde al puntero, al dedo o al teclado.
- **Preciso**: el juego nunca rompe la legibilidad, la accesibilidad ni el rendimiento.
- **Cálido**: papel, tinta y un acento vivo en lugar del clásico look "dev oscuro con neón".

## 2. Voz y tono

- Primera persona, cercana y directa: "Construyo…", no "El desarrollador construye…".
- Frases cortas. Verbos concretos. Cero relleno corporativo.
- Humor ligero en microcopys (terminal, estados vacíos, 404), nunca en información clave.
- Técnico cuando aporta, sin siglas gratuitas.

| En lugar de                                 | Escribe                                         |
| ------------------------------------------- | ----------------------------------------------- |
| "Apasionado por las tecnologías emergentes" | "Me gusta que el software se sienta bien"       |
| "Soluciones robustas y escalables"          | "Sistemas que aguantan tráfico real"            |
| "Error: comando no encontrado"              | "`foo`? No conozco ese comando. Prueba `help`." |

## 3. Nombre y firma

- Nombre público: **Luis Ventura E**. Nombre completo en datos estructurados: Luis Miguel Ventura E.
- Rol: **Backend Engineer · Node.js**. El frontend y el motion son el plus que lo diferencia, no el titular.
- Monograma provisional: `lv.` en tipografía display con el punto en color de acento. `TODO(media)`: reemplazar por el logo definitivo si existe.

## 4. Paleta

Base de **papel y tinta** con un acento **tomate** y tres colores de juego.

| Rol                  | Intención                                                                            |
| -------------------- | ------------------------------------------------------------------------------------ |
| Papel (`paper`)      | Fondo cálido, no blanco puro: reduce fatiga y da carácter editorial.                 |
| Tinta (`ink`)        | Texto principal, casi negro con temperatura cálida.                                  |
| Tomate (`accent`)    | Llamadas a la acción, foco, el punto del monograma. Uno por vista.                   |
| Lima, violeta, cielo | Colores de juego: categorías del stack, stickers, etiquetas. Nunca para texto largo. |

El modo oscuro invierte papel y tinta manteniendo la temperatura cálida.

## 5. Tipografía

| Uso                       | Familia                            | Por qué                                                      |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| Display (titulares, hero) | **Bricolage Grotesque** (variable) | Grotesca con personalidad, ejes de peso y ancho para animar. |
| Texto                     | **Instrument Sans** (variable)     | Neutra y muy legible, acompaña sin competir.                 |
| Código / terminal         | **JetBrains Mono** (variable)      | Ligaduras claras, buena en tamaños pequeños.                 |

Fuentes autoalojadas (Fontsource) para rendimiento y privacidad.

## 6. Personalidad del movimiento

- **Springs con rebote sutil** (bounce 0.2–0.3) en lo que se arrastra o se lanza.
- **Rápido y seco** en la interfaz funcional (menús, botones, drawer): < 300 ms, sin rebote.
- El rebote es un premio por interactuar, no un adorno permanente.

Reglas concretas en [`design-system.md` › Motion](design-system.md#5-motion).

## 7. Imágenes y multimedia

- Sin foto de perfil en el hero: el protagonista es el nombre y lo que se puede hacer con él.
- Capturas de proyectos con bordes redondeados y sombra suave, sobre papel.
- Videos cortos (≤ 15 s, sin audio, `muted loop playsinline`) para mostrar interacción real.
- Capturas en `apps/web/src/assets/projects/` como `ss-<proyecto>-<n>.webp`; las de móvil, en vertical (`-mobile`). La primera es la portada de la tarjeta. Antes de publicar, nada de datos de clientes ni de otras marcas en pantalla: el repositorio es público.
- Los enlaces al sitio original de un proyecto solo aceptan `https` (`safeExternalUrl`), abren en pestaña nueva sin `opener` ni referrer y muestran el dominio antes de salir.
- Todo recurso pendiente se marca con `TODO(media)` en el contenido.

## 8. Qué evitar

- Gradientes morado-azul genéricos, glassmorphism, glows de neón.
- Más de un color de acento en una misma vista.
- Animaciones que bloquean la lectura o la interacción.
- Emojis en titulares.
