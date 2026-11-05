---
name: du-knowledge-propose
description: >-
  Propose an engineering pattern, trap, or knowledge item in the Development
  Universe
---
# Propose Engineering Knowledge Candidate

When encountering a reusable technical pattern, a resolved problem trap, or an architectural constraint:

```bash
python -m dev.cli memory propose "$TITLE" --type pattern --content "$CONTENT" --project "$PROJECT_ID" --session "$SESSION_ID"
```

Replace `--type` with `pattern`, `problem`, `knowledge`, or `constraint` as appropriate.
All candidates stage in `08-system/candidates/` for human review via `dev memory review`.
