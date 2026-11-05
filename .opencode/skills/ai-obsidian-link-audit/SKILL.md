---
name: ai-obsidian-link-audit
description: >-
  Use when the user wants to audit vault link health, find broken wikilinks,
  orphaned notes, or semantic clusters. Triggers on "link audit", "broken
  links", "link health", "graph cleanup", or "find orphans".
---
# Vault Link & Entity Health Audit (`/ai-link-audit` / `ai-obsidian-link-audit`)

Comprehensive audit of vault link integrity: broken wikilinks, orphaned notes, missing entity provenance, and semantic link suggestions.

## Tier 1 — Native MCP Execution (Preferred)

### Phase 1: Broken Links
1. Call `obsidian_get_broken_links` (optionally with `subfolder` argument, e.g. `Engineering/` or `03-knowledge/`).
2. Group broken links by originating file.
3. For each broken link, suggest:
   - Correct the target note name (e.g. wrong casing, renamed entity).
   - Create a placeholder/stub note.
   - Delete obsolete link.
4. Apply approved fixes using `obsidian_replace_in_note`.

### Phase 2: Orphaned Notes
1. Call `obsidian_list_notes` to enumerate notes in target scope.
2. For each candidate note, call `obsidian_get_backlinks`.
3. Notes with 0 backlinks (excluding `Daily Notes/` and templates) are candidate orphans.
4. Present orphans with actions: link from parent MOC, move to archive, or delete.

### Phase 3: Semantic Connection Suggestions
1. For each orphan or isolated note, call `obsidian_rag_query` with note title as query (`limit: 5`).
2. Suggest relevant `[[wikilink]]` additions based on high-similarity notes.

---

## Tier 2/3 — Direct Filesystem Fallback (When MCP is Unavailable)

If the `ai-obsidian` MCP server is unmounted, unreachable, or returning errors, fall back to direct workspace inspection:

1. **Scan Wikilinks**: Recursively inspect markdown files in `home/` (or target project directory) for `\[\[(.*?)\]\]` patterns.
2. **Resolve Entity IDs**: Cross-reference links against existing filenames and canonical entity identifiers:
   - Canonical prefixes: `PAT-*`, `CON-*`, `DEC-*`, `PRB-*`, `KNW-*`, `MEM-*`, `SES-*`.
   - Relative vault paths: e.g. `[[04-decisions/DEC-0001|DEC-0001]]` or `[[DEC-0001]]`.
3. **Report Discrepancies**:
   - **Broken Targets**: Non-existent files or invalid relative paths.
   - **Missing Provenance**: Entities lacking back-links to originating session or candidate logs.
   - **Orphans**: Files with zero incoming wikilink occurrences across all vault notes.
4. Suggest concrete path corrections to restore knowledge graph integrity.

---

## Invariants & Safety
- **Confirmation Required**: Never modify or delete notes without explicit per-change confirmation.
- **Large Vault Scoping**: For large vaults, default to subfolder scoping (e.g. `Engineering/`, `03-knowledge/`, `04-decisions/`).
- **Index Health**: If MCP results seem incomplete, verify or run `obsidian_rag_index` first.
