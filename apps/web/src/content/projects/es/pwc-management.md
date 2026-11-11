---
title: Sistema de gestión
summary: Sistema interno de gestión comercial y operativa
role: Full Stack Developer
---

Sistema interno para gestionar la parte comercial y operativa de Pool Work Confort.

### Contexto

Las cotizaciones, las ventas y el inventario se llevaban de forma manual y separada de la tienda en línea.

### Reto

Automatizar el trabajo diario del equipo y mantener el inventario coherente con la tienda en línea.

### Decisiones técnicas

- Aplicación con Node.js y TypeScript, interfaz con Astro y despliegue con Docker.
- Generación automática de cotizaciones en PDF con React PDF, seguimiento de ventas e inventario.
- Registro de precios y costos, con los márgenes a la vista y los tipos de cambio del día.
- Actualización de productos sincronizada con la tienda en línea.
- Envío de correos a través del microservicio propio.

### Resultado

El equipo genera cotizaciones, sigue sus ventas y actualiza el inventario desde un solo sistema, con la tienda siempre al día.
