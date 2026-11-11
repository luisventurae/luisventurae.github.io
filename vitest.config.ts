import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
    coverage: {
      provider: 'v8',
      include: ['apps/api/src/**', 'packages/*/src/**', 'apps/web/src/lib/**'],
      // Composition roots, test helpers and Astro-only loaders are covered by E2E instead.
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        '**/index.ts',
        'apps/api/src/main.ts',
        'packages/agent-rag/src/cli.ts',
        'packages/agent-rag/src/testing/**',
        'apps/api/src/testing/**',
        'apps/web/src/lib/content.ts',
        'apps/web/src/lib/download.ts',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
