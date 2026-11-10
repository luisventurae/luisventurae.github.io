# Spec Delta

## Purpose

Verificar automáticamente cada cambio y desplegar web y API solo desde la rama de producción.

## ADDED Requirements

### Requirement: Checks on integration
Every pull request to `develop` or `master` and every push to `develop` SHALL run formatting check, lint, type check, unit tests with coverage thresholds, end-to-end tests and production builds; any failure SHALL mark the run as failed.

#### Scenario: Lint error
- **WHEN** a pull request introduces a lint error
- **THEN** the checks fail and report the error

### Requirement: Release pull request
When checks pass on `develop`, the pipeline SHALL open or update a single pull request from `develop` to `master` listing the new commits.

#### Scenario: Existing release PR
- **WHEN** checks pass on `develop` and a release PR is already open
- **THEN** that PR is updated instead of creating a new one

### Requirement: Production deployment
A push to `master` SHALL publish the built web app to the `gh-pages` branch and SHALL deploy the API only when API or shared code changed.

#### Scenario: Web-only change
- **WHEN** a merge to `master` only changes web files
- **THEN** the web is published and the API deploy is skipped
