---
title: Management system
summary: Internal commercial and operations management system
role: Full Stack Developer
---

Internal system to manage the commercial and operations side of Pool Work Confort.

### Context

Quotes, sales and inventory were handled by hand and separately from the online store.

### Challenge

Automate the team’s daily work and keep inventory consistent with the online store.

### Technical decisions

- Application with Node.js and TypeScript, an Astro interface and Docker deployment.
- Automatic quote generation as PDFs with React PDF, sales tracking and inventory.
- Recording of prices and costs, with margins in plain sight and the day’s exchange rates.
- Product updates synchronized with the online store.
- Emails sent through the in-house microservice.

### Result

The team generates quotes, tracks sales and updates inventory from a single system, with the store always up to date.
