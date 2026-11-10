---
title: This portfolio
summary: Static site and serverless API with TDD, i18n and RAG for agents
role: Design, frontend and backend
---

The site you are looking at. It is also a sample of how I work: the code, the decisions and the history are public.

### Context

I wanted a portfolio that shows engineering judgment, not just a list of technologies.

### Challenge

Deliver my CV to recruiters without exposing data or opening a spam vector, from a fast, accessible static site in three languages.

### Technical decisions

- API on Cloudflare Workers with Hono and a light hexagonal architecture: pure use cases and adapters for Turnstile, KV, R2 and email.
- HMAC-signed download links and per-IP rate limits to protect the CV.
- Static site with Astro and React islands; purposeful motion that honors `prefers-reduced-motion`.
- Specs first with OpenSpec, TDD with Vitest, E2E and accessibility with Playwright and axe, and CI/CD with GitHub Actions.
- A local RAG (BM25 + embeddings) so development agents find code and decisions without reading whole files.

### Outcome

A site in es, en and fr that ships itself from `master`, with the API and the web tested end to end.
