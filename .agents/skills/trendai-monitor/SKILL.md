---
name: trendai-monitor
description: >-
  Operar, analisar e manter o Monitor de Impacto TrendAI — telemetria local de
  CPU/RAM por processo para diagnóstico de lentidão num PC institucional gerido.
  Use quando o utilizador pedir para arrancar ou parar o monitor, marcar
  lentidão, analisar CSVs de telemetria, alterar/corrigir o monitor, ou
  investigar lentidão do computador. Triggers: monitor, lentidão, trendai,
  telemetria, CPU/RAM por processo, diagnóstico de desempenho do PC.
---
# Monitor de Impacto TrendAI

Telemetria técnica local de desempenho (CPU/RAM por processo + totais de sistema) para correlacionar a perceção de lentidão do utilizador com o comportamento real do sistema. Observação passiva: nunca modifica, suspende ou termina processos. Nunca envia dados para fora da máquina.

Base: `C:\Users\helder.toucas\Dev\home` (repo DEV-001). Especificação canónica: `openspec/changes/trendai-impact-monitor/` (design D1–D9, spec, tasks com logs de execução).

```
scripts/monitor/
├── monitor-common.ps1    contrato partilhado (schema CSV, paths, deltas CPU, retry)
├── trendai-monitor.ps1   recolhedor (arranque manual, consola visível)
├── monitor-mark.ps1      marcador de lentidão (fallback; primário = tecla m)
├── monitor-mark.cmd      duplo-clique para marcar
├── analyze.ps1           análise por evento (janelas ±60 s, ranking de desvios)
└── test-monitor.ps1      suíte isolada (sandbox em %TEMP%)
logs/monitor/             CSVs diários (fora do OneDrive, ignorados pelo git)
```

Detalhes técnicos (schema CSV, fórmulas, histórico de bugs): ler `reference.md` na pasta desta skill antes de alterar código.

## Invariantes de segurança (ABSOLUTOS — CON-0035/CON-0036)

- **Nunca** adicionar persistência ou autostart: sem chaves `Run`, sem Startup, sem tarefas agendadas, sem serviços.
- **Nunca** usar `Get-NetTCPConnection`/`Test-NetConnection`, `-EncodedCommand`, ou `irm|iex`. Rede está fora de scope.
- **Nunca** escrever em pastas OneDrive ou no Desktop; artefactos só em `scripts/monitor/` e `logs/monitor/`.
- **Nunca** binários compilados; só PowerShell e HTML. Apenas utilitários padrão (`tasklist`).
- A recolha corre sempre em consola visível, lançada manualmente (é instrumento de diagnóstico, não serviço).
- `logs/monitor/` está no `.gitignore` — telemetria nunca entra no histórico git.

## Utilizar o monitor

**Arrancar** (arranque manual, sem admin; termina sozinho às 8 h):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\helder.toucas\Dev\home\scripts\monitor\trendai-monitor.ps1
```
Parâmetros úteis: `-IntervaloSegundos 10` (mín. 5), `-DuracaoHoras 4`, `-TopK 8`, `-Padroes` (lista de globs de processos).

**Marcar lentidão**: tecla `m` + Enter na consola do monitor (debounce 1 s). Fallback doutra consola:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\helder.toucas\Dev\home\scripts\monitor\monitor-mark.ps1 -Causa "teams congelado"
```

**Parar**: `Ctrl+C` (grava linha `fim_recolha` com flush) ou fechar a consola. Matar o processo não perde dados (escrita é linha-a-linha), apenas omite `fim_recolha`.

**Estado**: a consola mostra por ciclo a última amostra e o nº de linhas escritas; termina sozinho após 3 ciclos consecutivos sem escrita bem-sucedida ou 5 ciclos de amostragem falhados.

## Analisar

```powershell
powershell -NoProfile -File C:\Users\helder.toucas\Dev\home\scripts\monitor\analyze.ps1 -Dia 2026-10-24
```
- Para cada evento `E`: cobertura (nº de amostras, gaps), top 5 por `max(desvio, observado)` à mediana da hora anterior; `*` = sem mediana suficiente (mostra absoluto).
- **Interpretação**: desvio alto = processo que fugiu ao padrão próprio pouco antes da queixa; "DADOS INSUFICIENTES" nunca significa "normal" (o monitor pode ter estado parado).
- Eventos `fim_recolha` são ignorados (fim de sessão, não lentidão).
- Linhas descartadas por validação de schema são reportadas — acima de 0 com o monitor ativo indica problema (ver Troubleshooting).
- Valores de CPU são por core (100% = 1 core; numa máquina de 12 cores um processo pode chegar a ~1200%).

## Manter

- **Antes de qualquer alteração de código**: ler `openspec/changes/trendai-impact-monitor/design.md` (D1–D9) e a spec em `specs/monitor/spec.md`. Alterações de comportamento exigem atualizar spec/design na mesma mudança (CON-0016: specs no repo, não copiar da memória).
- **Suíte de regressão** (isolada em %TEMP%, ~12 s):
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\helder.toucas\Dev\home\scripts\monitor\test-monitor.ps1
```
100% PASS obrigatório antes de considerar qualquer mudança concluída. Novo comportamento ⇒ novo assert.
- **CON-0012**: tarefa concluída no `tasks.md` nunca é só `[x]` — anexar `- *Executed YYYY-MM-DD*: <o que mudou, roadblocks>`. Validação: `scripts/validate-openspec-tasks.ps1`.
- **Schema CSV é contrato**: os 4 componentes partilham `monitor-common.ps1` — mudar schema = mudar o módulo + spec + testes de uma vez.
- Grep de conformidade após mexer em código: proibir `Get-NetTCPConnection`, `-EncodedCommand`, `irm`, `iex`, `CurrentVersion\Run`, `schtasks`.

## Troubleshooting

- **`Get-Counter`/PDH falha (`c0000bb8`)**: esperado nesta máquina (Perflib `009` vazio; reparação exige admin). O monitor não usa PDH — não "corrigir" com Get-Counter; CIM (`Win32_PerfFormattedData_*`) funciona e é usado apenas a cada ~30 s.
- **CPU sem valor em processos PPL** (`MsSense`, etc.): por design — `cpu_pct` vazio, não é erro.
- **"Acesso negado" ao editar `.ps1`**: bloqueio transitório do EDR — repetir a edição.
- **Editores/consola mostram decimais com vírgula**: o CSV usa ponto (invariant culture); a consola usa cultura pt-PT. Testes que validam output da consola devem aceitar `[.,]`.
- **Valores de CPU impossíveis (>núcleos×100)**: regressão da fórmula — ver `reference.md` (bug histórico B1) e os asserts de regressão da suíte.
- **Nenhum svchost com serviço resolvido no CSV**: a resolução só corre quando um svchost entra no top-K — num dia sem svchost no topo o campo fica `_`.

## Descoberta de lentidão (utilização típica)

1. Arrancar o monitor ao início do dia de trabalho; marcar `m` cada momento de lentidão sentida.
2. No fim do dia, correr `analyze.ps1 -Dia <data>` e ler os rankings de desvio.
3. Procurar padrões repetidos entre eventos (mesmo processo no topo com desvio alto).
4. Dados descartáveis: os CSVs podem ser apagados a qualquer momento; nada é enviado, nada é commitado.
