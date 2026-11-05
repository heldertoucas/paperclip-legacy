---
name: opsx-archive
description: >-
  Archive an OpenSpec change and perform mandatory DU Session Reflection to
  stage candidate memory
---
# 📦 OpenSpec: Archive Change & DU Reflection (`/opsx-archive`)

Use this skill when concluding and archiving an OpenSpec change.

## Invariant (CON-0016)
Archiving an OpenSpec change requires a mandatory DU Session Reflection step to extract and stage reusable knowledge as `MEM-*` candidates.

## Procedure
1. Verify that all implementation tasks are completed with execution logs (`[x]`).
2. Move the change to the archive:
   - For `.lite.md`: move directly to `openspec/archive/<change>.lite.md`.
   - For multi-file changes: move the folder to `openspec/archive/YYYYMMDD-<change-title>/`.
3. **Mandatory DU Session Reflection**:
   Ask the following distillation checks:
   - *Was an architectural decision made during this change?* $\rightarrow$ Propose candidate:
     ```bash
     python -m dev.cli memory propose "$TITLE" --type decision --content "$RATIONALE"
     ```
   - *Was a reusable pattern or complex trap discovered?* $\rightarrow$ Propose candidate:
     ```bash
     python -m dev.cli memory propose "$TITLE" --type <pattern|problem> --content "$DETAILS"
     ```
4. Stage proposed candidates in `home/08-system/candidates/` and notify the user that they are ready for review via `/ai-review-memory`.
5. **Governance Reminder**: OpenSpec change completion NEVER autonomously promotes canonical memory.
