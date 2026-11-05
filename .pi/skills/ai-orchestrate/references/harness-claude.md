# Harness Reference: Claude Code

## 1. Classificação & Lista Positiva Sensitive (CON-0028 / DEC-0044)
- **Provedor Autenticado Direto**: Anthropic Claude API / Claude Max
- **Public Gateway**: `false`
- **Lista Positiva para Dados `sensitive`**:
  - `github-copilot` (quando acedido via Copilot)
  - Anthropic API direta autenticada (política de não-retenção verificada DEC-0044)

## 2. Modelos Reais por Tier (Task 1.4)
- **T1 (Fast/Worker)**: `haiku`
- **T2 (Standard)**: `sonnet`
- **T3 (Reasoning/Complex)**: `opus`

## 3. Contrato de Invocação & Spawn
- **Tool Nativa de Subagente**:
  ```yaml
  tool: Agent
  arguments:
    model: "haiku"
    isolation: "worktree"
    prompt: "<WORK_PACKET>"
  ```
- **CLI Print (Tier 2)**:
  ```bash
  claude -p "<WORK_PACKET>"
  ```
- **Retorno Exigido**: Git diff + output bruto do comando `done_when` (sem resumos conversacionais).
- **Estado de Verificação**: `installed` (aguarda smoke test 8.1 para `verified@Mac`).
