# terminal Specification

## Purpose

Terminal interactiva que permite recorrer el portafolio con comandos y hacer preguntas sobre el perfil.

## Requirements

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

### Requirement: Keyboard ergonomics

The terminal SHALL offer command history with Up/Down, autocompletion of commands and project slugs with Tab, and a global shortcut (backtick) to focus it; keyboard-triggered opening SHALL NOT animate.

#### Scenario: History

- **WHEN** the visitor presses Up after running two commands
- **THEN** the last command is restored in the prompt

### Requirement: Text search

`search` SHALL return the best-matching content fragments with their source section, working offline from a prebuilt index.

#### Scenario: No results

- **WHEN** the search text matches nothing
- **THEN** a localized "no results" message is shown
