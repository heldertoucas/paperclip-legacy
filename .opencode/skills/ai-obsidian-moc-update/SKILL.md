---
name: ai-obsidian-moc-update
description: >-
  Maintain and refresh Maps of Content (MOCs) across the Obsidian vault. Use
  after creating a new note to suggest where it belongs, or when synchronizing
  system registries and domain index tables. Triggers on "update MOC", "add to
  MOC", "which MOCs", "refresh indexes", or "/ai-moc-update".
---
# Maps of Content (MOC) & Index Maintenance (`/ai-moc-update` / `ai-obsidian-moc-update`)

Unified workflow for linking notes to Maps of Content (MOCs) and maintaining structural registries.

---

## Mode 1 — Interactive Note-to-MOC Linker (Post-Note Creation)

Use when a new note (e.g. concept, pattern, decision) was created and needs to be woven into the vault's MOC network.

1. **Identify the Target Note**:
   - Path specified by user or originating context (e.g. `Engineering/AuthPatterns.md` or `03-knowledge/PAT-0002.md`).
2. **Semantic MOC Search (Tier 1 - MCP)**:
   - Call `obsidian_rag_query` with note title and summary keywords (`limit: 10`).
   - Filter for MOC-style notes (path contains `MOC`, filename ends with `-MOC.md`, or frontmatter `type: moc`).
3. **Keyword Fallback (Tier 2/3 - MCP / Search)**:
   - Call `obsidian_search_notes` with key technical terms if semantic index misses unindexed MOCs.
4. **Formulate Link Suggestions**:
   - Identify relevant section heading inside each candidate MOC.
   - Propose formatted link line: `- [[NoteName]] — concise one-line description`.
5. **Interactive Insertion**:
   - On human confirmation, insert the link using `obsidian_insert_at_heading` (preferred) or `obsidian_append_note`.
   - Never modify MOCs without user approval.

---

## Mode 2 — System Registries & Canonical Index Synchronization

Use when refreshing global project tables, repository registries, or canonical knowledge indexes.

1. **Synchronize System Registries**:
   - Run the DU validation and MOC synchronization command:
     ```bash
     python -m dev.cli validate --fix
     ```
2. **Scan Active Entities**:
   - Verify registry tables in:
     - `08-system/registry/PROJECTS.md` (Project registry table).
     - `08-system/registry/REPOSITORIES.md` (Repository & branch registry table).
     - Domain indexes in `03-knowledge/` (Architecture, Patterns, Problems).
3. **Link State Verification**:
   - Ensure all table entries link correctly to valid files and reflect current status (`canonical`, `active`, `superseded`).

---

## Tips & Invariants
- **Daily Notes Exclusion**: Daily logs are not MOCs — ignore them when searching for candidate parents.
- **Starter MOC**: If a topic has no existing MOC, offer to initialize `MOCs/<Topic>-MOC.md` using the canonical template.
