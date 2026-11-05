---
description: Propose an architectural decision record (alias for /ai-decide)
---
Redirects to `/ai-decide`:

Use the skill `ai-decide` to propose an Architectural Decision Record (ADR) as a candidate in the Development Universe:

```bash
python -m dev.cli memory propose "$TITLE" --type decision --content "$CONTEXT\n\n### Decision\n$DECISION\n\n### Consequences\n$CONSEQUENCES" --confidence high
```
