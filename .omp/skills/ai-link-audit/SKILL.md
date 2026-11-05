---
name: ai-link-audit
description: >-
  Audit wikilink health across the Obsidian vault, identifying broken targets
  and orphan notes
---
# 🔗 Vault Link Health & Orphan Audit (`/ai-link-audit`)

Use this skill when inspecting the health of wikilinks and identifying orphaned notes under Project `DEV-001`.

## Procedure
1. Scan all markdown files in `home/` for `[[wikilink]]` references.
2. Resolve each wikilink against existing file paths and IDs in the vault:
   - Match exact filenames (e.g. `[[04-decisions/DEC-0001|DEC-0001]]` or `[[DEC-0001]]`).
   - Match entity IDs (`PAT-*`, `CON-*`, `DEC-*`, `PRB-*`, `KNW-*`, `MEM-*`, `SES-*`).
3. Report:
   - **Broken Links**: Wikilinks pointing to non-existent notes or invalid paths.
   - **Orphan Notes**: Notes with zero incoming or outgoing links (excluding templates).
   - **Missing Provenance Links**: Notes missing originating session or candidate back-links.
4. Suggest concrete path corrections to restore graph traversal integrity.
