# AGENTS.md

Instructions for coding agents (Claude Code, Codex, etc.) working in this repo.

## Finding information fast

The project has no RAG service, embeddings server or Ollama. To find information in the docs, search them directly with ripgrep:

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
