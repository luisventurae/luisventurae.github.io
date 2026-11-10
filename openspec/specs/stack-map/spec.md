# stack-map Specification

## Purpose

Mostrar las tecnologías dominadas de forma explorable y conectada con los proyectos donde se usaron.

## Requirements

### Requirement: Categorized technologies

The stack map SHALL list technologies grouped in the categories Backend, Frontend and Other, with a visual weight proportional to the proficiency level.

#### Scenario: Category filter

- **WHEN** the visitor selects the "Frontend" category
- **THEN** only Frontend technologies remain visible

### Requirement: Link to projects

Selecting or hovering a technology SHALL highlight the projects that use it and de-emphasize the others; selecting it again SHALL clear the highlight.

#### Scenario: Highlight projects

- **WHEN** the visitor selects "VueJs"
- **THEN** every project whose technologies include "VueJs" is highlighted and the rest are dimmed

#### Scenario: Technology without projects

- **WHEN** the visitor selects a technology used by no project
- **THEN** a localized message states that no listed project uses it

### Requirement: Keyboard and touch parity

Every interaction of the stack map SHALL be available by keyboard and touch, without relying on hover.

#### Scenario: Keyboard selection

- **WHEN** a technology chip is focused and the visitor presses Enter
- **THEN** the same highlight as a click is applied
