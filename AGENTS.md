# AGENTS.md

Instructions for coding agents (Claude Code, Codex, etc.) working in this repo.

## Finding information fast

The project has no RAG service, embeddings server or Ollama. Instead, a local CLI searches code, tests, docs, specs and commits (details in [docs/agent-rag.md](docs/agent-rag.md)):

1. For conceptual questions («where is X validated?», «what did we decide about Y?») run `npm run -s rag -- search "<question>"` (add `--kind code|test|doc|spec|commit` or `--k <n>`). Each result is `path:start-end`: read only that range. The first run takes ~1.5 min to build the index; later runs refresh it incrementally.
2. For exact strings, identifiers or imports use ripgrep: `rg -i "<term>" docs/ openspec/` (or any path).
3. [docs/README.md](docs/README.md) is the index that says which document answers what.
4. Open only the matching sections of the files you find; do not read whole files.

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
