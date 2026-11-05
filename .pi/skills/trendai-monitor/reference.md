# Referência técnica — Monitor de Impacto TrendAI

Suporte da skill `trendai-monitor`. Ler antes de alterar código.

## Schema CSV (contrato único — design D4)

Ficheiro: `logs/monitor/YYYY-MM-DD-trendai.csv` — UTF-8 **com BOM**, separador `;`, decimais com ponto (invariant culture), timestamps ISO 8601 com offset.

```
tipo;datahora;processo;servicos;pid;cpu_pct;ram_mb
S;2026-10-24T12:01:00+01:00;SYSTEM;_;0;62.1;17455
P;2026-10-24T12:01:00+01:00;brave;_;15240;3.2;487
P;2026-10-24T12:01:00+01:00;svchost;Winmgmt;4360;17.8;47
E;2026-10-24T12:43:52+01:00;EVENTO;lentidao;;;
```

- `tipo ∈ {S,P,E}`; `E` guarda a causa no campo `servicos` (sanitizada: sem `;`/CR/LF, máx. 100 carateres).
- `E;...;fim_recolha` = fim de sessão (ignorado na análise de eventos).
- Valores vazios em `cpu_pct` = ilegível (processo PPL) — não é erro.
- Validação: `Test-MonitorLine` (7 campos, tipo válido). Consumidores ignoram linhas inválidas e reportam contagem.

## Fórmula de CPU (design D1, com o bug B1 corrigido)

```
cpu% = (Δ TotalProcessorTime / Δt) × 100     [por core: 100% = 1 core]
```

`TotalProcessorTime` **já acumula** tempo de todas as threads do processo — **não multiplicar pelo nº de cores** (bug histórico: inflação ~N cores; prova empírica: warp a 1230,4% numa máquina de 12 cores). Chave do snapshot anterior: `(PID, StartTime)` — PID reutilizado = processo novo (delta 0 na primeira amostra; ticks menor → null, nunca negativo).

Totais de sistema (a cada ~30 s, design D2): CIM `Win32_PerfFormattedData_PerfOS_Processor/Memory`; fallbacks: CPU total = `100 − idle%/cores` (Idle em por-core soma as N cores), RAM = `Win32_OperatingSystem.FreePhysicalMemory`.

## Decisões de design (D1–D9, resumo)

- **D1** deltas de `Get-Process` — sem WMI/PDH no caminho quente (o WMI polui o próprio sinal via Winmgmt/WmiPrvSE e atrai o EDR).
- **D2** CIM só para totais, a baixa frequência, com fallbacks.
- **D3** conjunto monitorizado = padrões configuráveis + top-K global; serviços de svchost via `tasklist /svc` com re-resolução sob demanda (throttle 1×/h) e **merge** da cache.
- **D4** um único escritor (tecla `m`); `monitor-mark.ps1` é fallback com retry 3×/200 ms; rotação diária à meia-noite.
- **D5** consumidores toleram linhas truncadas e reportam descartes.
- **D6** analisador: janelas ±60 s, mediana da hora anterior (mín. 12 amostras), cobertura reportada, "dados insuficientes" ≠ "normal".
- **D7** paragem controlada (`Ctrl+C` flush + `fim_recolha`), status por ciclo, `-DuracaoMax` 8 h.
- **D8** endurecimentos da auditoria: contagem de escrita por ciclo (só quando houve tentativas), cache merge, ranking `max(desvio, observado)`, catch genérico no retry, debounce 1 s.
- **D9** registo do blocker B1 (inflação por cores) — ver acima.

## Bugs históricos (não os reintroduzir)

1. **Inflação ×cores** em `Get-CpuDeltaPct` — corrigido; asserts de regressão: 1 core = 100.0%, meio core = 50.0%.
2. **PDH `c0000bb8`** nesta máquina (Perflib `009` vazio) — por isso PDH está proibido no caminho de recolha; não tentar "migrar para Get-Counter".
3. **StrictMode 2.0 + PowerShell 5.1**: `.Count` em pipeline de resultado único lança `PropertyNotFoundStrict` — envolver pipelines em `@(...)`.
4. **Cultura pt-PT**: consola imprime decimais com vírgula; CSV sempre com ponto (invariant). Asserts sobre output de consola devem aceitar `[.,]`.
5. **Ternários `?:` e `??` não existem em PS 5.1** — usar `if/else`.
6. **String multi-linha em single quotes** parseia, mas `-Replace` no fim de argumento de função é erro de binding — manter asserts numa linha.

## Ambiente da máquina-alvo

- Windows 11 Enterprise gerida, sem admin, OneDrive corporativo em `C:\OneDrive\OneDrive - Câmara Municipal de Lisboa` (fora do repo), 12 cores lógicos, 32 GB RAM.
- EDR: Trend Micro (`ntrtscan`) + Microsoft Defender for Endpoint (`MsSense`) — reagem a enumeração intensa de processos; por isso intervalo mínimo de 5 s e API `Get-Process` (a mesma do Gestor de Tarefas).
- `python -m dev.cli` não está no PATH a partir do repo — usar o dispatcher `powershell -File C:\Users\helder.toucas\Dev\dev.ps1 <cmd>` (Tier 2 do AGENTS.md).

## Manutenção — comandos frequentes

```powershell
# suíte de regressão (sandbox isolado)
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\monitor\test-monitor.ps1
# análise de um dia
powershell -NoProfile -File scripts\monitor\analyze.ps1 -Dia 2026-10-24
# grep de conformidade (deve devolver apenas comentários que citam a constraint)
Select-String -Path scripts\monitor\*.ps1,scripts\monitor\*.cmd -Pattern 'Get-NetTCPConnection','-EncodedCommand','irm ','iex','CurrentVersion\\Run','schtasks'
# validação de logs de execução OpenSpec
powershell -NoProfile -File scripts\validate-openspec-tasks.ps1
```

Pendências conhecidas (estado do change `trendai-impact-monitor`): Tasks 10–12 (recolha de um dia real, análise com marcadores reais, verificação de conformidade final); Fase 3 (dashboard HTML) só se a análise textual se revelar insuficiente. Ensaio de validação de 2026-10-24: 13,5 min em produção, 6 202 linhas, suíte 33/33, zero inválidas — pipeline validado; eventos `ensaio-demo-*` nesse CSV são demonstrativos.
