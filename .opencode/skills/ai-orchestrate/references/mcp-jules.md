# Harness Reference: Jules (Remote-Async) — Out of Scope for v1

## 1. Classification & Scope
- **Class**: `remote-async`
- **Status in v1**: **FORA DA V1 (Out of Scope)**
- **Rejection Message**:
  `REJECTED: Jules (remote-async) is out-of-scope for v1. Packets must use local harnesses (claude, codex, agy, opencode, omp, pi).`

## 2. Pre-Conditions for Future v2 Inclusion
- Clean committed `HEAD` and pushed remote tracking branch.
- Dedicated GitHub PR created by Jules Copilot.
- Non-blocking execution loop with local manager checkout and independent `done_when` execution before any merge.
