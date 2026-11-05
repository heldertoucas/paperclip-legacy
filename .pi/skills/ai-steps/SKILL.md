---
name: ai-steps
description: >-
  Add, update, or append actionable next steps to the active project's
  current-state.md note during a session.
---
# 📝 Record Project Next Steps (`/ai-steps`)

Use this skill during an active session to add, modify, or append actionable next steps to the project's living state note in the canonical vault, without waiting for session closure (`/ai-close`).

---

## Target Note
`home/02-projects/<project-id>/current-state.md`

---

## Procedure

### Step 1: Identify Active Project
Resolve current project ID via CLI or MCP:
```bash
python -m dev.cli repo current
```
If not running in a registered repository, ask the user for the `<project-id>` (e.g. `PRJ-0023`, `rulesync-explorer`, etc.).

### Step 2: Read Existing `current-state.md`
Read `home/02-projects/<project-id>/current-state.md` and locate the `## 📋 Next Steps` section.

### Step 3: Format & Append New Steps
1. Parse the user's intent or arguments:
   - Examples:
     - `/ai-steps Implementar autenticação OAuth`
     - `/ai-steps 1. Rever testes E2E; 2. Corrigir lint de MCPs`
2. Format each new action item as an uncompleted markdown task checkbox:
   `- [ ] <Ação concisa e direta>`
3. Append or insert the new item(s) under `## 📋 Next Steps`:
   - If the section does not exist, create it at the end of the note.
   - Preserve all existing uncompleted and completed tasks.
   - Avoid creating duplicate steps if an identical task already exists.

### Step 4: Confirm Update
Display the updated `## 📋 Next Steps` checklist to the user and confirm that `current-state.md` was saved in canonical memory.
