---
name: ai-skills
description: Master catalog and intent-router for all Development Universe ai-* skills
---
# 🌐 Development Universe Human API (`ai-*` Skills Catalog)

Use this catalog to select the most appropriate human-facing skill based on the user's intent:

| Skill | Intent / Trigger | Operation Type | Internal Engine Service |
|---|---|---|---|
| **`/ai-start`** | "Start work", "Begin session", "Wake up context" | Session Lifecycle / Briefing | `dev session start` + `ContextBuilder` |
| **`/ai-close`** | "Finish work", "Close session", "Log progress" | Session Lifecycle / Handoff | `dev session close` + `MemoryManager` |
| **`/ai-status`** | "Where am I?", "What project is active?", "Session status" | Diagnostics / Identity | `dev repo current` + `dev session status` |
| **`/ai-ask`** | "How does X work?", "What decisions affect Y?" | Multi-Source Question Answering | `ContextBuilder` + `VectorRetrieval` + `CodeGraph` |
| **`/ai-recall`** | "Search memory for...", "Find notes about..." | Semantic Vector Search | `VectorRetrievalEngine.query` |
| **`/ai-remember`** | "Remember this pattern", "Record this trap" | Propose Memory Candidate | `dev memory propose` (`MEM-*`) |
| **`/ai-review-memory`** | "Review candidates", "Promote memory" | Human Memory Governance | `dev memory review` / `promote` |
| **`/ai-next`** | "What's next?", "What is pending?", "What are our priorities?" | Roadmap & State Inspection | `02-projects/<prj>/current-state.md` + OpenSpec |
| **`/ai-steps`** | "Add next step", "Plan next action", "Record task" | Living State Updates | Updates `current-state.md` (`## Next Steps`) |
| **`/ai-decide`** | "Record this decision", "We decided to..." | Decision Staging | `dev memory propose --type decision` |
| **`/ai-investigate`** | "Debug this bug", "Find root cause of...", "Trace symbol" | Problem Diagnosis & Code Graph | `dev graph query` + `PRB-*` retrieval |
| **`/ai-context`** | "Show active context", "Why was this note retrieved?" | Context Observability | `dev context` (`--as-of` supported) |
| **`/ai-orchestrate`** | "Orchestrate tasks", "Run parallel workers" | Parallel Work Delegation | Multi-Worker Protocol + Git Worktrees |
| **`/ai-health`** | "Check system health", "Validate vault" | System Diagnostics | `dev doctor` + `dev validate` |
| **`/ai-link-audit`** | "Check broken links", "Find orphan notes" | Vault Maintenance (DEV-001) | `ai-obsidian-link-audit` (MCP + Regex fallback) |
| **`/ai-moc-update`** | "Update index", "Refresh MOCs", "Sync tables" | Vault Maintenance (DEV-001) | `ai-obsidian-moc-update` (MCP + CLI Sync) |
| **`/opsx-explore`** | "Explore ideas", "Investigate codebase", "Think freely" | Pre-Flight Exploration | `dev context` + Read-Only Investigation |
| **`/opsx-lite`** | "Quick spec", "Single-file change", "Fast proposal" | Lightweight SDD Planning | `dev context` + Single-File `.lite.md` |
| **`/opsx-propose`** | "Propose change", "OpenSpec proposal" | Change Planning | `dev context` + Proposal Artifact |
| **`/opsx-apply`** | "Apply change", "Execute spec tasks" | Change Execution | Task Runner + Execution Logging |
| **`/opsx-verify`** | "Verify change", "Run spec tests" | Quality Gates | Test Suites + `dev doctor` |
| **`/opsx-archive`** | "Archive change", "Complete OpenSpec" | Change Archive & Reflection | Archive + Candidate Distillation |

## Core Invariants
1. Skills are an orchestration layer over the core DU engine; they never create independent caches (`hot.md`, `.ai-session.json`).
2. Agents propose candidates (`MEM-*`); canonical memory is promoted strictly via human review.
