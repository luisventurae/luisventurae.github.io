import { defineProject } from 'vitest/config'

export default defineProject({
  test: { name: 'agent-rag', environment: 'node' },
})
