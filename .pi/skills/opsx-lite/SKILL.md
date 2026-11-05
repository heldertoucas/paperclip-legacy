---
name: opsx-lite
description: >-
  Propose and draft a lightweight, single-file OpenSpec change containing
  proposal, specs, design, and execution checklist in one go.
---
# ⚡ OpenSpec: Lightweight Single-File Change (`/opsx-lite`)

Use this skill when drafting a straightforward, focused, or small-to-medium change where managing multiple separate OpenSpec files would introduce unnecessary overhead.

---

## Output Target
All sections are drafted into a **single consolidated Markdown file**:
`openspec/changes/<YYYYMMDD-change-name>.lite.md`

*(Note: ensure the directory `openspec/changes/` exists before saving).*

---

## Procedure

### Step 1: DU Context Pre-Flight (CON-0016)
Always query the DU context engine to respect existing architectural constraints:
```bash
python -m dev.cli context --intent "$CHANGE_INTENT"
```
Record any relevant `DEC-*` or `CON-*` IDs in the frontmatter.

### Step 2: Generate the Consolidated `.lite.md` Artifact
Write the single file to `openspec/changes/<YYYYMMDD-change-name>.lite.md` using the exact structure below:

```markdown
---
title: "<Change Title>"
type: opsx-lite
status: proposed
project: <PRJ-ID>
created: "YYYY-MM-DD"
relevant_decisions: ["DEC-XXXX"]
relevant_constraints: ["CON-XXXX"]
---

# 📋 Change: <Change Title>

## 1. Proposal (Why & What)
- **Problem**: Background, friction, or motivation.
- **Solution**: High-level proposed behavior.
- **Non-Goals**: Explicit scope boundaries.

## 2. Specification (Requirements)
- **REQ-1**: <Core behavioral requirement>
- **REQ-2**: <Edge cases and acceptance criteria>

## 3. Design & Architecture (How)
- **Affected Files**: List of modified or created paths.
- **Technical Strategy**: Components, interfaces, data formats, or invariants.

## 4. Tasks (Execution Checklist)
- [ ] Task 1: <Description of first step>
- [ ] Task 2: <Description of implementation step>
- [ ] Task 3: <Verification and tests>
```

### Step 3: Present for Approval
Present the drafted artifact to the user. Do **NOT** start code implementation until the user reviews and confirms.

Once approved, implementation proceeds directly via:
- `/opsx-apply` (which reads the tasks from `<change>.lite.md` and appends `- *Executed YYYY-MM-DD*: ...` logs).
- `/opsx-verify` (quality gates).
- `/opsx-archive` (moves to `openspec/archive/<change>.lite.md` and triggers session reflection).
