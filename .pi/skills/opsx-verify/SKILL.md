---
name: opsx-verify
description: Verify an applied OpenSpec change against test suites and quality gates
---
# ✅ OpenSpec: Verify Change (`/opsx-verify`)

Use this skill to validate that an applied OpenSpec change meets all acceptance criteria.

## Procedure
1. Run relevant automated test suites:
   ```bash
   python -m unittest discover -s tests
   ```
2. Verify quality gates (linting, types, formatters).
3. Run `dev doctor` to guarantee zero architectural cache violations.
4. Confirm that all spec checklist items are marked `[x]` with nested execution timestamps.
