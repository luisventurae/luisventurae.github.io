# Spec Delta

## Purpose

Presentar al autor como profesional para reclutadores: quién es, qué busca, cuántos años de experiencia tiene y dónde ha trabajado, sin depender de la terminal ni de interacciones.

## ADDED Requirements

### Requirement: Years of experience

The site SHALL compute the years of experience as the number of complete years elapsed since the career start month (2019-01) at build time, and SHALL use that same value everywhere it is shown.

#### Scenario: Value at build time

- **WHEN** the site is built on 2026-11-10
- **THEN** every place that shows years of experience displays 7

#### Scenario: Year boundary

- **WHEN** the site is built on 2027-01-01
- **THEN** the years of experience shown are 8

### Requirement: About section

The home page SHALL render a localized "About" section from the profile content, stating what the author does, the kind of role sought (backend Node.js, remote or hybrid, Peru) and spoken languages, readable without JavaScript.

#### Scenario: Profile visible without the terminal

- **WHEN** a visitor opens `/en/` with JavaScript disabled
- **THEN** the About section shows the English profile text, including the role sought

### Requirement: Experience timeline

The home page SHALL list work experience in reverse chronological order, showing for each entry the company, localized role, engagement type (full-time, part-time or freelance), period and related projects. An ongoing entry SHALL display a localized "present" end.

#### Scenario: Current job first

- **WHEN** a visitor opens `/`
- **THEN** the first experience entry is Prestamype, full-time, from June 2024 to "actualidad"

#### Scenario: Engagement type visible

- **WHEN** a visitor reads the Instituto Cepeban entry
- **THEN** it is labelled as freelance

#### Scenario: Link to projects

- **WHEN** an experience entry has related projects
- **THEN** each related project is listed by title and links to its card in the projects section
