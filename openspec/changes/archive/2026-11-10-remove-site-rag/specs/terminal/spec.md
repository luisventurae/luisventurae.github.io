# Spec Delta

## MODIFIED Requirements

### Requirement: Command set

The terminal SHALL support the commands `help`, `whoami`, `ls projects`, `cat <slug>`, `skills [category]`, `lang <es|en|fr>`, `theme [light|dark]`, `contact`, `clear` and `search <text>`, with output localized to the current page language.

#### Scenario: Unknown command

- **WHEN** the visitor runs `foo`
- **THEN** the terminal answers that the command is unknown and suggests `help`

#### Scenario: Former ask command

- **WHEN** the visitor runs `ask <question>`
- **THEN** the terminal answers that the command is unknown and suggests `help`

#### Scenario: Open a project

- **WHEN** the visitor runs `cat <slug>` for an existing project
- **THEN** the project summary is printed

## REMOVED Requirements

### Requirement: Questions with graceful fallback

**Reason**: Se elimina el RAG; no hay servicio de preguntas al que enviar `ask`.
**Migration**: Usar `search <text>`.
