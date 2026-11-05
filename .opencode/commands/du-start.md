---
description: >-
  Start an agent session in Development Universe with ephemeral in-memory
  context
---
Start a clean agent session with zero disk pollution:

1. Turn 1 — Sovereign Pull:
```bash
dev sync all
```
*(Code 13 is non-blocking offline mode; proceed to Turn 2).*

2. Turn 2 — Session Bootstrap & Transfers:
```bash
dev session start <project-id>
dev transfers list
```
*(If transfers are pending, inspect with `dev transfers show XFER-NNN` before executing).*
