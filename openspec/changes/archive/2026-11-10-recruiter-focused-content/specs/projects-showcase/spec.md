# Spec Delta

## ADDED Requirements

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
