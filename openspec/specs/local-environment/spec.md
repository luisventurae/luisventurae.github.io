# local-environment Specification

## Purpose

Levantar todo el sistema (web, API, modelos y bandeja de correo) en una máquina de desarrollo con un único comando.

## Requirements

### Requirement: One-command startup

Running `docker compose up` from the repository root SHALL start the web app, the API and a local mail inbox, with no external accounts, secrets or model downloads required.

#### Scenario: Fresh clone

- **WHEN** a developer clones the repository and runs `docker compose up`
- **THEN** the site is reachable on port 4321, the API on 8787 and the inbox on 8025

### Requirement: Local test doubles for external services

In local mode the captcha SHALL use the provider's always-pass test keys, emails SHALL be delivered to the local inbox, and the CV storage SHALL be seeded with a sample PDF.

#### Scenario: Local CV request

- **WHEN** the contact form is submitted locally
- **THEN** the notification appears in the local inbox and the CV downloads
