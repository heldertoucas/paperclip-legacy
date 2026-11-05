---
name: ai-health
description: >-
  Perform comprehensive system health checks and architectural compliance
  validation
---
# 🩺 System Health & Architecture Compliance (`/ai-health`)

Use this skill when checking ecosystem integrity or verifying that no architectural invariants are violated.

## Procedure
1. Run the 31-point healthcheck sweep:
   ```bash
   python -m dev.cli doctor
   ```
2. Validate registry files against schema definitions:
   ```bash
   python -m dev.cli validate
   ```
3. Report any failures immediately to the user.
