---
name: openspec-researcher
description: >-
  Use this skill during the OpenSpec Proposal phase to perform deep offline RAG
  queries against the Second Brain using the Gemini-Obsidian MCP.
---
# OpenSpec Researcher

You have access to the `gemini-obsidian` MCP server for semantic offline RAG search across the entire `obsidian-ht` vault.

1. **Grounding Proposals**: When drafting a new proposal via `/opsx:propose`, first use the `obsidian_rag_query` tool to search the vault for historical context, prior decisions, legacy constraints, or related projects.
2. **Problem Statement Context**: Inject the findings from your semantic queries directly into the "Background / Context" section of the OpenSpec proposal. This guarantees the new spec is grounded in the user's actual Second Brain history rather than assumptions.
