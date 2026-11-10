# AGENTS.md

Instructions for coding agents (Claude Code, Codex, etc.) working in this repo.

## Finding information fast

There is no RAG service or embeddings server (the Ollama RAG is being removed, see `openspec/changes/remove-site-rag/`). Search the docs directly:

1. Start at [docs/README.md](docs/README.md): the index that says which document answers what.
2. Then search with ripgrep over the two documentation trees, instead of reading whole files:
   - `rg -i "<term>" docs/ openspec/`
   - `rg -il "<term>" docs/ openspec/` to list matching files only.
3. Open only the matching sections of the files you find.

Sources of truth:

- Conventions: [docs/development-rules.md](docs/development-rules.md) (read before writing code).
- UI work: [docs/design-system.md](docs/design-system.md) and [docs/branding.md](docs/branding.md).
- Architecture and local setup: [docs/architecture.md](docs/architecture.md), [docs/local-environment.md](docs/local-environment.md).
- Work in progress and behavior specs: `openspec/changes/` and `openspec/specs/`; keep `tasks.md` up to date.

## Rules that are easy to miss

- Naming: `snake_case` variables, `camelCase` functions, `PascalCase` types/components.
- TDD (red → green → refactor), strict typing, Prettier, no dead code (`npm run verify` must pass).
- Commits: Conventional Commits, one logical chunk per commit, **no attribution trailers** (no `Co-Authored-By`).
- Public repo: never commit secrets.
