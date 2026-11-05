---
name: opsx-explore
description: >-
  Explore ideas, investigate codebases, and map architectural requirements
  grounded in DU context before speccing. Use when exploring what to build or
  fix.
---
# 🧭 OpenSpec: DU-Grounded Exploration Mode (`/opsx-explore`)

Use this skill as a **thinking partner** to explore ideas, investigate codebase architecture, and clarify requirements before generating change specifications.

## Strict Invariant
**Exploration mode is strictly read-only and analytical.** You may read files, query graphs, and inspect the codebase, but you must **NEVER write production code**.

---

## Procedure

### Step 1: Query DU Memory & Constraints (CON-0016)
Before formulating any architectural direction, query the Development Universe context:
```bash
python -m dev.cli context --intent "$TOPIC_OR_PROBLEM"
```
Inspect returned Decisions (`DEC-*`), Constraints (`CON-*`), and known Problems (`PRB-*`) to ensure alignment with existing architectural invariants.

### Step 2: Codebase Investigation
- Locate relevant files, symbols, and dependencies without modifying them.
- Identify integration points, potential bottlenecks, and patterns already in use.
- Highlight hidden complexity or conflicting assumptions.

### Step 3: Comparative Analysis & Visualization
- Explore multiple architectural options and tradeoffs.
- Use ASCII or Mermaid diagrams liberally to visualize state machines, workflows, or component boundaries.
- Distinguish between *Facts*, *Assumptions*, and *Recommendations*.

### Step 4: Next-Steps Handoff
Once the scope and solution shape are clear, present the conclusion to the user and ask which workflow they prefer:
1. **Lightweight (Single-File)**: Proceed with `/opsx-lite` to generate `openspec/changes/<change>.lite.md` in one step.
2. **Full Specification**: Proceed with `/opsx-propose` to generate formal multi-file artifacts.
3. **Continue Exploring**: Remain in explore mode to investigate further details.
