---
name: ai-moc-update
description: >-
  Maintain and refresh Maps of Content (MOCs) and index pages across the
  Obsidian vault
---
# 🗺️ Maps of Content (MOC) Maintenance (`/ai-moc-update`)

Use this skill when updating navigation tables, registries, or domain indexes under Project `DEV-001`.

## Procedure
1. Synchronize system registry MOCs:
   ```bash
   python -m dev.cli validate --fix
   ```
2. Scan active canonical entities in `03-knowledge/`, `04-decisions/`, and `08-system/constraints/`.
3. Update or generate appropriate domain MOCs:
   - `08-system/registry/PROJECTS.md` (Project registry table).
   - `08-system/registry/REPOSITORIES.md` (Repository registry table).
   - Topic MOCs in `03-knowledge/` (e.g. Engineering Architecture MOC).
4. Verify that table links match current entity statuses (`canonical`, `active`, `superseded`).
