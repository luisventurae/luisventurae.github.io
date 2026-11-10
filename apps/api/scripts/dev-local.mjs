// Starts `wrangler dev` for Docker Compose: seeds the local R2 bucket with the sample CV
// and forwards the container environment as Worker vars (wrangler does not read process.env).
import { spawnSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

const PERSIST_DIR = '.wrangler/state'
const FORWARDED_VARS = [
  'ALLOWED_ORIGIN',
  'TURNSTILE_SECRET_KEY',
  'DOWNLOAD_TOKEN_SECRET',
  'NOTIFY_EMAIL',
  'EMAIL_TRANSPORT',
  'MAILPIT_URL',
  'RAG_ENABLED',
  'OLLAMA_HOST',
  'RAG_EMBED_MODEL',
  'RAG_CHAT_MODEL',
]

for (const locale of ['es', 'en', 'fr']) {
  const file = existsSync(`seed/cv-${locale}.pdf`) ? `seed/cv-${locale}.pdf` : 'seed/cv-es.pdf'
  spawnSync(
    'npx',
    [
      'wrangler',
      'r2',
      'object',
      'put',
      `portfolio-cv/cv/${locale}.pdf`,
      '--file',
      file,
      '--local',
      '--persist-to',
      PERSIST_DIR,
    ],
    { stdio: 'ignore' },
  )
}

const var_flags = FORWARDED_VARS.filter((name) => process.env[name]).flatMap((name) => [
  '--var',
  `${name}:${process.env[name]}`,
])

const child = spawn(
  'npx',
  [
    'wrangler',
    'dev',
    '--ip',
    '0.0.0.0',
    '--port',
    '8787',
    '--persist-to',
    PERSIST_DIR,
    ...var_flags,
  ],
  { stdio: 'inherit' },
)
child.on('exit', (code) => process.exit(code ?? 0))
