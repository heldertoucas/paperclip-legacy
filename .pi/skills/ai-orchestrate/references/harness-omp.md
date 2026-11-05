# Harness Reference: OMP (Oh-My-Pi)

## 1. Classificação & Lista Positiva Sensitive (CON-0028 / DEC-0044)
- **Provedor Autenticado Direto**: `openai-codex` / `github-copilot`
- **Public Gateway**: `false`
- **Lista Positiva para Dados `sensitive`**:
  - `github-copilot`
  - `openai-codex`

## 2. Modelos Reais por Tier (Task 1.4)
- **T1 (Fast/Worker)**: papel `--smol` (`gpt-5.6-luna`)
- **T2 (Standard)**: papel `--model` (`gpt-5.6-luna`)
- **T3 (Reasoning/Complex)**: papel `--slow` / `--plan`

## 3. Contrato de Invocação & Spawn
- **Comando Exato (Tier 2 CLI)**:
  ```bash
  omp --mode json --warn-cost -p "<WORK_PACKET>"
  ```
- **Retoma de Subagentes Interrompidos**: flag `--restore`.
- **Estado de Verificação**: `installed` (CLI e JSON mode verificados em 2026-11-02).
