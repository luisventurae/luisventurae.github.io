---
title: Invoice manager
summary: Module where companies manage, collect and get advances on their invoices
role: Backend Engineer
---

Module of the Prestamype platform where companies upload their invoices, track collections and access financing.

### Context

Companies uploaded invoices one by one and the sync with SUNAT, Peru's tax authority, was slow, which held back everything that came after.

### Challenge

Speed up uploads and sync without losing reliability, while Business and Product kept iterating on the module.

### Technical decisions

- Node.js and TypeScript microservices with hexagonal architecture, on AWS with infrastructure as code in AWS CDK.
- Automated bulk upload and a more efficient SUNAT sync.
- New interface and collection reports, on desktop and mobile.
- Module coordination with Business and Product.

### Outcome

Automatic upload went from 2 minutes to 12 seconds per invoice on average, and the volume of financing opportunities increased.
