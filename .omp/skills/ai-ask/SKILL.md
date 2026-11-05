---
name: ai-ask
description: >-
  Recommends which skill, command, or workflow fits your situation. Use when the
  user asks to find a skill, route a task, or when you are unsure which workflow
  to use. Usar ai-orchestrate quando existirem ≥3 tarefas independentes com
  done_when. Do not use when the workflow is already obvious or explicitly
  requested.
---
# AI Ask Router

Use this skill when guidance is needed on which specialized skill, command, or workflow fits the current development phase.

## 🎯 Dual-Mode Responses

1. **User-Facing (Human Chat)**: When triggered with /ai-ask <question>, reply in a clean, formatted manner matching the user's language (PT-PT or International English). State the recommended skill(s), how to invoke them, and a brief explanation of why they fit.
2. **Agent-Facing (Internal Navigation)**: When navigating a task, query this mapping to ensure adherence to domain guidelines. Never route to the active router (i-ask) itself.
3. **Validation Loop**: Ensure the recommended skill exists in the Rulesync catalog. Provide numbered options if user decision is needed.

## 🗺️ Canonical Workflow & Skill Directory Map

### 1. Specification-Driven Development (OpenSpec)
* **openspec-propose** (/opsx:propose): Propose a new change — generates proposal, design, and tasks in one step.
* **openspec-new-change** (/opsx:new): Scaffold a new change proposal step-by-step.
* **openspec-explore** (/opsx:explore): Thinking partner mode to explore ideas and clarify requirements before speccing.
* **openspec-apply-change** (/opsx:apply): Implement tasks defined in an OpenSpec change.
* **openspec-continue-change** (/opsx:continue): Continue an in-progress OpenSpec change.
* **openspec-ff-change** (/opsx:ff): Fast-forward straightforward changes directly to implementation.
* **openspec-verify-change** (/opsx:verify): Verify implementation correctness against change specs.
* **openspec-sync-specs** (/opsx:sync): Merge delta specs into main system specs.
* **openspec-update-change** (/opsx:update): Revise and synchronize planning artifacts without touching code.
* **openspec-archive-change** (/opsx:archive): Archive a single completed change.
* **openspec-bulk-archive-change** (/opsx:bulk-archive): Archive multiple completed changes at once.
* **openspec-onboard** (/opsx:onboard): Guided onboarding to initialize OpenSpec in a project.

### 2. Engineering Verbs & Quality Disciplines
* **investigate-first**: Diagnose ambiguous failures, race conditions, or performance bugs before editing.
* **surgical-patch**: Fix bugs at the narrowest responsible layer with regression proof.
* **safe-refactor**: Restructure code while preserving behavior using strict bracketed verification.
* **lean-build**: Build new slices with minimal scope, maximum reuse, and strict stop conditions.
* **migration**: Implement reversible, rollback-safe schema, API, or data migrations.
* **verify-and-stop**: Prove existing code meets acceptance criteria without expanding scope.
* **ponytail**: Enforce ultra-minimalist, zero-dependency, standard library solutions (YAGNI).
* **ai-council**: Multi-agent debate to stress-test architecture, security, and trade-offs.
* **ai-grill** (/ai-grill): Relentless Socratic interview to align on design decisions before building.

### 3. Frontend, UI & Vercel Optimization
* **react-best-practices**: Next.js & React performance guidelines (waterfalls, bundle size, server components).
* **composition-patterns**: Component architecture patterns (compound components, render props, slot patterns).
* **react-view-transitions**: Native view transitions and fluid UI animations.
* **deploy-to-vercel**: Deploy preview/production builds to Vercel.
* **vercel-optimize**: Audit and reduce Vercel compute, data transfer, and function invocation costs.
* **web-design-guidelines**: Audit UI for Web Interface Guidelines, UX quality, and accessibility.

### 4. Git & Code Review
* **review-pr**: Audit pull requests for code quality, architectural consistency, and security.
* **commit-push-pr**: Stage changes, create conventional commits, push, and open pull requests.
* **caveman-commit**: Generate ultra-concise conventional commit messages.

### 5. Token Efficiency & Caveman Mode
* **caveman**: Ultra-compressed communication mode cutting output tokens ~65%.
* **cavecrew**: Decision guide for delegating work to caveman-compressed subagents.
* **caveman-compress**: Compress natural language memory files to save context tokens.
* **caveman-explore**: Read-only repo explorer returning compact path:line citations.
* **caveman-review**: Ultra-compressed, single-line PR code review comments.
* **caveman-stats**: View token usage and verified session savings.
* **caveman-learn** / **caveman-optimize** / **caveman-manage** / **caveman-discover** / **caveman-evidence-review** / **caveman-setup** / **caveman-help**: Cloud and gateway telemetry optimizations.

### 6. Development Universe (DU) & Second Brain
* **obsidian-companion**: Primary guide and router for the Obsidian knowledge graph and i-obsidian MCP.
* **compound** / **knowledge**: Synthesize and promote reusable lessons into durable engineering notes.
* **moc-update**: Suggest Map of Content (MOC) index updates for newly created notes.
* **link-audit**: Audit broken wikilinks, orphan notes, and disconnected vault clusters.
* **cross-linker**: Scan vault notes to discover unlinked mentions and weave wikilinks.
* **wiki-ingest**: Distill PDFs, transcripts, and external markdown into structured vault notes.
* **ai-learn** (/ai-learn): Interactive technical teaching with stateful lesson tracking.

### 7. Codebase Graphs & External Copilots
* **graphify**: Query and visualize codebase architecture, dependency paths, and god nodes.
* **opencode-copilot**: Delegate heavy local refactoring or long terminal runs to OpenCode.
* **jules-copilot**: Delegate async tasks and PRs to remote GitHub repositories via Google Jules.
* **imagekit-uploader**: Upload and optimize local assets on ImageKit CDN.
* **imgur-downloader**: Download full image albums from Imgur URLs.
