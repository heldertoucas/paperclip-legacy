# Harness Reference: OpenCode

## 1. Classificação & Lista Positiva Sensitive (CON-0028 / DEC-0044)
- **Tabela de Pares & Gateways**:
  | Par Provider/Modelo | Classificação | Dados Permitidos |
  |---|---|---|
  | `opencode/*-free` (`beam-free`, `flint-40b-free`, etc.) | **`public-gateway: true`** | Apenas `public` |
  | `opencode-go` (autenticado direto) | **`public-gateway: false`** | `public`, `internal`, `sensitive` |
  | `github-copilot` | **`public-gateway: false`** | `public`, `internal`, `sensitive` |

- **Lista Positiva para Dados `sensitive`**:
  - `opencode-go`
  - `github-copilot`

## 2. Modelos Reais por Tier (Task 1.4)
- **T1 (Fast/Worker)**: `opencode/beam-free`, `opencode/deepseek-v4.1-flash-free`
- **T2 (Standard)**: `opencode/flint-40b-free`, `opencode/glm-5.3-flash-free`
- **T3 (Reasoning/Complex)**: `opencode/big-pickle`, `opencode/nemotron-3.5-super-vl-free`

## 3. Contrato de Invocação & Spawn
- **Comando Exato (Tier 2 CLI)**:
  ```bash
  opencode run -m <provider>/<model>#variant --format json "<WORK_PACKET>"
  ```
- **Saída Estruturada**: Stream de eventos JSONL (`step_start`, `text`, `step_finish`).
- **Estado de Verificação**: `installed` (CLI e JSON streaming verificados em 2026-11-02).
