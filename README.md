# Luis Ventura E — Portfolio

Full Stack Web Engineer. Personal portfolio showcasing projects and skills, with multilingual support (ES / EN / FR).

Live: [luisventurae.github.io](https://luisventurae.github.io)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 + Vue 3 |
| Language | TypeScript (strict) |
| Styles | SCSS / SASS |
| i18n | @nuxtjs/i18n (ES / EN / FR) |
| Icons | nuxt-svgo |
| Dates | dayjs-nuxt |
| Captcha | Cloudflare Turnstile |
| Contact form backend | Cloudflare Worker (`worker/`) |
| Deploy | GitHub Pages (CI/CD via GitHub Actions) |

---

## Development

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable | Description |
|---|---|
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile **site key** (public) |
| `NUXT_PUBLIC_WORKER_URL` | URL of the deployed Cloudflare Worker |

---

## Deploy

Pushing to `master` triggers GitHub Actions, which runs `nuxt generate` and publishes `.output/public` to the `gh-pages` branch automatically.

Manual fallback:

```bash
npm run deploy:gh
```

---

## Cloudflare Worker

The contact form submits to a Worker that verifies Turnstile server-side and sends email. Code lives in `worker/`.

```bash
cd worker && npm install
cp .dev.vars.example .dev.vars  # fill secrets for local dev
npm run dev                      # localhost:8787
npm run deploy                   # deploy to Cloudflare
```

Worker secrets (set via `wrangler secret put <NAME>`): `TURNSTILE_SECRET_KEY`, `NOTIFY_EMAIL`, `ALLOWED_ORIGIN`.

Create the KV namespace for rate limiting:

```bash
wrangler kv:namespace create "RATE_LIMIT_KV"
```
