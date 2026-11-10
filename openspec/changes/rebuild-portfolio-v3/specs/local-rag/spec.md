# Spec Delta

## Purpose

Responder preguntas sobre el perfil y los proyectos usando recuperación sobre el contenido del sitio, disponible solo en el entorno local.

## ADDED Requirements

### Requirement: Local-only availability

The question-answering endpoints SHALL exist only when the API runs with RAG explicitly enabled; otherwise every `/rag/*` request SHALL respond 404.

#### Scenario: Production

- **WHEN** `/rag/ask` is called on the production API
- **THEN** the response is 404

### Requirement: Content indexing

The ingest tool SHALL read all site content in every locale, split it into fragments with their locale and source, compute embeddings and replace the stored index atomically.

#### Scenario: Re-ingest

- **WHEN** the ingest tool runs twice
- **THEN** the stored index contains only the fragments of the latest run

### Requirement: Grounded answers with sources

`POST /rag/ask` SHALL retrieve the most similar fragments (preferring the question's locale), generate an answer grounded only on them, stream it as it is produced, and finish with the list of sources used. When no fragment is relevant enough it SHALL say it does not know.

#### Scenario: Answer streamed

- **WHEN** a question about known databases is asked
- **THEN** text chunks arrive progressively and the final event lists the sources

#### Scenario: Out-of-scope question

- **WHEN** the question is unrelated to the portfolio content
- **THEN** the answer states that the information is not available

### Requirement: Input limits

`/rag/ask` SHALL reject questions longer than 500 characters with status 400.

#### Scenario: Too long

- **WHEN** a 501-character question is sent
- **THEN** the response is 400
