---
title: PWC Mailer
summary: In-house microservice that sends every platform email
role: Backend Developer
---

Microservice that processes every email sent by the Pool Work Confort platform.

### Context

Emails from the website and internal systems went out through third-party delivery services.

### Challenge

Centralize all sending in an in-house service that any application could use.

### Technical decisions

- Service with Node.js and TypeScript on Cloudflare Workers.
- Delivery over SMTP, with no third-party email providers.
- Secure connection with Cloudflare Zero Trust and security best practices.
- Integrated with the website and the management system.

### Outcome

Every platform email goes out through a single in-house service.
