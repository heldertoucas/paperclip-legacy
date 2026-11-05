---
name: ai-connectpc
description: >-
  Matriz de decisão, diagnóstico e receituário técnico para todos os modos de
  conexão e colaboração remota entre Mac Mini M6, PC Windows e iPad (SSH, Warp,
  VS Code Web, Playwright e LAN/Ngrok).
metadata:
  targets: '["*"]'
---
# 🔌 Cross-Station Connect (`/ai-connectpc`)

Utilize esta skill a qualquer momento da sessão para **decidir, alternar e diagnosticar o melhor modo de conexão** entre a estação de trabalho Windows (PC corporativo sem privilégios de admin sob EDR), o Mac Mini M6 (servidor/motor de computação) e dispositivos móveis (iPad).

> [!IMPORTANT]
> **Horário de Disponibilidade do Mac Mini**:
> * **Janela Ativa (08:00 às 02:00 am)**: O Mac Mini está **sempre ligado e pronto a receber conexões** (caffeinate ativo via LaunchAgent).
> * **Janela Noturna (02:00 às 08:00 am)**: O Mac Mini **suspende normalmente se estiver em idle** (poupança de energia). Se o utilizador se conectar por SSH durante a noite, a máquina mantém-se acordada enquanto a sessão durar.

Consulte as decisões e restrições canónicas: [[04-decisions/DEC-0032|DEC-0032]], [[08-system/constraints/CON-0035|CON-0035]], [[08-system/constraints/CON-0020|CON-0020]] e a auditoria [[08-system/agents/.rulesync/skills/ai-cmldefender/SKILL|ai-cmldefender]].

---

## 🧭 1. Matriz de Decisão Situacional

| Cenário / Objetivo | Modo Recomendado | Onde corre o quê | Consumo no Windows |
| :--- | :--- | :--- | :---: |
| **Terminal Rápido no Warp (em casa)** | **Modo 1: SSH LAN Leve** (`ssh mac-lan`) | Terminal e UI no Windows; comandos/compilação no Mac Mini | 🟢 Mínimo (<20 MB) |
| **Depuração Playwright / Apps Web** | **Modo 2: Túnel de Telemetria** (`ssh mac-lan-tunnel`) | Testes e servidor no Mac; UI visual no Chrome/Edge do Windows | 🟢 Baixo (browser local) |
| **VS Code sem instalar nada no Windows** | **Modo 4: VS Code Web** (`vscode.dev/tunnel/...`) | IDE completo servido pelo Mac; visualizado no browser do Windows | 🟢 Médio (uma aba de browser) |
| **VS Code Desktop Nativo na barra de tarefas** | **Modo 3: VS Code Remote-SSH** (`code --remote ...`) | UI do VS Code no Windows; extensões e ficheiros no Mac | 🟡 Moderado (Electron local) |
| **Fora de casa (Café, 4G, Escritório)** | **Modo 4 (VS Code Web)** ou **Modo 5 (Ngrok TCP)** | Conexão segura através de túnel criptográfico | 🟢 Baixo |
| **No Sofá / Viagem com iPad + Teclado** | **Modo 6: iPadOS Blink Shell & Safari** | Terminal e Playwright controlados diretamente pelo iPad | 🟢 Bateria longa, zero ruído |
| **Configurar o PC Windows a partir do Mac** | **Modo 7: Scripts Auditados CML-Safe** | Antigravity prepara scripts em `home/scripts/`; Windows corre localmente | 🟢 100% CML Defender Safe |

---

## 🛠️ 2. Receituário Técnico por Modo

### Modo 1: Terminal Interativo Leve no Warp (LAN)
* **Quando usar**: Desenvolvimento diário, git, comandos, agentes de IA (`claude`, `agy`), tarefas de compilação.
* **Comando no Windows (Warp / PowerShell)**:
  ```bash
  ssh mac-lan
  ```
* **Características**:
  * Seguro para abrir **múltiplas abas e split-panes** concorrentes no Warp sem erros de portas presas.
  * Autenticação estrita por chave Ed25519 (sem passwords).
  * Latência < 1 ms na rede local.

