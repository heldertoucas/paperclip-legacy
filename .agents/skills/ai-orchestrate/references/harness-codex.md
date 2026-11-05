# Harness Reference: Codex CLI

## 1. Classificação & Lista Positiva Sensitive (CON-0028 / DEC-0044)
- **Provedor Autenticado Direto**: OpenAI Direct / GitHub Copilot
- **Public Gateway**: `false`
- **Lista Positiva para Dados `sensitive`**:
  - `github-copilot`
  - OpenAI Enterprise Direct (DEC-0044)

## 2. Modelos Reais por Tier (Task 1.4)
- **T1 (Fast/Worker)**: `gpt-4o`
- **T2 (Standard)**: `o3`
- **T3 (Reasoning/Complex)**: `o3` (high reasoning effort)

## 3. Contrato de Invocação & Spawn
- **Comando Exato (Tier 2 CLI)**:
  ```bash
  codex exec -s workspace-write --ephemeral -C <worktree> --output-schema <schema.json> -o <result.json> --json "<WORK_PACKET>"
  ```
- **Recursão Proibida**: `multi_agent` estritamente desativado para workers (`depth = 1`).
- **Estado de Verificação**: `installed` (CLI verified).
