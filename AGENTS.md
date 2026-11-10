# AGENTS.md

Instructions for coding agents (Claude Code, Codex, etc.) working in this repo.

## Finding information fast

No RAG service or Ollama. Use the local search CLI ([docs/agent-rag.md](docs/agent-rag.md)):

- Conceptual questions (where/why/what was decided): `npm run -s rag -- search "<question>" [--kind code|test|doc|spec|commit] [--k <n>]`. Results are `path:start-end`; read only that range. First run builds the index (~1.5 min).
- Exact strings or identifiers: `rg -i "<term>" <path>`.
- Which doc answers what: [docs/README.md](docs/README.md).

Sources of truth:

- Conventions: [docs/development-rules.md](docs/development-rules.md) (read before writing code).
- UI work: [docs/design-system.md](docs/design-system.md) and [docs/branding.md](docs/branding.md).
- Architecture and local setup: [docs/architecture.md](docs/architecture.md), [docs/local-environment.md](docs/local-environment.md).
- Work in progress and behavior specs: `openspec/changes/` and `openspec/specs/`; keep `tasks.md` up to date.

## OpenSpec CLI

Install once with `npm install -g @fission-ai/openspec`. Useful commands:

- `openspec list` — active changes.
- `openspec status --change <name>` — artifact progress.
- `openspec validate <name> --strict` — check a change before archiving.
- `openspec archive <name>` — move a finished change to `openspec/changes/archive/` and sync its specs.

## Rules that are easy to miss

- Naming: `snake_case` variables, `camelCase` functions, `PascalCase` types/components.
- TDD (red → green → refactor), strict typing, Prettier, no dead code (`npm run verify` must pass).
- Commits: Conventional Commits, one logical chunk per commit, **no attribution trailers** (no `Co-Authored-By`).
- Public repo: never commit secrets.
