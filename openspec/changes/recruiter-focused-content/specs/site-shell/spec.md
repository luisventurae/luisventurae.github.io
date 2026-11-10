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

### Requirement: Scroll reveal

Content of the home sections below the hero SHALL reveal with a short, staggered entrance the first time it enters the viewport, and SHALL NOT replay on later scrolls. The content SHALL be fully visible without JavaScript, and with reduced motion only opacity SHALL change.

#### Scenario: Readable without JavaScript

- **WHEN** a visitor opens `/` with JavaScript disabled and scrolls to the experience section
- **THEN** every experience entry is visible without waiting for any animation

#### Scenario: Reveal once

- **WHEN** a visitor scrolls past the experience section and back up
- **THEN** the entries stay visible and do not animate again

#### Scenario: Reduced motion

- **WHEN** reduced motion is requested and a section enters the viewport
- **THEN** its content fades in without moving
