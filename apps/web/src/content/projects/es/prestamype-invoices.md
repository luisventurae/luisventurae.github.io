---
title: Gestor de facturas
summary: Módulo para que las empresas gestionen, cobren y adelanten sus facturas
role: Backend Engineer
---

Módulo de la plataforma de Prestamype donde las empresas cargan sus facturas, siguen sus cobros y acceden a financiamiento.

### Contexto

Las empresas cargaban sus facturas una a una y la sincronización con SUNAT era lenta, lo que frenaba todo lo que venía después.

### Reto

Acelerar la carga y la sincronización sin perder confiabilidad, y que Negocio y Producto pudieran seguir iterando sobre el módulo.

### Decisiones técnicas

- Microservicios en Node.js y TypeScript con arquitectura hexagonal, sobre AWS e infraestructura como código con AWS CDK.
- Carga masiva automatizada y una sincronización con SUNAT más eficiente.
- Nueva interfaz y nuevos reportes de cobros, a escritorio y móvil.
- Coordinación del módulo con Negocio y Producto.

### Resultado

La carga automática pasó de 2 minutos a 12 segundos en promedio por factura, y aumentó el volumen de oportunidades de financiamiento.
