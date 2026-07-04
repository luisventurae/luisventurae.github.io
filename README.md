# Luis Ventura E — Portfolio

Personal portfolio of Luis Miguel Ventura, Full Stack Web Engineer. Built with Nuxt 3, TypeScript, and SCSS.

Live: [luisventurae.github.io](https://luisventurae.github.io)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 + Vue 3 |
| Language | TypeScript (strict) |
| Styles | SCSS / SASS |
| Icons | nuxt-svgo |
| Dates | dayjs-nuxt |
| Captcha | Cloudflare Turnstile |
| Contact form backend | Cloudflare Worker (see `worker/`) |
| Deploy | GitHub Pages via `gh-pages` |

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
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile **site key** (public, safe to expose) |
| `NUXT_PUBLIC_WORKER_URL` | URL of the deployed Cloudflare Worker for the contact form |

---

## Deploy

```bash
npm run deploy:gh   # builds, generates static files and pushes to gh-pages branch
```

---

## Contact form Worker

The contact form submits to a Cloudflare Worker that verifies the Turnstile token server-side and sends an email notification. The Worker code lives in `worker/`.

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars   # fill in secrets for local dev
npm run dev                       # wrangler dev on localhost:8787

# deploy
npm run deploy
```

Worker secrets (set via `wrangler secret put <NAME>`):

| Secret | Description |
|---|---|
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile **secret key** (never expose client-side) |
| `NOTIFY_EMAIL` | Email address that receives contact notifications |
| `ALLOWED_ORIGIN` | Production origin allowed by CORS (`https://luisventurae.github.io`) |

Create the KV namespace for rate limiting and replace the placeholder IDs in `worker/wrangler.toml`:

```bash
wrangler kv:namespace create "RATE_LIMIT_KV"
wrangler kv:namespace create "RATE_LIMIT_KV" --preview
```
