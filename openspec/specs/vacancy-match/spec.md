# vacancy-match Specification

## Purpose

Juego breve y opcional para reclutadores que compara los requisitos de su vacante con el perfil del autor, muestra pruebas concretas y conduce al formulario del CV.

## Requirements

### Requirement: Requirement selection

The CV section SHALL present a localized list of vacancy requirements as toggle buttons that the visitor can select and deselect by pointer, touch or keyboard, each exposing its pressed state to assistive technology.

#### Scenario: Keyboard toggle

- **WHEN** a requirement button is focused and the visitor presses Space
- **THEN** the requirement becomes selected and its pressed state is announced

### Requirement: Evidence per requirement

Each selected requirement SHALL reveal a short localized piece of evidence from the author's experience, or an honest statement when the author does not meet it.

#### Scenario: Met requirement

- **WHEN** the visitor selects "AWS"
- **THEN** a line of evidence mentioning AWS CDK at Prestamype is shown

#### Scenario: Unmet requirement

- **WHEN** the visitor selects "Presencial"
- **THEN** a localized statement says the author looks for remote or hybrid roles

### Requirement: Honest match score

The section SHALL show a match percentage equal to the average strength of the selected requirements, where each requirement is fully met (100), partially met (50) or not met (0), and SHALL announce the updated percentage politely to screen readers. With no selection, no percentage SHALL be shown.

#### Scenario: Mixed selection

- **WHEN** the visitor selects one fully met and one partially met requirement
- **THEN** the match shows 75%

#### Scenario: Empty selection

- **WHEN** the visitor deselects every requirement
- **THEN** the percentage is hidden and an invitation to pick requirements is shown

### Requirement: Path to the CV form

After at least one selection the section SHALL offer a call to action that reveals the CV form, and a "skip to the form" control SHALL be available at any time. The selected requirements SHALL be submitted with the CV request.

#### Scenario: Skip

- **WHEN** the visitor activates "skip to the form" without selecting anything
- **THEN** the CV form is shown and focus moves to its first field

#### Scenario: Interests travel with the request

- **WHEN** the visitor selects "Node.js" and "AWS" and submits the form
- **THEN** the CV request includes both requirement identifiers as interests

### Requirement: Motion and reduced motion

The match meter SHALL animate its fill with a short spring when the score changes, and SHALL update without positional or scale motion when reduced motion is requested.

#### Scenario: Reduced motion

- **WHEN** reduced motion is requested and the score changes
- **THEN** the meter reaches its new value without animating its size
