# Documentación

Índice de búsqueda de la documentación técnica del portafolio.

## Qué documento responde qué

| Pregunta                                                                                                | Documento                                    |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| ¿Cómo nombro variables, funciones, tipos? ¿TDD, SOLID, commits?                                         | [Reglas de desarrollo](development-rules.md) |
| ¿Voz, paleta, tipografía, personalidad de la marca?                                                     | [Branding](branding.md)                      |
| ¿Tokens de color, espaciado, motion, componentes base, reglas para no divergir de estilo entre agentes? | [Sistema de diseño](design-system.md)        |
| ¿Qué apps y paquetes hay y cómo fluyen los datos?                                                       | [Arquitectura](architecture.md)              |
| ¿Qué es secreto, dónde vive, cómo se protege la API?                                                    | [Seguridad y secretos](security.md)          |
| ¿Cómo levanto el proyecto en local (Docker Compose, Mailpit)?                                           | [Entorno local](local-environment.md)        |
| ¿Cómo encuentro código o decisiones sin leer archivos enteros?                                          | [RAG para agentes](agent-rag.md)             |
| ¿Cómo se despliega? ¿CI/CD, GitHub Pages, Workers, rollback?                                            | [Despliegue](deployment.md)                  |
| ¿Qué cambio está en curso y qué comportamiento debe cumplir?                                            | [`../openspec/`](../openspec/)               |

## Buscar

Para preguntas conceptuales sobre código, docs, specs o commits usa el [RAG para agentes](agent-rag.md): `npm run -s rag -- search "<pregunta>"`. Para cadenas exactas, busca con `rg` en `docs/` y `openspec/` en lugar de leer archivos enteros.

```bash
rg -i "<término>" docs/ openspec/      # líneas que coinciden, con contexto de archivo
rg -il "<término>" docs/ openspec/     # solo los archivos que coinciden
```

Abre solo las secciones de los archivos que aparezcan. Al cambiar el comportamiento documentado, actualiza el documento en el mismo commit.
