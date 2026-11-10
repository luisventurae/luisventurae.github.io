# Spec Delta

## ADDED Requirements

### Requirement: Home section order

Each localized home page SHALL present its sections in this order: hero, About, Experience, Projects, Stack, CV, Terminal; the main navigation SHALL list the same sections in the same order.

#### Scenario: Proof before tools

- **WHEN** a visitor scrolls `/` from the top
- **THEN** About, Experience and Projects appear before Stack, and the Terminal is the last section

#### Scenario: Navigation matches page

- **WHEN** the main navigation is inspected on `/fr/`
- **THEN** its links follow the same order as the sections on the page
