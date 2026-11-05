---
name: ai-memory-digest
description: >-
  Generates the Executive Memory Digest and applies autonomous,
  risk-proportional memory promotions.
---
# 🧠 AI Memory Governor & Executive Digest (`/ai-memory-digest`)

Executes the autonomous **AI Memory Governor** pipeline over pending memory candidates (`MEM-*`), running zero-token deterministic triage, multi-perspective semantic review, and presenting an Exception-First Executive Digest for 1-click human sign-off.

## 🚀 Usage

Execute via CLI from the Development Universe or agent tool interface:

```bash
# Generate digest in dry-run mode (review exceptions only)
uv run --project "$DEV_ROOT/engine" dev memory digest --dry-run

# Generate digest and apply autonomous low-risk promotions
uv run --project "$DEV_ROOT/engine" dev memory digest

# Full batch approval (including human digest exceptions)
uv run --project "$DEV_ROOT/engine" dev memory digest --batch-approve
```

## ⚖️ Governance Rules

1. **Deterministic Deduplication**: Exact duplicates and stale candidates (>45d TTL) are automatically archived without LLM token spend.
2. **Autonomous Promotion (`AUTO-PROMOTE`)**: Verified project patterns and factual knowledge with confidence $\ge 0.90$ and zero sensitive keywords are promoted directly to `04-patterns/` or `03-knowledge/engineering/`.
3. **Mandatory Human Exception Gate (`HUMAN DIGEST`)**: All global constraints, global decisions, conflicting patterns, and sensitive architectural domains (`auth`, `token`, `secret`, `database`, `ssl`) require explicit human sign-off.
4. **Auditability & Rollback**: Every operation is recorded in `08-system/candidates/archive/audit.jsonl` and can be revoked via `dev memory revoke <ID>` or rolled back via `dev memory rollback <RUN-ID>`.
