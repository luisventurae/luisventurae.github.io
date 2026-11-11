# Spec Delta

## Purpose

Primera impresión del sitio: presenta nombre y rol con tipografía interactiva en lugar de una fotografía.

## ADDED Requirements

### Requirement: Identity presentation

The hero SHALL display the name "Luis Ventura E", the role and a short localized tagline, and SHALL NOT display a portrait photo.

#### Scenario: Content visible without JavaScript

- **WHEN** the page loads with JavaScript disabled
- **THEN** the name, role and tagline are readable

### Requirement: Draggable letters

Each letter of the name SHALL be draggable with a pointer or finger and SHALL return to its original position with a spring when released.

#### Scenario: Drag and release

- **WHEN** the visitor drags a letter and releases it
- **THEN** the letter springs back to its resting position

#### Scenario: Not a barrier to reading

- **WHEN** a screen reader reads the hero
- **THEN** the name is announced once as a whole word, not letter by letter

### Requirement: Rotating role

The hero SHALL cycle through a short list of localized role descriptions, pausing when reduced motion is requested.

#### Scenario: Reduced motion pauses rotation

- **WHEN** reduced motion is requested
- **THEN** a single role description is shown without rotation
