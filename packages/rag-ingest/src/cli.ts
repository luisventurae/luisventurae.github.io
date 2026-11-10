import { runIngest } from './ingest'

const config = {
  web_url: process.env.WEB_URL ?? 'http://localhost:4321',
  api_url: process.env.API_URL ?? 'http://localhost:8787',
  ollama_host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
  model: process.env.RAG_EMBED_MODEL ?? 'bge-m3',
}

console.log(`Ingesting ${config.web_url}/search-index.json with ${config.model}…`)
const started_at = performance.now()

try {
  const result = await runIngest(config)
  const seconds = ((performance.now() - started_at) / 1000).toFixed(1)
  console.log(`Indexed ${result.indexed} chunks in ${seconds}s.`)
} catch (error) {
  console.error('Ingest failed:', error instanceof Error ? error.message : error)
  process.exitCode = 1
}
