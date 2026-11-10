#!/usr/bin/env node
// Runs the native TypeScript 7 compiler. The `typescript` package name is taken by
// @typescript/typescript6 so that tooling which needs the JS API (typescript-eslint,
// astro check) keeps working. See docs/development-rules.md › Tipado estricto.
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const tsc_path = join(dirname(require.resolve('typescript7/package.json')), 'bin', 'tsc')
const result = spawnSync(process.execPath, [tsc_path, ...process.argv.slice(2)], {
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
