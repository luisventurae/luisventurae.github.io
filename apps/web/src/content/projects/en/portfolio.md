---
title: This portfolio
summary: Static site with a serverless API, automated tests and three languages
role: Design, frontend and backend
---

This very site. I also built it to show how I work, so the code, the decisions and the history are all in the open.

### Context

I wanted the portfolio to show how I think and build, not just a list of technologies.

### Challenge

Be able to send my CV to recruiters without leaving it exposed or opening the door to spam, on a fast, accessible static site in three languages.

### Technical decisions

- API on Cloudflare Workers with Hono. I kept the logic apart from the external services (Turnstile, KV, R2 and email) with a light hexagonal architecture.
- The CV is downloaded through a signed link that expires, and sending is limited per IP and per recipient.
- Site built with Astro and React components only where they are needed. Animations respect `prefers-reduced-motion`.
- Every change starts from an OpenSpec specification, with unit tests in Vitest and end-to-end and accessibility tests with Playwright and axe. Deployment runs on GitHub Actions.
- A local search tool (BM25 and embeddings) that development agents use to find code and decisions without reading whole files.

### Outcome

The site publishes itself when changes land on `master`, in Spanish, English and French, with the API and the web covered by tests.
