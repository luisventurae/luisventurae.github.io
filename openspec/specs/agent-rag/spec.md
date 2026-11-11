# agent-rag Specification

## Purpose

Permitir que los agentes encuentren rápido código, documentación y decisiones del repositorio mediante búsqueda híbrida local.

## Requirements

### Requirement: Compact, locatable results

`rag search <query>` SHALL print the best matching fragments, each with its file path, line range, kind and score, plus a short excerpt, and SHALL accept `--k` to limit the number of results.

#### Scenario: Conceptual code question

- **WHEN** an agent runs `rag search "where is the captcha validated"`
- **THEN** the output lists the Turnstile adapter and the contact use case with `path:start-end` ranges

#### Scenario: Machine-readable output

- **WHEN** the agent adds `--json`
- **THEN** the output is a JSON array with path, start line, end line, kind, score and excerpt

### Requirement: Hybrid retrieval

The search SHALL combine lexical ranking and semantic ranking with Reciprocal Rank Fusion, and identifiers in `camelCase`, `snake_case` or paths SHALL match their component words.

#### Scenario: Identifier query

- **WHEN** the query is `parseConfig`
- **THEN** the fragment declaring `parseConfig` ranks among the first results

### Requirement: Corpus coverage

The index SHALL contain source code split by top-level declaration, tests, `docs/`, `openspec/` sections and the most recent commits, and `--kind code|test|doc|spec|commit` SHALL restrict results to one kind.

#### Scenario: Filter by kind

- **WHEN** the agent runs `rag search "naming convention" --kind doc`
- **THEN** every result is a documentation fragment

#### Scenario: Commit history

- **WHEN** the agent runs `rag search "remove site rag" --kind commit`
- **THEN** the matching commits are listed with their short hash and subject

### Requirement: Incremental, self-refreshing index

The index SHALL be stored under `.cache/agent-rag/`, SHALL re-embed only files whose content hash changed, and `search` SHALL refresh it automatically when it detects changes.

#### Scenario: Edited file

- **WHEN** a file is edited and `rag search` runs again
- **THEN** only that file is re-chunked and the new content is searchable

#### Scenario: Rebuild

- **WHEN** the agent runs `rag index --rebuild`
- **THEN** the whole index is regenerated

### Requirement: Graceful degradation

When the embedding model cannot be loaded, `rag search` SHALL still answer using lexical ranking only and SHALL state that semantic search is unavailable.

#### Scenario: Model unavailable

- **WHEN** the model is missing and cannot be downloaded
- **THEN** results are returned from lexical ranking with a warning, and the exit code is 0

### Requirement: Index status

`rag status` SHALL report the number of fragments per kind, the age of the index and the embedding model in use.

#### Scenario: Status

- **WHEN** the agent runs `rag status`
- **THEN** it prints counts per kind, the last update time and the model name or "lexical only"
