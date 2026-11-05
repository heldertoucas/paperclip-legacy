---
name: ai-recall
description: Query the semantic memory index for relevant historical notes and entities
---
# 🧠 Semantic Memory Recall (`/ai-recall`)

Use this skill when explicitly searching the vector memory store.

## Procedure
Query the derived index via CLI or MCP:
```bash
python -m dev.cli memory query "$SEARCH_QUERY" --limit 8
```

If querying historical facts before a certain date:
```bash
python -m dev.cli context --intent "$SEARCH_QUERY" --as-of YYYY-MM-DD
```

Present matches grouped by classification (Decisions, Constraints, Patterns, Problems).
