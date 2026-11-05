# Orchestration Reference: Test Cases & Fixtures

This document defines the canonical test cases and references the validated fixtures for `/ai-orchestrate`.

---

## 🧪 Caso A: Multi-Task Feature Implementation (Change Mode)
- **Intent**: Decompose a multi-task OpenSpec change with independent tasks into parallel git worktrees, merge each into the integration branch, run independent `done_when` checks, and fast-forward to the main branch upon operator approval.
- **Fixture**: Staged in `<conversation-scratch>/caso-a-fixture/` (Task 5.8).
  - 4 independent modules: `src/math_mod.py`, `src/str_mod.py`, `src/date_mod.py`, `src/log_mod.py`.
  - 4 test suites: `tests/test_math.py`, `tests/test_str.py`, `tests/test_date.py`, `tests/test_log.py`.
  - Disjoint `allow` sets, `tasks.md` in mandatory `deny`.
  - Wave dependency resolution tested via Task 5.3.

---

## 🔍 Caso B: Multi-Target Audit & Verification (Read-Only Mode)
- **Intent**: Dispatch read-only inspection or audit packets across multiple harnesses or targets simultaneously with `--yes` auto-approval.
- **Fixture & Provenance**: Validated via Rulesync target inspection (Task 1.1) and baseline capture (Task 1.2).
- **Constraints**:
  - All packets MUST declare read-only allow sets.
  - Zero modifications to repository working tree or Vault `deny` roots.
  - Generates final comparative audit matrix.

---

## 🚫 Caso D: Anti-Case (Triage Exit / Inline Work)
- **Intent**: Verify that trivial, single-file, or <3 task requests are rejected at the initial triage gate without launching workers, allocating worktrees, or writing run manifests.
- **Fixture**: Validated via Task 2.4 and Task 5.7 fixtures:
  - 2 open tasks in `tasks.md` -> Exits with `"work inline (use cavecrew, agent-team, or ai-council)"`.
  - Single-file edit request -> Exits immediately at triage with zero side effects.
