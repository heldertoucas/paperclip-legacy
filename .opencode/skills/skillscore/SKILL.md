---
name: skillscore
description: >-
  Evaluate, score, and optimize agent skills against authoring rubrics and
  generate interactive HTML reports. Use when the user asks to score skills,
  evaluate skill quality, or run skillscore. Do not use for non-skill markdown
  files.
metadata:
  targets:
    - '*'
---
# 🎯 SkillScore — Skill Evaluation & Fleet Health Engine (`/skillscore`)

Evaluates, scores, benchmarks, and optimizes agent `SKILL.md` manifests across 9 static and dynamic rubric categories, generating standalone, interactive HTML dashboards and CI quality reports on demand.

## 1. Quick Commands & Workflows

### A. Full Workspace Fleet Audit (Default)
Scans all 100+ skills in the configuration directory, tags modifiability (Workspace vs. Upstream Read-Only), and generates the complete interactive HTML dashboard:
```powershell
dart "C:\Users\helder.toucas\Dev\skillscore\bin\skillscore.dart" "C:\Users\helder.toucas\.gemini\config\skills\" --format html --output-html "C:\Users\helder.toucas\Dev\skillscore\skills_fleet_report.html"
```
*Report Path:* [`C:/Users/helder.toucas/Dev/skillscore/skills_fleet_report.html`](file:///C:/Users/helder.toucas/Dev/skillscore/skills_fleet_report.html)

### B. Single-Skill Deep Dive & Radar Report
Generates an individual skill scorecard with 9-axis SVG rubric radar, token usage breakdown, and actionable fix hints:
```powershell
dart "C:\Users\helder.toucas\Dev\skillscore\bin\skillscore.dart" "C:\Users\helder.toucas\.gemini\config\skills\<skill-name>\SKILL.md" --format html --output-html "C:\Users\helder.toucas\Dev\skillscore\<skill-name>_report.html"
```

### C. CI Quality Gating & Strict Security
Enforces quality gates in CI/CD or local pre-commit checks:
```powershell
# Exit non-zero if any skill scores below 80 or has Category H/I security errors:
dart "C:\Users\helder.toucas\Dev\skillscore\bin\skillscore.dart" "C:\Users\helder.toucas\.gemini\config\skills\" --min-score 80 --security-strict --format pretty
```

---

## 2. Automated Workspace Optimizer

To automatically refine weak or poorly formatted custom skills (frontload action verbs, nest metadata, add negative boundaries, and validation loops):
```powershell
dart "C:\Users\helder.toucas\Dev\skillscore\bin\workspace_optimizer.dart"
```

---

## 3. Rubric Categories Evaluated

1. **Category A (Frontmatter Validity):** Delimiters, mandatory keys (`name`, `description`), valid naming, metadata nesting.
2. **Category B (Description Quality):** Action verbs, trigger clauses (`Use when...`), negative boundaries (`Do not use...`), character budget (<250 chars).
3. **Category C (Conciseness & Token Economy):** Body length (<500 lines), zero common knowledge explainer bloat, lean option chains.
4. **Category D (Structure & Progressive Disclosure):** Standard Markdown heading hierarchy, table of contents on deep files.
5. **Category E (Instruction Quality):** Numbered checklists, imperative tone, anti-patterns (`Do not`, `Never`), and feedback loops.
6. **Category F (Content Hygiene):** POSIX forward slash paths (`/`), valid JSON/YAML blocks, UTF-8 encoding.
7. **Category G (Safety & Permissions):** Required `## Safety` sections for skills shipping terminal scripts.
8. **Category H (Security & Injection):** Defense against prompt injection, unconstrained shell pipes (`curl | bash`), and raw eval.
9. **Category I (Isolation & Boundaries):** Secret scrubbing (`sk-...`, `ghp_...`, `AIzaSy...`) and explicit tool boundary restrictions.

---

## 4. Anti-Patterns & Boundaries

- Do not modify skills marked `UPSTREAM (READ-ONLY)` (e.g. `caveman/*`, `openspec/*`, `vercel/*`) without explicit user permission to prevent upstream merge conflicts.
- Avoid running optimization loops without checking that Category H and I security invariants are satisfied.
- Never output unsanitized traces containing sensitive API keys or credentials.

## 5. Safety

- Static scoring and HTML report generation are read-only operations that do not modify skill manifests.
- Automated optimizers write backups and validate AST integrity before saving changes to disk.

## 6. Validation & Feedback Loop

1. Run `skillscore` with `--format json` or `--format html`.
2. Inspect the generated report for any findings or quality gate warnings.
3. If scores fall below 80, apply suggested fixes or run the optimizer and re-verify until the score reaches Grade A (90+).
