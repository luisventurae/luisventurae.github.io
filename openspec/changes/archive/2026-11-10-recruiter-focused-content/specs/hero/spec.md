# Spec Delta

## MODIFIED Requirements

### Requirement: Identity presentation

The hero SHALL display the name "Luis Ventura E", the role "Backend Engineer · Node.js" and a short localized tagline, and SHALL NOT display a portrait photo.

#### Scenario: Content visible without JavaScript

- **WHEN** the page loads with JavaScript disabled
- **THEN** the name, role and tagline are readable

### Requirement: Rotating role

The hero SHALL cycle through a short list of localized complementary role descriptions, pausing when reduced motion is requested. Key facts (role, years of experience, main stack, availability) SHALL NOT be part of the rotation.

#### Scenario: Reduced motion pauses rotation

- **WHEN** reduced motion is requested
- **THEN** a single role description is shown without rotation

#### Scenario: Key facts never rotate

- **WHEN** the rotation advances to the next description
- **THEN** the role, years of experience, main stack and availability remain visible and unchanged

## ADDED Requirements

### Requirement: Key facts line

The hero SHALL show a static, localized line with the years of experience and main stack (Node.js, TypeScript, AWS), and an availability badge stating remote or hybrid work in Peru, both readable without JavaScript.

#### Scenario: Recruiter scan

- **WHEN** a visitor opens `/` on 2026-11-10 with JavaScript disabled
- **THEN** the hero shows "7 años" with Node.js, TypeScript and AWS, and a badge saying the author is available for remote or hybrid roles in Peru
