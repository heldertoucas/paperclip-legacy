---
name: ai-cmldefender
description: >-
  Audita código, comandos, scripts e padrões de execução para prevenir falsos
  positivos, quarentenas e alarmes do Microsoft Defender e Trend Micro Apex One
  / TrendAIT em ambientes corporativos sem privilégios de administrador.
---
# 🛡️ CML Security Guard (`/ai-cmldefender`)

Utilize esta skill antes de executar tarefas que envolvam scripts de sistema, comandos de terminal, arranque automático, execução em memória ou compilação de binários nativos num computador corporativo com **Microsoft Defender for Endpoint** e **Trend Micro Apex One (TrendAIT / AEGIS Behavior Monitoring)** ativos, sem permissões de administrador local.

Consulte a base de conhecimento canónica em: [[03-knowledge/engineering/KNW-0026|KNW-0026]] e as restrições [[08-system/constraints/CON-0035|CON-0035]] e [[08-system/candidates/MEM-0376|MEM-0376]] (futura CON-0038).

---

## 1. Verificação Preventiva (Pre-flight Checklist)

Antes de aprovar ou executar qualquer alteração ou comando no sistema, valide os seguintes pontos:

### ⚠️ A. Persistência e Arranque (Gatilho Fatal Defender)
* [ ] **Zero Atalhos em Startup:** Nunca criar `.lnk`, `.bat` ou scripts em:
  `$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\`
* [ ] **Zero Entradas de Registo:** Não adicionar valores em:
  `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`
* [ ] **Zero Tarefas Agendadas:** Não criar tarefas com `schtasks` ou `New-ScheduledTask` para código em desenvolvimento.

### ⚠️ B. Higiene de PowerShell & AMSI (Microsoft Defender)
* [ ] **Sem Enumeração de Portas via Cmdlet:** Nunca use `Get-NetTCPConnection` ou `Test-NetConnection` em linha de comando (ativa `Trojan:Win32/NetworkDiscovery.B!pwsh`).
  * *Alternativa Segura:* `netstat -ano | findstr :<porta>`
* [ ] **Sem Ofuscação:** Nunca use `-EncodedCommand` ou scripts Base64.
* [ ] **Sem Execução Direta em Memória:** Evite `irm ... | iex` ou `DownloadString`. Grave os ficheiros localmente antes de executar.

### ⚠️ C. Padrões de Execução Trend Micro (TrendAIT / AEGIS Behavior Monitoring)
* [ ] **Proibido Código Inline em Argumentos CLI (`node -e`, etc.):** Nunca encadear `powershell -Command "node -e '...'"` com blocos de código densos passados na linha de comandos.
* [ ] **Proibido Spawn de Processos em Ciclo via Memória:** Scripts inline que invoquem repetidamente `child_process.execSync` ou subprocessos (ex.: `git log`, `git rev-list`) em múltiplos diretórios despoletam a regra heurística `FLS.ISB.4841T` (*Malware Behavior / Reconnaissance*).
* [ ] **Padrão Obrigatório de Materialização em Disco:** Toda e qualquer lógica de automação, varrimento de pastas ou inspeção complexa DEVE ser gravada primeiro num ficheiro físico (ex.: no diretório `/scratch/` ou script `.js`/`.ps1` local) e executada via apontador de ficheiro (`node script.js`).

### ⚠️ D. Binários Nativos (Rust / Go / Tauri)
* [ ] **Modo Web Primeiro:** Para tarefas puramente de interface/frontend, use sempre `npm run dev` (evita gerar `.exe`).
* [ ] **Ciclo Tauri Local:** Ao testar desktop, use `npm run tauri dev` a partir da raiz do projeto.
* [ ] **Manter Binários no Diretório do Projeto:** Nunca mova ficheiros de `target\release\` para pastas globais ou para o perfil de utilizador.

### ⚠️ E. Operações em Lote e I/O Pesado (Vault, Multi-Repositório)
* [ ] **Sem Varrimentos Recursivos Amplos:** Nunca `Get-ChildItem -Recurse` / `rg` / Grep sobre o Vault inteiro, `Dev/` ou `~`. Aponte para a subpasta exata, use `-Depth`, ou use as ferramentas DU (`search_memory`, `get_entity`) em vez de grep global.
* [ ] **Um Comando Barato por Repositório:** Em ciclos sobre vários repositórios, evite pipelines que lançam vários subprocessos por repo (`git log | Measure-Object`, contagem de histórico completo). Prefira ler `.git/config` como ficheiro (sem subprocesso) ou `git rev-list --count` apenas se necessário.
* [ ] **Tarefas Longas em Background:** Qualquer lote que possa passar de ~60 s corre com `run_in_background` e lê-se o ficheiro de saída; não encadear `Start-Sleep` em primeiro plano (excede o timeout de 120 s e termina com código 143).
* [ ] **Não Apagar e Recriar Worktrees do Vault:** `git worktree remove/add` num Vault grande demorou >12 min cada. Crie o worktree uma só vez, a partir da base certa (ver secção 3).

---

## 2. Diagnóstico Rápido de Incidentes (Sem Elevação de Admin)

Se uma ação for bloqueada ou abortada silenciosamente por razões de segurança, utilize estes métodos não-privilegiados para saber a causa exata:

### A. Para Bloqueios da Trend Micro (Apex One / AEGIS Behavior Monitoring)
Consulte o log de monitorização de comportamento diretamente:
```cmd
type "C:\Program Files (x86)\Trend Micro\Security Agent\Misc\AEGIS_BM.log"
```
*(Procure pelo campo `Threat-Detection`, regra como `FLS.ISB.*` e o respetivo comando bloqueado em `command_line`)*.

### B. Para Bloqueios do Microsoft Defender
Consulte os eventos operacionais recentes do Defender:
```powershell
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Windows Defender/Operational'; Id=1116,1117} -MaxEvents 3 | Format-List TimeCreated, Id, Message
```

### C. Para Lentidão Extrema (sem bloqueio explícito)
Antes de assumir EDR, confirme o que está realmente a correr (não-privilegiado, testado em 2026-10-27):
```powershell
Get-CimInstance Win32_Process -Filter "Name='git.exe'" | Group-Object { $_.CommandLine.Substring(0,[Math]::Min(110,$_.CommandLine.Length)) } | Sort Count -Descending | Select -First 8 Count,Name
```
*(Mostra se há dezenas de `git` concorrentes. Não os termine: pertencem ao editor/prompt, não à sessão.)*

---

## 3. Lentidão de I/O em Vault Grande — Achados Observados (2026-10-27)

> **Estado da evidência:** os sintomas abaixo foram **observados**. A atribuição ao EDR (Defender/TrendAIT a analisar ficheiros em tempo real) é uma **inferência não verificada** — não foi lida nenhuma deteção em `AEGIS_BM.log` nem eventos 1116/1117 nesta sessão. As mitigações marcadas *(testada)* funcionaram; *(não testada)* são recomendações.

| Sintoma observado | Causa provável | Mitigação |
| :--- | :--- | :--- |
| `git worktree remove --force` do Vault: >12 min; `worktree add` do `master`: vários minutos | Milhares de ficheiros criados/apagados com análise em tempo real e ~80 `git` de fundo (editor/prompt: `rev-parse --is-inside-work-tree`, `symbolic-ref`) a competir por locks | Criar o worktree **uma vez**; esperar pela notificação do background; não lançar mais git em paralelo *(testada)*. Não matar os `git` do editor |
| Ciclo `git remote get-url` + `git log \| Measure-Object` sobre ~30 repos: >110 s, movido para background | Subprocessos `git` em ciclo (padrão da secção 1.C) + historiais grandes (`rulesync` ≈ 7 000 commits) | Correr em `run_in_background` e ler o ficheiro de saída *(testada)*; ler `.git/config` diretamente em vez de lançar `git` *(não testada)* |
| Grep sobre `Dev/home` e `Get-ChildItem -Recurse` em `~`: timeout (20 s / 120 s) | Varrimento recursivo de Vault com dezenas de milhares de ficheiros | Restringir a subpastas, `-Depth`, ou `search_memory`/`get_entity` do DU *(testada)* |
| `Start-Sleep 90` + verificação em primeiro plano: timeout, código 143 | Shell saturado; espera acumulada acima de 120 s | Esperas ≤45 s, ou ler o ficheiro de saída do job; confiar na notificação de conclusão *(testada)* |
| `EnterWorktree` recusa o worktree: "git could not be run to resolve it" | A verificação de identidade do harness excede o seu timeout: `git rev-parse` demorou ~5 s no worktree, apesar de estar íntegro | Confirmar com `git -C <wt> rev-parse --show-toplevel`; repetir quando a carga baixar; se persistir, escrever diretamente no caminho do worktree (continua isolado de `master`) *(testada)* |
| `EnterWorktree` criou o worktree a partir de `origin/main`, com o layout antigo do Vault e sem `openspec/` | Base por omissão `fresh` = `origin/<default>`, desatualizada face a `master` local | Criar manualmente: `git worktree add -b <ramo> <caminho> master`, ou definir `worktree.baseRef: head` *(a segunda opção não testada)* |

**Regras derivadas:**
1. Primeiro diagnosticar (secção 2.C), depois agir; nunca repetir em ciclo um comando que acabou de expirar.
2. Nunca contornar o EDR (exclusões, mudar diretórios de trabalho para fugir à análise, desativar serviços): é proibido pelas restrições corporativas (`CON-0036`/`CON-0037`). Reduzir o volume de I/O e de subprocessos é a única mitigação legítima.
3. Se uma deteção real aparecer em `AEGIS_BM.log` ou nos eventos do Defender, parar, reportar `### 🚨 SYSTEM ROADBLOCK` e não reexecutar.
