---
title: PWC Mailer
summary: Microservicio propio para enviar todos los correos de la plataforma
role: Backend Developer
---

Microservicio que procesa todos los envíos de correo de la plataforma de Pool Work Confort.

### Contexto

Los correos del sitio y de los sistemas internos salían por servicios de envío de terceros.

### Reto

Centralizar todos los envíos en un servicio propio y que cualquier aplicación pudiera usarlo.

### Decisiones técnicas

- Servicio con Node.js y TypeScript sobre Cloudflare Workers.
- Envío por SMTP, sin depender de proveedores de correo de terceros.
- Conexión segura con Zero Trust de Cloudflare y buenas prácticas de seguridad.
- Integrado con el sitio web y con el sistema de gestión.

### Resultado

Todos los correos de la plataforma salen de un único servicio propio.
