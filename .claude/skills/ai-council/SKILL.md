---
name: ai-council
description: >-
  Evaluate, review, and stress-test architectural plans, OpenSpec proposals, and
  code changes using multi-agent debate. Usar ai-orchestrate quando existirem ≥3
  tarefas independentes com done_when. Use for complex proposals or when user
  invokes /ai-council. Do not use for routine bug fixes.
metadata:
  targets:
    - '*'
---
# 🏛️ AI Council & Critical Review (`/ai-council`)

Orchestrates critical logical, security, architectural, and quality reviews over specifications (OpenSpec), architectural decisions, or code changes using multi-agent debate and self-reflection.

## 1. Complexity Triage

Select the appropriate review intensity:

* **Mode 1: Rapid Reflection (Self-Correction):** For localized scripts, minor bug fixes, or documentation updates. The primary agent self-corrects the plan.
* **Mode 2: Devil's Advocate (Dual Red Teaming):** For API designs, persistence schemas, authentication, and security boundaries. Invokes a dedicated Red Teamer subagent to probe edge cases and attack vectors.
* **Mode 3: The Council (Full AI Council):** For new system architectures, major refactorings, or complex cross-project proposals. Convenes four specialized personas.

---

## 2. Council Personas (Mode 3)

* **The Red Teamer (Adversarial Critic):** Probes attack vectors, injection vulnerabilities, race conditions, edge cases, and unexpected inputs. Goal: Expose where and how the system fails.
* **The Software Architect:** Focuses on coupling, cohesion, SOLID/DRY principles, extensibility, and maintainability.
* **The Product & Resilience Engineer:** Focuses on graceful degradation, error handling, log observability, telemetry, and user ergonomics.
* **The UI/UX & Design Specialist:** Focuses on design systems, visual hierarchy, responsive layout, typography, and micro-interactions.

---

## 3. Orchestration & Tooling Tiers

1. **Native Subagents (Tier 1 - Preferred):** Use `invoke_subagent` to spawn concurrent subagents with specialized roles:
   ```json
   {
     "Subagents": [
       {
         "TypeName": "self",
         "Role": "Software Architect",
         "Prompt": "Review this proposal for coupling, scalability, and technical debt. Provide concrete code examples."
       },
       {
         "TypeName": "self",
         "Role": "Red Teamer",
         "Prompt": "Ruthlessly audit this design for race conditions, security flaws, and failure modes."
       }
     ]
   }
   ```
2. **OpenCode Subagent Fallback (Tier 2):** If native subagent tools are unavailable, delegate via OpenCode MCP (`opencode_fire` / `opencode_run`).
3. **In-Context Simulation (Tier 3):** If no delegation tools are present, sequentially assume each persona directly in the conversation with explicit prefixes (`[Architect]:`, `[Red Teamer]:`).

---

## 4. Development Universe Memory & OpenSpec Integration

* **OpenSpec Integration:** If reviewing an active OpenSpec change, record the synthesized council verdict and action items into `openspec/changes/<change-key>/design.md`.
* **Durable Invariants:** If the council establishes an architectural constraint or pattern, stage it as a memory candidate:
  ```bash
  python -m dev.cli memory propose "Title" --type pattern --content "Description of invariant"
  ```

---

## 5. Anti-Patterns & Boundaries

- Do not provide vague, generic feedback; require concrete line numbers, failure scenarios, and code diffs.
- Avoid rubber-stamping proposals without challenging fundamental assumptions and edge cases.
- Never create ad-hoc cache files (`hot.md`, `.ai-session.json`) outside the official Development Universe storage.

## 6. Safety

- Shell commands (e.g. `dev.cli memory propose`) only stage proposals into local storage and never modify production state without user consent.
- Subagents run in read-only / isolated workspaces without write access to parent git worktrees unless explicitly configured.

## 7. Validation & Feedback Loop

1. Synthesize all persona findings into a structured rubric table (Architecture, Security, Resilience, UX).
2. Rate each dimension (Pass, Concern, Blocker).
3. If blockers are identified, halt execution and prompt the user with concrete remediation options before proceeding.
