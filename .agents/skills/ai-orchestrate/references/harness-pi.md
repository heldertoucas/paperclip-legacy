# Harness Reference: Pi (`pi-coding-agent`)

## 1. Classificação & Lista Positiva Sensitive (CON-0028 / DEC-0044)
- **Provedor Autenticado Direto**: `github-copilot`
- **Public Gateway**: `false`
- **Lista Positiva para Dados `sensitive`**:
  - `github-copilot`

## 2. Modelos Reais por Tier (Task 1.4)
- **T1 (Fast/Worker)**: `github-copilot/claude-haiku-4.5`, `github-copilot/mai-code-1.1-flash`
- **T2 (Standard)**: `github-copilot/gpt-5.6-luna`
- **T3 (Reasoning/Complex)**: `github-copilot/gpt-6-luna`

## 3. Contrato de Invocação & Spawn
- **Comando Exato (Tier 2 CLI)**:
  ```bash
  pi -p --model <model> --thinking low --tools read,bash,edit,write --no-session --mode json "<WORK_PACKET>"
  ```
- **Nota Estrutural**: Ausência de subagente nativo no CLI do Pi; toda a delegação do Pi é executada via invocação CLI de processo isolado.
- **Estado de Verificação**: `installed` (CLI flags e `--list-models` verificados em 2026-11-02).