---

### Modo 2: Túnel de Telemetria Playwright & Aplicações Web
* **Quando usar**: Sempre que fores executar testes visuais com o Playwright ou inspecionar webapps (Next.js, FastAPI).
* **Comando no Windows (Warp / PowerShell)**:
  ```bash
  ssh mac-lan-tunnel
  ```
* **Mapeamento de Portas Integrado**:
  * `localhost:9323` ➔ **Playwright UI / Trace Viewer** (conforme `CON-0020`).
  * `localhost:3000` ➔ Servidor Web de Frontend (Next.js / Vite).
  * `localhost:1080` ➔ Proxy SOCKS5 dinâmico para aceder a qualquer porta do Mac Mini.
* **Comando no Mac Mini para disparar o Playwright com segurança**:
  ```bash
  # Obrigatório loopback 127.0.0.1 (prevenção de fuga de traces na Wi-Fi):
  npx playwright test --ui-port=9323 --ui-host=127.0.0.1
  ```
* **No browser do Windows**: Acedes a `http://localhost:9323`.

---

### Modo 3: VS Code Desktop Nativo (Thin-Client Remote-SSH)
* **Quando usar**: Se preferes o atalho tradicional do VS Code instalado no Windows.
* **Instalação CML-Safe no Windows (sem admin)**:
  ```powershell
  pwsh -File scripts\setup-vscode-desktop.ps1 -LaunchAfterInstall
  ```
* **Lançamento direto conectado ao Mac Mini**:
  ```powershell
  code --remote ssh-remote+mac-lan /Users/heldertoucas/dev
  ```

---

### Modo 4: VS Code Gráfico no Browser (Zero-Install no Windows)
* **Quando usar**: Quando o Windows estiver lento, sem espaço de disco, ou para programar no iPad / outro PC sem instalar ferramentas.
* **Arranque no Mac Mini**:
  ```bash
  ./scripts/start-vscode-web.sh start
  # Ou como serviço permanente de fundo:
  ./scripts/start-vscode-web.sh service
  ```
* **Acesso**:
  * Abres no **Edge**, **Chrome** ou **Safari** do iPad:
    👉 **`https://vscode.dev/tunnel/mac-mini-helder`**
  * 100% gratuito, sem limite de 1 GB, atravessa proxies corporativos (HTTPS porta 443).

---

### Modo 5: Acesso Remoto Exterior (Ngrok TCP)
* **Quando usar**: Fora da rede Wi-Fi residencial para acesso direto via terminal.
* **Arranque do túnel no Mac Mini**:
  ```bash
  ngrok tcp 22
  ```
* **Conexão no Windows (Warp / PowerShell)**:
  ```bash
  # Ligar via endpoint atribuído (usar IP direto caso o DNS corporativo bloqueie domínios ngrok.io):
  ssh -p <PORTA> heldertoucas@<IP_OU_HOST>
  ```

---

### Modo 6: Conexão via iPadOS (Teclado e Rato Bluetooth)
* **Quando usar**: Mobilidade no sofá ou em viagem.
* **Terminal**: Usar **Blink Shell** ou **Termius** com a chave Ed25519 do iPad adicionada a `~/.ssh/authorized_keys`.
* **Playwright**: Abrir o Safari do iPad em `http://192.168.68.107:9323`.
* **IDE**: Abrir o Safari do iPad em `https://vscode.dev/tunnel/mac-mini-helder`.

---

### Modo 7: Como Controlar / Configurar o PC Windows a partir do Mac
* **Regra de Ouro (CON-0035 / ai-cmldefender)**:
  * **NUNCA** instalar servidores SSH ou agentes de shell reversa no Windows corporativo (gatilho fatal `FLS.ISB.*` da Trend Micro).
* **Protocolo Homologado**:
  1. O agente no Mac prepara scripts limpos em `home/scripts/nome-tarefa.ps1`.
  2. Valida o checklist do `/ai-cmldefender` (sem Base64, sem `irm|iex`, sem `Get-NetTCPConnection`).
  3. No Windows, o utilizador puxa via `git pull --rebase` ou `scp mac-lan:... .` e executa no seu terminal local transparente.

