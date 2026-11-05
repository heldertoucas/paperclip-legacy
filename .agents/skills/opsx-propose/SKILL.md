---
name: opsx-propose
description: >-
  Create a DU context-grounded OpenSpec proposal for a feature or architectural
  change
---
# 📝 OpenSpec: DU Context-Grounded Proposal (`/opsx-propose`)

Use this skill when drafting a new change proposal in a repository managed by the Development Universe.

## Invariant (CON-0016)
No OpenSpec change may begin substantial architectural planning without querying the DU Context Engine.

## Procedure
1. Query active DU context and constraints:
   ```bash
   python -m dev.cli context --intent "$CHANGE_INTENT"
   ```
2. Review retrieved Decisions (`DEC-*`), Constraints (`CON-*`), and Patterns (`PAT-*`).
3. Generate the proposal artifact under `openspec/proposals/YYYYMMDD-<change-title>.md`:
   ```yaml
   ---
   title: "<Proposal Title>"
   type: proposal
   status: proposed
   project: <PRJ-ID>
   created: "YYYY-MM-DD"
   relevant_decisions: ["DEC-XXXX"]
   relevant_constraints: ["CON-XXXX"]
   ---
   ```
4. Structure the proposal:
   - **Problem & Context**: Grounded in current project state.
   - **Proposed Solution**: Architectural components and boundary definitions.
   - **Impacted Files & Repositories**: Concrete paths.
   - **Non-Goals & Alternatives**: Scope limits.
5. Present the proposal for human review before proceeding to specification.
