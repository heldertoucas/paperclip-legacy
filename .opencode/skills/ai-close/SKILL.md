---
name: ai-close
description: >-
  Concludes a Development Universe session, captures Next Steps handoff, and
  triggers memory governance.
---
# Session Close (ai-close)

Use this skill when concluding work in a Development Universe (DU) repository.

1. **Formulate Next Steps**:
   - Inspect the last few user instructions or unfinished work for explicit forward-looking intentions (e.g. *"na próxima sessão vamos começar por..."*).
   - Formulate 1-3 concise, actionable `Next Steps` items.
   - Do NOT edit `current-state.md` directly: pass `-n "<item>"` to `dev session close`, which persists them canonically.

2. **Memory Governance (Active Session)**:
   - Propose any durable architectural knowledge (Decisions, Patterns, Constraints, Problems) as Memory Candidates using `dev memory propose` before closing the session, ensuring they are recorded in `.owned.jsonl` and committed atomically.

3. **Register Cross-Station Transfers (Active Session)**:
   - Did this session change something Git does not carry (output style, scripts, secrets, per-machine settings)? If yes: `dev transfers add ...` for a new item, or `dev transfers reopen XFER-NNN --reason "<why>"` for the other station.
   - If a payload file listed in the book was edited: `dev transfers refresh` (affected stations become `stale`).
   - Never put secret values, hostnames, IPs or user names in the book.

4. **Render Orchestration Runs (`## Orchestration Run`)**:
   - If active orchestration manifests exist in `$(git rev-parse --git-common-dir)/orchestrate/*.jsonl`:
     - Summarize completed runs, packet outcomes, disagreements, and verification evidence under `## Orchestration Run` in the session log.
     - Clean up completed manifest files after session logging (operational state only, never persistent canonical memory, DEC-0043).

5. **Close Session via DU Engine / CLI**:
   ```bash
   dev session close --project <project-id> --session <session-id> --agent <agent-name> --summary "<Executive Summary>" -n "<Next Step 1>" -n "<Next Step 2>"
   ```
   *(Or invoke the `close_session` MCP tool passing `project_id`, `session_id`, `agent_name`, `summary`, and `next_steps: ["..."]`).*
   This automatically records and commits session-owned changes (session note, current-state, proposed memories, transfers) under `du-sync.lock` (C-7).
   `--project` is mandatory (C-2 [v4]). Passing `--session` and `--agent` ensures harness session binding parity and closes the active harness marker (F-4).

6. **Synchronize Repositories (`dev sync all`)**:
   Execute object-based integration and publishing:
   ```bash
   dev sync all
   ```
   *(Never use raw synchronization commands or manual staging).*

### `dev sync` Exit Codes & Recovery (D6)

| Code | Meaning | Repository State | Recovery Action (`next_command`) |
|---|---|---|---|
| 0 | Success | Integrated & published | — |
| 10 | Local uncommitted changes overlap with remote changes | **Unchanged** | Commit owning session: `dev session commit --session <owner>` and retry |
| 11 | Auto-merge conflict in log classes or ff-only mode | Unchanged | Check logs or update git: `dev sync repair --dry-run` |
| 12 | Human note or code conflict | Unchanged | Resolve conflicting file manually with clean tree |
| 13 | Network unreachable | Unchanged | Retry when connectivity returns; local work continues offline |
| 14 | Lock busy (`du-sync.lock`) | Unchanged | Wait for active process to finish (inspect `.git/du-sync.owner.json`) |
| 16 | Wrong branch | Unchanged | Switch to canonical branch: `git switch <default_branch>` |
| 17 | Interrupted state detected | Known | Run safe idempotent repair: `dev sync repair` |

> [!CAUTION]
> Never use forbidden workarounds: staging all files (`add -A`), committing all (`-a`), `stash`, `--force`, `--no-verify`.
