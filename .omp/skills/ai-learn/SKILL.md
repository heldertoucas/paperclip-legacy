---
name: ai-learn
description: >-
  Teaches the user a new programming skill or technical concept statefully
  within the Development Universe.
---
# 🎓 AI Stateful Tutor & Course Builder (`/ai-learn`)

Provides structured, stateful technical tutorials, interactive lessons, and reference cheat sheets stored inside the canonical knowledge tree.

## 🎯 Language Adaptation
Detect the user's communication language (PT-PT or International English). Author lessons, quizzes, and code walkthroughs in the user's chosen language with an encouraging, expert mentor tone.

---

## 📁 Learning Workspace Structure

Every dedicated learning path is organized under the canonical knowledge folder:
`home/03-knowledge/learning/<topic-name>/` (relative to the DU root)

Structure of each learning module:
- `MISSION.md`: The purpose, scope, and roadmap for this topic (guided by `MISSION-FORMAT.md`).
- `RESOURCES.md`: High-reputation external documentation, papers, and video tutorials (guided by `RESOURCES-FORMAT.md`).
- `NOTES.md`: Scratchpad for user preferences and tutor working notes.
- `assets/course-style.css`: Shared stylesheet for standalone HTML lesson views.
- `lessons/0001-<dash-case-name>.html`: Self-contained interactive lesson focusing on one concept within the Zone of Proximal Development.
- `reference/0001-<dash-case-name>.html`: Quick reference cheat sheet and API syntax summary.
- `learning-records/0001-<dash-case-name>.md`: Insight logs tracking retention and milestone progress.

---

## 🧠 Obsidian & Knowledge Graph Integration
- Markdown files must use standard wikilinks `[[Note Name]]` to weave into the Second Brain graph.
- Lessons should leverage active recall quizzes and spaced interleaving for maximum retention (storage strength).
- Interactive quizzes must provide balanced options with identical formatting.
