import { defineProject } from 'vitest/config'

export default defineProject({
  test: { name: 'rag-ingest', environment: 'node' },
})
