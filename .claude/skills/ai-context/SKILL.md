---
name: ai-context
description: >-
  Inspect the current in-memory Context Capsule and understand why entities were
  selected
---
# 🔭 Context Observability & Inspection (`/ai-context`)

Use this skill when inspecting the context assembled for a task or understanding retrieval decisions.

## Procedure
1. Display the full Context Capsule:
   ```bash
   python -m dev.cli context --intent "$TASK_INTENT"
   ```
2. For historical time-travel debugging:
   ```bash
   python -m dev.cli context --intent "$TASK_INTENT" --as-of YYYY-MM-DD
   ```
3. To inspect why specific notes were included or excluded:
   - Check **Score / Distance**: Semantic vector proximity in LanceDB.
   - Check **Temporal Bounds**: `valid_at` and `invalid_at` filtering against reference time.
   - Check **Deduplication Tuples**: Redundant same-title items within the same scope collapsed.
