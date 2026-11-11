---
title: Cepeban CRM
summary: Real-time sync between the customer service platform and the CRM
role: Backend Developer (freelance)
---

Backend service that keeps Instituto Cepeban’s Zoho CRM up to date with the data from its customer service platform, with no manual work.

### Context

Contact data lived in two systems that did not talk to each other.

### Challenge

Keep both systems consistent in real time, with no manual entry and without exposing credentials.

### Technical decisions

- Custom service with NestJS on Node.js, for the institute’s private use.
- Real-time webhooks: every contact update or conversation assigned to an agent creates or updates its Zoho CRM record.
- Zoho CRM authentication with tokens that renew themselves.
- Translation of the contact’s data and custom fields into the CRM’s model.

### Outcome

Contacts and assignments reach the CRM instantly, with no manual entry.
