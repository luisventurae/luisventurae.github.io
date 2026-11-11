---
title: Cepeban CRM
summary: Sincronización en tiempo real entre la plataforma de atención y el CRM
role: Backend Developer (freelance)
---

Servicio backend que mantiene al día Zoho CRM del Instituto Cepeban con los datos de su plataforma de atención al cliente, sin intervención manual.

### Contexto

Los datos de los contactos vivían en dos sistemas que no se hablaban entre sí.

### Reto

Mantener ambos sistemas coherentes en tiempo real, sin carga manual y sin exponer credenciales.

### Decisiones técnicas

- Servicio a medida con NestJS sobre Node.js, de uso privado para el instituto.
- Webhooks en tiempo real: cada actualización de un contacto o asignación de una conversación a un asesor crea o actualiza su registro en Zoho CRM.
- Autenticación con Zoho CRM mediante tokens que se renuevan solos.
- Traducción de los datos y campos personalizados del contacto al modelo del CRM.

### Resultado

Los contactos y las asignaciones llegan al CRM al instante, sin cargarlos a mano.
