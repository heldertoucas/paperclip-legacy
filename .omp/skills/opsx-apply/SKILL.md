---
name: opsx-apply
description: >-
  Execute tasks defined in an approved OpenSpec specification and log execution
  provenance
---
# ⚙️ OpenSpec: Apply Change Tasks (`/opsx-apply`)

Use this skill when implementing an approved OpenSpec specification.

## Procedure
1. Read the active spec and task checklist from:
   - `openspec/changes/<change>.lite.md` (for lightweight single-file changes)
   - Or `openspec/changes/<change>/tasks.md` / `specs/<change>-spec.md` (for full multi-file changes).
2. Execute tasks sequentially:
   - Make minimal, verified code changes.
   - Run tests to confirm zero regression.
3. **OpenSpec Task Completion & Evidence-Before-Check (CON-0012)**:
   - **Mandatory Verification**: Never mark a task complete `[x]` without observable execution evidence from previous tool calls, compilations, or passing tests.
   - **Nested Execution Log**: Append an indented execution bullet directly beneath the completed task:
     `- *Executed YYYY-MM-DD*: <Brief summary of what changed and validation evidence/roadblocks>`
   - **Proportional Density**:
     - *Atomic/Trivial Tasks*: Single-line summary with validation proof (e.g., `- *Executed YYYY-MM-DD*: Created config.json. Verified via ls.`).
     - *Structural/Logical Tasks*: Detail affected modules, passing test counts, and any roadblocks hit.
4. If reusable patterns, architectural decisions, or traps were encountered, stage them as candidates:
   ```bash
   python -m dev.cli memory propose "$TITLE" --type <decision|pattern|problem> --content "$CONTENT"
   ```
