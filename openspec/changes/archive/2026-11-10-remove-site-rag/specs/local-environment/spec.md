# Spec Delta

## MODIFIED Requirements

### Requirement: One-command startup

Running `docker compose up` from the repository root SHALL start the web app, the API and a local mail inbox, with no external accounts, secrets or model downloads required.

#### Scenario: Fresh clone

- **WHEN** a developer clones the repository and runs `docker compose up`
- **THEN** the site is reachable on port 4321, the API on 8787 and the inbox on 8025

## REMOVED Requirements

### Requirement: Index loading on demand

**Reason**: Sin RAG no hay índice que cargar.
**Migration**: Ninguna.
