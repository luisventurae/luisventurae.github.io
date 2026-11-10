# Spec Delta

## Purpose

Presentar los proyectos relevantes con una vista de detalle navegable mediante gestos, teclado y botones.

## ADDED Requirements

### Requirement: Project list

The site SHALL list projects ordered by their configured order, showing for each one its title, short description, company and main technologies.

#### Scenario: Localized list

- **WHEN** a visitor opens `/fr/`
- **THEN** project titles and descriptions are shown in French

### Requirement: Project detail drawer

Opening a project SHALL show a drawer with its media gallery, period, full description, technologies and external link when available. The drawer SHALL close with Escape, a close button, a click outside or a downward swipe.

#### Scenario: Open and close

- **WHEN** the visitor opens a project and presses Escape
- **THEN** the drawer closes and focus returns to the project that opened it

### Requirement: Navigate between projects

Inside the drawer the visitor SHALL be able to move to the previous or next project with buttons, arrow keys, or a horizontal swipe; a fast flick SHALL be enough to change project, and at the first or last project the swipe SHALL resist instead of wrapping.

#### Scenario: Swipe to next

- **WHEN** the visitor flicks left quickly on the drawer content
- **THEN** the next project is shown

#### Scenario: Edge resistance

- **WHEN** the visitor swipes right on the first project
- **THEN** the content moves with increasing resistance and returns without changing project

### Requirement: Pending media marker

Projects whose media is not yet provided SHALL render a neutral placeholder rather than a broken image.

#### Scenario: Missing media

- **WHEN** a project has no media entries
- **THEN** a styled placeholder with the project initials is shown
