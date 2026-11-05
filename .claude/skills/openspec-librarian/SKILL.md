---
name: openspec-librarian
description: >-
  Use this skill to manage, search, and safely edit OpenSpec files (Proposals,
  Specs, Tasks) using the Obsidian MCP. Ensures frontmatter integrity.
---
# OpenSpec Librarian

You have access to the `obsidian` MCP server. Use it to cleanly interface with the OpenSpec architecture.

1. **Pre-Proposal Check**: Before generating a new proposal, use the `obsidian_search_notes` tool to search `08-system/081-agents/openspec/` to ensure no duplicate or overlapping proposals already exist.
2. **Safe Editing**: When appending content or updating the status on an existing Spec or Proposal, use `obsidian_patch_note` or `obsidian_append_to_note` to ensure the Obsidian frontmatter (YAML tags and metadata) remains perfectly intact.
3. **MOC Integration**: Use `obsidian_read_note` on `08-system/082-brain/master-index.md` to ensure any new feature spec is properly categorized and linked to the correct Master Index domain.
