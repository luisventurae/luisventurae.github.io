# stack-map Specification

## Purpose

Mostrar las tecnologías dominadas de forma explorable y conectada con los proyectos donde se usaron.

## Requirements

### Requirement: Categorized technologies

The stack map SHALL list technologies grouped in the categories Backend, Frontend and Other, with a visual weight given by the usage tier (daily use, used in production, exploring) instead of a numeric proficiency level, and SHALL show a localized legend for the three tiers. No numeric self-rating SHALL be displayed.

#### Scenario: Category filter

- **WHEN** the visitor selects the "Frontend" category
- **THEN** only Frontend technologies remain visible

#### Scenario: Tier weight

- **WHEN** the stack map is rendered
- **THEN** daily-use technologies such as Node.js are more prominent than exploring technologies such as Kafka, and the legend names the three tiers

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
