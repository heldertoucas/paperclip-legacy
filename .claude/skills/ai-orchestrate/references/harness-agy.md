# Harness Reference: Antigravity CLI (AGY)

## 1. Classificação & Lista Positiva Sensitive (CON-0028 / DEC-0044)
- **Provedor Autenticado Direto**: Google Gemini / Vertex AI Direct
- **Public Gateway**: `false`
- **Lista Positiva para Dados `sensitive`**:
  - `github-copilot`
  - Google Cloud Enterprise Direct (DEC-0044)

## 2. Modelos Reais por Tier (Task 1.4)
- **T1 (Fast/Worker)**: `gemini-3.8-flash-low`, `gemini-3.8-flash-medium`, `claude-sonnet-5-5-low`
- **T2 (Standard)**: `gemini-4-argon-medium`, `claude-sonnet-5-5-medium`
- **T3 (Reasoning/Complex)**: `claude-opus-5-5-high`, `gemini-4-argon-high`

## 3. Contrato de Invocação & Spawn
- **Comando Exato (Tier 2 CLI)**:
  ```bash
  agy --print --model <model> --effort <low|medium|high> --json-schema <schema.json> --sandbox --mode accept-edits --output-format json "<WORK_PACKET>"
  ```
- **Modos de Execução**: `plan` (para especialistas T3 read-only), `accept-edits` (para workers T1 de escrita).
- **Estado de Verificação**: `installed` (CLI flags verified).
