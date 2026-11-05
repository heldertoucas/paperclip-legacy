---
name: ai-investigate
description: >-
  Investigate bugs, error symptoms, and architectural root causes using Code
  Graph and Problem records
---
# 🔍 Problem & Dependency Investigation (`/ai-investigate`)

Use this skill when diagnosing a defect, regression, or complex dependency issue.

## Procedure
1. Search known problem notes (`PRB-*`):
   ```bash
   python -m dev.cli memory query "$SYMPTOM" --type problem --limit 5
   ```
2. Trace code relationships and callers in the Code Graph:
   ```bash
   python -m dev.cli graph query "$SYMBOL"
   ```
3. Synthesize findings:
   - Root cause hypothesis based on deterministic AST call graphs and historical problem notes.
   - Suggested fix or workaround.
