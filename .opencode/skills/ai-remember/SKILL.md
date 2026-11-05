---
name: ai-remember
description: >-
  Propose a reusable technical pattern, trap, problem, or knowledge note as a
  memory candidate
---
# 💡 Propose Memory Candidate (`/ai-remember`)

Use this skill when recording valuable knowledge discovered during pair programming.

## Procedure
1. Classify the entity type (`pattern`, `problem`, `knowledge`, `constraint`, or `decision`).
2. Propose the candidate:
   ```bash
   python -m dev.cli memory propose "$TITLE" --type <type> --content "$CONTENT" --confidence high --scope <project|global>
   ```
3. **Scope & Governance Safeguard**:
   - Keep project-specific knowledge confined to the active project scope.
   - Global promotions require explicit rationale and human authorization via `/ai-review-memory`. Never infer approval from conversational text.
4. Confirm to user that candidate `MEM-*` has been staged in `home/08-system/candidates/` with full provenance awaiting human review.
5. **Fail-Closed Rule**: Never mutate or establish canonical records silently. Direct filesystem writes to canonical paths are strictly forbidden.
