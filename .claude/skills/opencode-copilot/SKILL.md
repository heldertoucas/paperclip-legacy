---
name: opencode-copilot
description: >-
  Delegates heavy local refactoring, boilerplate generation, or runs long
  terminal commands in the local workspace. Do not use for remote GitHub
  actions.
---
# OpenCode Copilot Skill

Esta skill orienta o agente principal sobre como delegar tarefas de desenvolvimento locais pesadas ao **OpenCode** utilizando Model Context Protocol (MCP).

## 1. Regras Críticas de Execução & Descoberta

> [!IMPORTANT]
> O OpenCode requer a descoberta ativa do provedor e modelo de LLM configurados localmente para evitar falhas silenciosas ou respostas vazias.

* **Descoberta de Provedor Obligatória**: O agente principal **DEVE** chamar `opencode_setup` antes de qualquer execução para descobrir os IDs de provedores e modelos válidos no ambiente do utilizador.
* **Caminho Absoluto de Diretório**: Especifique sempre o parâmetro `directory` utilizando o caminho absoluto do projeto local ativo. Nunca use caminhos relativos ou omita o diretório para evitar edições fora da área de trabalho do projeto.
* **Controlo de Permissões de Execução**: Se a tarefa exigir comandos shell complexos, o OpenCode poderá pausar à espera de autorização. Monitorize o estado com `opencode_permission_list` e responda com `opencode_session_permission`, ou ajuste as permissões em runtime através de `opencode_config_update({config: {permission: "allow"}})` para ambientes automatizados.

## 2. Ferramentas e Recursos Expostos

O OpenCode é acedido através do servidor MCP `opencode`:

### Ferramentas Essenciais
* `opencode_setup`: Verifica a saúde do servidor e lista provedores/modelos prontos a usar.
* `opencode_context`: Sumariza caminhos do projeto e estado git.
* `opencode_ask`: Executa uma prompt rápida de forma síncrona.
* `opencode_run`: Executa uma tarefa síncrona com limite de 10 minutos e devolve os resultados de execução.
* `opencode_fire`: Dispara uma tarefa de longa duração de forma assíncrona, devolvendo o `sessionId` imediatamente.
* `opencode_check`: Permite espreitar o progresso atual, todos e contagem de ficheiros de uma sessão ativa.
* `opencode_wait`: Bloqueia o processo à espera de uma sessão assíncrona com um tempo limite configurado.
* `opencode_reply`: Continua a conversação numa sessão ativa para correções iterativas.
* `opencode_review_changes`: Retorna as modificações de ficheiros geradas pelo OpenCode.

---

## 3. Fluxo de Trabalho e Exemplos de Execução

### Workflow de Delegação
1. Execute `opencode_setup` para obter a lista de provedores e modelos ativos.
2. Inicie a sessão usando `opencode_run` ou `opencode_fire` especificando o caminho absoluto do diretório do projeto.
3. Monitorize a execução consultando periodicamente o progresso com `opencode_check`.

### Exemplo de Configuração de Chamada (Tool Call)
```json
{
  "prompt": "Create a new helper function in utils.js to format currencies as EUR",
  "providerID": "gemini",
  "modelID": "gemini-1.5-pro",
  "directory": "C:/Users/helder.toucas/Dev/<project-path>"
}
```

---

## 4. Cenários Comuns de Delegação (Token-Saving)

Para evitar esgotar a memória de contexto do agente principal, delegue as seguintes situações:

### A. Escrita de Código de Suporte (Boilerplate)
* **Ação**: Chame `opencode_run` descrevendo a estrutura de ficheiros pretendida. O subagente cria os ficheiros localmente. O agente principal apenas consome a lista resumida de ficheiros modificados através do `opencode_review_changes`.

### B. Investigação e Sumarização Crítica (Exploração)
* **Ação**: Delegue tarefas de análise profunda da base de código ao OpenCode com instruções explóratorias. O agente principal apenas lê o relatório markdown produzido, poupando milhares de tokens de leitura cruzada de código.

### C. Execução e Correção de Testes
* **Ação**: Chame `opencode_run` indicando ao subagente para correr testes locais (`npm test`, `pytest`) e corrigir iterativamente os erros de compilação ou importação detetados, sem poluir a janela de contexto principal com logs gigantes de stacktrace.

---

## 5. Diretrizes de Qualidade & Controlo

### Anti-Patterns / O que evitar
* **Never** invoke OpenCode without executing `opencode_setup` first to discover active providers.
* **Do not** omit the absolute `directory` parameter, otherwise the server will fallback to default system paths.
* **Avoid** running destructive tasks without taking a git commit snapshot of the local tree.

### Loop de Validação / Feedback Loop
1. Verify the code modifications using `opencode_review_changes` after execution completes.
2. Run the local test suite; if tests fail, send a feedback reply to the session with the errors and repeat until they pass.

---

## 6. Matriz de Seleção de Modelos por Tarefa

Dependendo da tarefa e da subscrição ativa, escolha o modelo mais adequado para otimizar desempenho e custo (tokens):

| Tipo de Tarefa | Provedor / Subscrição | Modelos Recomendados | Raciocínio / Objetivo |
| :--- | :--- | :--- | :--- |
| **Refactoring Pesado & Lógica Complexa** | `github-copilot` / `opencode-go` | `claude-sonnet-4.5`, `claude-sonnet-5`, `qwen3.7-max` | Máxima capacidade de raciocínio lógico e adesão a padrões complexos de arquitetura. |
| **Boilerplate & Geração Rápida** | `opencode-go` / `github-copilot` | `deepseek-v4-flash`, `gemini-3.5-flash`, `qwen3.7-plus` | Rapidez, economia de contexto e latência ultra-baixa. |
| **Análise de Contexto & RAG Largo** | `github-copilot` | `gemini-3.1-pro-preview`, `gemini-2.5-pro` | Janela de contexto massiva para ler múltiplos ficheiros ou documentação extensa. |
| **Execução & Correção de Testes (Loops)** | `opencode-go` / `github-copilot` | `kimi-k2.7-code`, `gpt-5.3-codex` | Alta proficiência em depuração de código e iterações de correção rápida. |
| **Pesquisa & Exploração Inicial** | `opencode-go` | `deepseek-v4-pro`, `glm-5.2` | Excelente equilíbrio entre custo e capacidade analítica geral. |

*Nota: Para utilizar os modelos do `github-copilot`, certifique-se de que a sessão OAuth ou a variável `GITHUB_TOKEN` está ativa no ambiente local.*
