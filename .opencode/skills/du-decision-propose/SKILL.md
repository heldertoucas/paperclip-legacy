---
name: du-decision-propose
description: Propose an architectural decision as a candidate in the Development Universe
---
# Propose Architectural Decision Candidate

When you discover an architectural decision that should be recorded for long-term project durability, propose it as a candidate rather than writing directly to canonical memory:

```bash
python -m dev.cli memory propose "$TITLE" --type decision --content "$CONTENT" --project "$PROJECT_ID" --session "$SESSION_ID"
```

## Guidance
1. Keep the rationale focused and include context, chosen decision, and trade-offs.
2. The candidate will be staged in `home/08-system/candidates/` awaiting human governance review via `dev memory review`.
