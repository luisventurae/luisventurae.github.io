// Minimal static server for dist/ that behaves like GitHub Pages (directory → index.html).
// Used by Playwright; `astro preview` detaches when it has no TTY.
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const ROOT = join(import.meta.dirname, '../dist')
const PORT = Number(process.env.PORT ?? 4322)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

async function resolveFile(url_path) {
  const safe_path = normalize(decodeURIComponent(url_path)).replace(/^(\.\.[/\\])+/, '')
  const candidate = join(ROOT, safe_path)
  if (!candidate.startsWith(ROOT)) return null
  const info = await stat(candidate).catch(() => null)
  if (info?.isFile()) return candidate
  if (info?.isDirectory()) return resolveFile(join(safe_path, 'index.html'))
  return null
}

createServer(async (request, response) => {
  const file = await resolveFile(new URL(request.url ?? '/', 'http://localhost').pathname)
  if (!file) {
    response.writeHead(404).end('Not found')
    return
  }
  response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`))
