---
title: PWC Mailer
summary: Software de envío automatizado de correos
role: Backend Developer
---

Herramienta interna para programar y enviar campañas de correo de forma automática.

### Contexto

Las campañas de correo se preparaban y enviaban a mano.

### Reto

Programar envíos masivos de forma confiable y saber en qué estado estaba cada correo.

### Decisiones técnicas

- Servicio con AdonisJS sobre Node.js y MySQL.
- Plantillas reutilizables y colas de envío para no saturar el proveedor.
- Seguimiento del estado de cada envío.

### Resultado

Las campañas se programan y se envían solas, con visibilidad del estado de cada correo.

<!-- TODO(content): añadir cifras reales (usuarios, volumen, tiempos, tamaño del equipo). -->