---

## ⚙️ 3. Configurações Ativas do Mac Mini M6 (Infraestrutura Estável)

| Parâmetro | Valor Configurado | Descrição / Função |
| :--- | :--- | :--- |
| **Identidade mDNS** | `Macmini-Helder.local` | Nome estável para conexão SSH; dispensa saber o IP se mudar no router |
| **IP Local (LAN)** | `192.168.68.107` | Endereço estático/DHCP atual na rede Wi-Fi/Ethernet |
| **Utilizador** | `heldertoucas` | Utilizador de autenticação com permissões completas |
| **Serviço SSH** | Porta `22` (TCP) | Daemon nativo do macOS (`com.openssh.sshd`) em execução permanente |
| **Chave Autorizada** | `~/.ssh/authorized_keys` | Chave Ed25519 do PC Windows com permissões `600` |
| **Prevenção de Sono** | `com.local.caffeinate` | LaunchAgent persistente executando `scripts/mac-caffeinate-scheduler.sh` |
| **Janela Ativa (08:00 - 02:00)** | `PreventSystemSleep=1` | Mac Mini 100% acordado, disco e rede permanentemente ativos |
| **Janela Noturna (02:00 - 08:00)** | `Idle Sleep Permitido` | Asserções libertadas; Mac suspende se estiver em idle (sessões SSH ativas mantêm-no acordado) |
| **VS Code Web Tunnel** | `mac-mini-helder` | Túnel persistente para acesso gráfico via `https://vscode.dev/tunnel/mac-mini-helder` |

---

## 🤖 4. Procedimentos de Diagnóstico e Atuação para o Agente

Sempre que a skill `/ai-connectpc` for invocada ou o utilizador reportar dificuldades de conexão:

1. **Verificar Saúde da Conexão e Energia (no Mac Mini)**:
   ```bash
   # 1. Verificar se o SSH está a escutar:
   nc -zv -G 1 localhost 22

   # 2. Verificar se o agente caffeinate está a manter o Mac acordado:
   launchctl list | grep caffeinate
   pmset -g assertions | grep -A 2 "caffeinate"

   # 3. Inspecionar sessões ativas vindas do Windows:
   who
   ```
2. **Orientar a Conexão no Windows**:
   * Recomendar sempre o uso do hostname mDNS `Macmini-Helder.local` em vez do IP para tolerância a falhas de DHCP.
   * Assegurar que o Windows utiliza `ssh mac-lan` para tarefas normais e `ssh mac-lan-tunnel` apenas quando necessita do Playwright (`9323`).
3. **Gerir Túneis Web e Remotos**:
   * Para ativar o VS Code no browser: verificar se `code tunnel status` está online; se não, executar `./scripts/start-vscode-web.sh`.
   * Para o Ngrok: iniciar `ngrok tcp 22` e extrair imediatamente o endpoint e porta dinâmica para o utilizador.

---

## 🚨 5. Guia Rápido de Troubleshooting

| Sintoma | Causa Provável | Solução Imediata |
| :--- | :--- | :--- |
| `bind [127.0.0.1]:9323: Address already in use` | Porta 9323 presa por outra aba do terminal | Usa `ssh mac-lan` para abas normais; reserva `mac-lan-tunnel` para a aba de testes. |
| `Could not resolve hostname *.ngrok.io` | DNS corporativo a bloquear domínios dinâmicos | Usa o IP público correspondente (`nslookup`) ou utiliza o **Modo 4 (VS Code Web)**. |
| `Bad owner or permissions on .ssh/config` | Permissões herdadas no Windows 11 | Executa: `icacls $env:USERPROFILE\.ssh\config /inheritance:r /grant:r "$($env:USERNAME):F"` |
| Mac Mini não responde na rede | Mac entrou em modo de suspensão / sleep | Verificar se o LaunchAgent `com.local.caffeinate` está ativo (`launchctl list \| grep caffeinate`). |
