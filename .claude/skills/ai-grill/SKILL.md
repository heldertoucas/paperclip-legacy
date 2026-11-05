---
name: ai-grill
description: >-
  Relentlessly stress-tests a plan, design, or proposal through interactive
  structured questions before implementation.
---
# 🔥 AI Grill & Plan Stress-Testing (`/ai-grill`)

Conducts a rigorous technical interview to de-risk proposals, challenge assumptions, and resolve architectural dependencies before code is written.

## 📋 Core Rules

1. **One Question at a Time**: Ask questions one at a time, allowing the user to answer before moving to the next branch of the design tree.
2. **Explore Codebase First**: Autonomously inspect the active repository, canonical vault, and existing OpenSpecs before asking. Never ask what the codebase or registries can answer.
3. **Structured Options with Recommendation**: Every question must follow the DU Universal Interaction rule:
   - Provide $\ge 3$ concrete numbered options.
   - List your recommended option first with `(Recommended)`.
   - Provide an Open Answer / Other option as the final option.
   - Alternatively, invoke the interactive `ask_question` tool when supported by the UI.
4. **No Premature Implementation**: Do not write project code or commit changes until the interview is complete and aligned.

---

## 🎯 Development Universe & OpenSpec Integration

1. **OpenSpec Stress-Testing**:
   - When a proposal or design in `openspec/changes/<change-key>/` is in draft state, use `/ai-grill` to probe edge cases, performance bottlenecks, and migration paths.
   - Record resolved decisions into `openspec/changes/<change-key>/design.md`.
2. **Canonical Architectural Decisions (ADRs)**:
   - If key architectural decisions emerge, propose them to DU memory:
     ```bash
     python -m dev.cli memory propose "ADR Title" --type decision --content "Context, decision, and consequences"
     ```
