# Spec Delta

## Purpose

Terminal interactiva que permite recorrer el portafolio con comandos y hacer preguntas sobre el perfil.

## ADDED Requirements

### Requirement: Command set

The terminal SHALL support the commands `help`, `whoami`, `ls projects`, `cat <slug>`, `skills [category]`, `lang <es|en|fr>`, `theme [light|dark]`, `contact`, `clear`, `search <text>` and `ask <question>`, with output localized to the current page language.

#### Scenario: Unknown command

- **WHEN** the visitor runs `foo`
- **THEN** the terminal answers that the command is unknown and suggests `help`

#### Scenario: Open a project

- **WHEN** the visitor runs `cat <slug>` for an existing project
- **THEN** the project summary is printed

### Requirement: Keyboard ergonomics

The terminal SHALL offer command history with Up/Down, autocompletion of commands and project slugs with Tab, and a global shortcut (backtick) to focus it; keyboard-triggered opening SHALL NOT animate.

#### Scenario: History

- **WHEN** the visitor presses Up after running two commands
- **THEN** the last command is restored in the prompt

### Requirement: Questions with graceful fallback

`ask` SHALL send the question to the question-answering service and stream the answer with its sources; when the service is unavailable it SHALL explain that answers are only available in local development and run `search` with the same text instead.

#### Scenario: Production fallback

- **WHEN** the visitor runs `ask what databases do you know?` on the published site
- **THEN** the terminal prints the local-only notice followed by text-search results

#### Scenario: Local answer

- **WHEN** the visitor runs `ask` in the local environment with the index loaded
- **THEN** the answer appears progressively and ends with the list of cited sources

### Requirement: Text search

`search` SHALL return the best-matching content fragments with their source section, working offline from a prebuilt index.

#### Scenario: No results

- **WHEN** the search text matches nothing
- **THEN** a localized "no results" message is shown
