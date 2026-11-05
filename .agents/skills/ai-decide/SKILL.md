---
name: ai-decide
description: Propose an architectural decision record (ADR) as a memory candidate
---
# 🏛️ Record Architectural Decision (`/ai-decide`)

Use this skill when an architectural choice, design pattern, or invariant is established.

## Procedure
1. **Graduated Interaction**:
   - For material architectural choices, present ≥3 numbered options with `(Recommended)` first + an explicit `Other / Freeform` option.
   - For binary technical trade-offs, present 2 options + `Other`.
2. Structure the decision:
   - **Title**: Clear statement of the decision.
   - **Context**: Problem background, forces, and constraints evaluated.
   - **Decision**: What was chosen.
   - **Consequences**: Trade-offs, positive and negative impacts.
3. Propose as a candidate:
   ```bash
   python -m dev.cli memory propose "$TITLE" --type decision --content "$CONTEXT\n\n### Decision\n$DECISION\n\n### Consequences\n$CONSEQUENCES" --confidence high --scope <project|global>
   ```
4. **Scope Governance**: Project-specific decisions remain in project scope. Global scope requires explicit justification and formal human approval.
5. The candidate is staged in `home/08-system/candidates/` for formal human review. Never promote autonomously.
