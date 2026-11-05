---
name: ai-review-memory
description: 'Review pending memory candidates for promotion, rejection, or deferral'
---
# ⚖️ Memory Governance Review (`/ai-review-memory`)

Use this skill when reviewing staged candidates with the user.

## Procedure
1. List pending candidates:
   ```bash
   python -m dev.cli memory candidates --status pending
   ```
   *(Ou `dev memory candidates --status pending` via CLI dispatcher).*
2. For candidate selected by user:
   - **Promote**: `python -m dev.cli memory promote <candidate-id>`
   - **Reject**: `python -m dev.cli memory reject <candidate-id> --reason "<reason>"`
   - **Defer**: `python -m dev.cli memory review <candidate-id> --action defer --reason "<reason>"`
3. If promoted, rebuild the index so the new canonical entity is immediately searchable:
   ```bash
   python -m dev.cli index build --rebuild
   ```
   *(Ou `dev index build --rebuild` / `dev index rebuild`)*
