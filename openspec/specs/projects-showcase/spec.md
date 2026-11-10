# projects-showcase Specification

## Purpose

Presentar los proyectos relevantes con una vista de detalle navegable mediante gestos, teclado y botones.

## Requirements

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

### Requirement: Featured projects

Projects marked as featured SHALL be rendered more prominently than the rest of the list, and the list SHALL include the portfolio itself as a project.

#### Scenario: Featured card

- **WHEN** the projects section is rendered on a wide screen
- **THEN** the Ticker and portfolio cards span more width than non-featured cards

### Requirement: Case study structure

The detail of each project SHALL state, in the page locale, the author's role and the context, challenge, technical decisions and outcome of the project.

#### Scenario: Role shown

- **WHEN** the visitor opens the Ticker project
- **THEN** the drawer shows the author's role alongside the period and technologies
