---
name: ai-orchestrate
description: >-
  Orchestrate parallel workers across independent work packets with verifiable
  done_when. Use quando existirem ≥3 tarefas independentes. For fewer tasks,
  tightly-coupled code, or reviews, use cavecrew, agent-team, or ai-council.
---
# 🎼 Orchestration Protocol (`/ai-orchestrate`)

Use this skill to decompose large goals or OpenSpec changes into isolated, verifiable Work Packets, dispatching them to parallel workers across logical capability tiers.

---

## 1. 🚪 Triage Gate (Triagem Obrigatória)

The manager MUST evaluate incoming work before launching any workers or creating worktrees:
1. Count only **uncompleted tasks** and **independent packets** (with disjoint `allow` sets).
2. If total independent packets < 3:
   - **EXIT IMMEDIATELY** with recommendation to **"work inline"**.
   - Direct the operator to the appropriate sibling skill:
     - `cavecrew`: for quick surgical edits (1-2 files) with compressed context.
     - `agent-team`: for tightly-coupled interactive pair work.
     - `ai-council`: for multi-agent review, debate, and architectural design.
3. If independent packets ≥ 3: proceed to **Detect** step and **Operator Preview**.

---

## 2. 🔍 Detect Step & Capability Degradation

1. Detect the active harness signature at startup (native delegation tool, environment flags, or CLI binary). If ambiguous, ask the operator.
2. Load only the reference file for the active harness from `references/harness-<active>.md`.
3. Select delegation tier according to availability:
   - **Tier 1 (Native Tool)**: Harness native spawn/subagent tool.
   - **Tier 2 (CLI / MCP)**: CLI runner (`exec`, `--print`, `run`, `-p`).
   - **Tier 3 (In-Context Simulation)**: Sequential reasoning only. **Strictly forbidden for write packets.**
4. **Invariant**: `done_when` execution **NEVER** degrades. The manager executes every verification command directly in its own clean host shell.

---

## 3. 🎯 Logical Model Tiers & Budget Ceilings

Packets declare abstract logical tiers, **never concrete vendor model names**:
- **`T1` (Worker)**: Fast, cost-efficient worker for mechanical implementation, localization, and tests.
- **`T2` (Manager)**: Medium-capacity model for triage, decomposition, routing, verification, and integration.
- **`T3` (Specialist)**: High-reasoning model for architectural review, ambiguity resolution, or root-cause diagnosis. **Always read-only.**

### Fixed Budget Ceilings (v1)
- **Parallel Workers**: Maximum `N=4` concurrent workers (`N=2` on Windows, marked `unverified@PC`).
- **Escalations**: Maximum `M=2` escalations to `T3` per run.
- **Attempts**: Maximum 2 attempts per packet before halting.
- **Delegation Depth**: Depth 1 only. Workers are strictly instructed **not** to spawn subagents.

---

## 4. 📐 Work Packet Contract & Schema

Every unit of delegated work MUST satisfy this exact schema:

```yaml
id: "P01"                              # Unique packet identifier (e.g. P01, P02)
goal: "Concise description of task"    # Explicit statement of what needs to be done
allow:                                 # Writable file paths permitted for this worker
  - "src/module/feature.py"
  - "tests/test_feature.py"
deny:                                  # Mandatory forbidden paths (enforced mechanically)
  - "home/00-inbox/**"
  - "home/01-areas/**"
  - "home/02-projects/**"
  - "home/03-knowledge/**"
  - "home/04-decisions/**"
  - "home/08-system/constraints/**"
  - "openspec/changes/*/tasks.md"
done_when: "pytest tests/test_feature.py" # Verifiable shell command executed by manager
budget:
  max_attempts: 2
  timeout_seconds: 300
worker: "T1"                           # Requested logical tier (T1, T2, T3)
escalate_to: "T3"                      # Logical escalation tier on repeated failure
data_class: "sensitive"                # Classification: public | internal | sensitive
return:                                # Expected return artifact from worker
  format: "diff_and_evidence"          # Git diff + raw execution output (no conversational summary)
```

### Safety & Authority Rules
- **Mandatory Deny**: All packets MUST include the Obsidian Vault, architectural decisions (`04-decisions/`), system constraints (`08-system/constraints/`), durable knowledge (`03-knowledge/`), and the active change's `tasks.md`.
- **Default Data Class**: If omitted, `data_class` defaults to `sensitive`. Sensitive packets can only be routed to non-public, authenticated providers with zero-retention compliance (DEC-0044).
- **Untrusted Output**: Worker diffs and outputs are untrusted. Direct memory writes (`ai-remember`, `ai-decide`, `ai-steps`) are forbidden during a run without immediate operator confirmation.

---

## 5. 🛑 STOP Message Standards

When an invariant is violated, an attempt budget is exhausted, or verification fails, the manager halts and emits a standardized STOP message:

### Format
`STOP <CODE> [<PACKET_ID>]: <Reason details>. Options: [<keys>]`

### Canonical STOP Examples
1. **Repeated Verification Failure**:
   ```
   STOP E01 [P04]: done_when failed 2x (command: 'npm test', exit code: 1).
   Options: [r]etry with advice | [e]scalate to T3 specialist | [s]kip packet | [a]bort run
   ```
2. **Environment / Verification Block**:
   ```
   STOP E02 [MANAGER]: cannot execute done_when command (missing dependency in host shell).
   Options: [f]ix environment | [a]bort run
   ```
3. **Boundary Violation**:
   ```
   STOP S01 [P02]: worker modified file outside allow set ('03-knowledge/system/rules.md').
   Options: [r]eject worker changes and retry | [a]bort run
   ```

---

## 6. 🔄 Escalation Protocol

1. If a `T1` worker fails its `done_when` command twice:
   - Manager checks if escalation ceiling (`M=2`) is reached.
   - If below ceiling: manager launches a read-only `T3` specialist to analyze the diff, test logs, and failure cause.
   - The specialist produces a concise advisory recommendation.
   - Manager relaunches the `T1` worker with the specialist's advice injected into its context.
2. If ceiling is reached: emit `STOP E01` to operator.
