# Spec Delta

## REMOVED Requirements

### Requirement: Local-only availability

**Reason**: Se elimina el RAG; ya no existen endpoints `/rag/*`.
**Migration**: Ninguna; las rutas responden 404 como cualquier ruta desconocida.

### Requirement: Content indexing

**Reason**: Sin RAG no hay índice vectorial ni herramienta de ingesta.
**Migration**: Usar `search-index.json` con `search` en la terminal.

### Requirement: Grounded answers with sources

**Reason**: Sin RAG no hay generación de respuestas.
**Migration**: La terminal usa `search`.

### Requirement: Input limits

**Reason**: El endpoint `/rag/ask` deja de existir.
**Migration**: Ninguna.
