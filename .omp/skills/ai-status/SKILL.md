---
name: ai-status
description: 'Display current repository, project, and session identity status'
---
# 📍 System & Session Status (`/ai-status`)

Use this skill when checking current identity and session state.

## Procedure
Run:
```bash
python -m dev.cli repo current
python -m dev.cli session status
```

Present:
- **Repository**: ID, name, role, local path.
- **Project**: ID, name, area, status.
- **Active Session**: Session ID, started timestamp, task intent.
