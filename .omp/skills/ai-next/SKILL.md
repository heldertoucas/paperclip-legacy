---
name: ai-next
description: >-
  Deep tactical inspection of project current state, pending Next Steps from
  current-state.md, and uncompleted OpenSpec tasks (including .lite.md and
  multi-file changes).
---
# 🎯 Project Priorities & Tactical Next Steps (`/ai-next`)

Use this skill to inspect immediate project priorities, pending next steps, and active OpenSpec task checklists across both lightweight and full changes.

---

## Procedure

### Step 1: Resolve Active Project & Repository
Query current repository identity and active project:
```bash
python -m dev.cli repo current
```
*(Or inspect via MCP tool `get_project` / `resolve_workspace`).*

### Step 2: Read Project Current State Note
Locate and read the project's living state note in the canonical vault:
`home/02-projects/<project-id>/current-state.md`

Extract:
- **🎯 Active Objective & Milestone**
- **⏭️ Living Next Steps** under `## 📋 Next Steps` (collect uncompleted items `- [ ]`).

### Step 3: Scan Active OpenSpec Changes & Checklists
Scan the repository's `openspec/changes/` directory for ongoing work:
1. **Lightweight Single-File Changes**:
   - Inspect all `openspec/changes/*.lite.md` files.
   - Extract pending tasks under `## 4. Tasks (Execution Checklist)` matching `- [ ]`.
2. **Full Multi-File Changes**:
   - Inspect all `openspec/changes/*/tasks.md` files.
   - Extract pending tasks matching `- [ ]`.

### Step 4: Present Consolidated Tactical Agenda
Present a clear, scannable briefing to the user:
```markdown
### 🎯 Current Objective: <Milestone / Objective>

#### 📋 Next Steps (from current-state.md):
- [ ] <Next step item 1>
- [ ] <Next step item 2>

#### ⚡ Active OpenSpec Tasks:
- **<Change-Name>.lite.md**:
  - [ ] Task X: <Description>
- **<Change-Name> (Full)**:
  - [ ] Task Y: <Description>

#### 🚧 Blockers / Dependencies:
- <Any open roadblock, or 'None'>
```

Offer immediate next actions (e.g. *"Deseja começar a executar a Task X via `/opsx-apply`?"*).
