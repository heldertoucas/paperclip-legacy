---
name: ai-html-foundation
description: >-
  Build zero-build, offline-first, native HTML/CSS/JS user interfaces, cockpits,
  and webviews using the DU HTML Foundation Kit and the bundled shadcn-html
  component catalog.
---
# ⚡ AI HTML Foundation Guide (`ai-html-foundation`)

Use this skill when building single-file HTML applications, local cockpits (Sentinel, Electron/Tauri), interactive documentation, or zero-build tools for the Development Universe.

## 🏛️ Invariantes do Kit HTML Nativo

1. **Zero-Build & Offline Soberano**:
   - Não depende de npm, Node.js, empacotador (Vite/Webpack) ou CDNs externas.
   - Todo o runtime e CSS vive localmente na pasta `public/html-kit/` da `ai-app-foundation`.

2. **Paridade 1:1 de Tokens com a Foundation**:
   - Importar sempre:
     ```html
     <link rel="stylesheet" href="tokens.css">
     <link rel="stylesheet" href="vendor/shadcn-html.all.css">
     <link rel="stylesheet" href="du-components.css">
     <script src="du-runtime.js" defer></script>
     ```
   - O tema suporta Dark/Light Mode automático com persistência em `localStorage` e atalho global via `duToggleTheme()`.

3. **Princípios de Estilo e Design Subjacentes**:
   - **Ícones Monocromáticos Outline**: Nunca usar emojis nem ícones preenchidos coloridos. Utilizar SVGs nativos inline em estilo outline com `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`.
   - **Tags e Badges Sem Borda**: Badges de status e categorias (`.ui-badge`, `.du-nav-badge`, `.ui-badge-secondary`, `.ui-badge-status-live`, etc.) utilizam fundos subtis com opacidade/tint (`oklch(... / 0.15)`), texto contrastante e **sem borda** (`border: none;`).
   - **Pills e Badges Sem Quebra de Linha**: Badges e contadores (ex: `1 Active`, `12`) utilizam sempre `white-space: nowrap; flex-shrink: 0;` para nunca quebrarem em duas linhas.
   - **Layout 100% Responsivo Sem Overflow Horizontal**: O layout raiz (`.du-app-shell`) e as vistas (`.du-main-layout`, `.du-view-container`) devem respeitar rigorosamente `max-width: 100%; min-width: 0; overflow-x: hidden;`, com wrappers de tabela `.du-table-wrapper` e grelhas bento auto-ajustáveis para ecrãs menores (`1fr` em mobile / colunas fixas em desktop).
   - **Modo Duplo de Apresentação (Bento Grid vs Master-Detail)**: A página principal / overview suporta alternância instantânea entre a visão agregada em cartões Bento e a inspeção detalhada Master-Detail (`.du-master-detail-layout`), mantendo os dados selecionados no painel de detalhe (`.du-detail-pane`).

4. **Acesso ao Catálogo Completo do shadcn**:
   - Qualquer componente do **shadcn/ui** pode ser instanciado em HTML através do modelo **`codylindley/shadcn-html`**:
     - **Button**: `<button class="ui-btn ui-btn-outline">`
     - **Card**: `<div class="ui-card"><div class="ui-card-header">...</div></div>`
     - **Badge**: `<span class="ui-badge ui-badge-secondary">`
     - **Modal Dialog**: `<dialog id="meu-modal" class="ui-dialog">`
     - **Accordion**: `<details class="ui-accordion"><summary>Título</summary>...</details>`
     - **Switch**: `<label class="ui-switch"><input type="checkbox"><span class="ui-switch-slider"></span></label>`
     - **Table**: `<div class="ui-table-container"><table class="ui-table">...</table></div>`
     - **Tabs**: `<div class="ui-tabs"><div class="ui-tabs-list"><button class="ui-tab-trigger" onclick="duActivateTab(this, 'tab-1')">...`

5. **Componentes Próprios de Domínio DU & Estatísticas**:
   - **Rich Statistic Card (com SVG Outline Icon)**:
     ```html
     <div class="du-stat-card">
       <div class="du-stat-header">
         <span class="du-stat-title">Ecosystem Health</span>
         <div class="du-stat-icon-wrapper">
           <svg class="du-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
         </div>
       </div>
       <div class="du-stat-value">90%</div>
       <div class="du-stat-footer">
         <span class="du-stat-trend du-trend-up">↑ +1.2%</span>
         <span>vs last sprint</span>
       </div>
     </div>
     ```

   - **Radial Health Gauge (SVG Zero-Dependency)**:
     ```html
     <div class="du-radial-gauge" style="width: 140px; height: 140px;">
       <svg width="140" height="140" viewBox="0 0 140 140">
         <circle class="du-gauge-circle-bg" cx="70" cy="70" r="58" stroke-width="12"></circle>
         <circle class="du-gauge-circle-fill du-gauge-tier-optimal" cx="70" cy="70" r="58" stroke-width="12" stroke-dasharray="364.4" stroke-dashoffset="36.4"></circle>
       </svg>
       <div class="du-gauge-center">
         <span class="du-gauge-val">90%</span>
         <span class="du-gauge-label">Optimal</span>
       </div>
     </div>
     ```

   - **Target Proportional Stacked Bar**:
     ```html
     <div class="du-stacked-bar">
       <div class="du-bar-segment du-bar-live" style="width: 80%;"></div>
       <div class="du-bar-segment du-bar-drift" style="width: 15%;"></div>
       <div class="du-bar-segment du-bar-missing" style="width: 5%;"></div>
     </div>
     ```

   - **Operational Velocity Sparkline**:
     ```html
     <svg class="du-sparkline" width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none">
       <polygon class="du-sparkline-area" points="0,60 0,45 30,50 60,35 90,40 120,25 150,15 180,10 200,60"></polygon>
       <polyline class="du-sparkline-line" points="0,45 30,50 60,35 90,40 120,25 150,15 180,10"></polyline>
     </svg>
     ```

   - **Telemetry Pill com Ping Animado**:
     ```html
     <div class="du-telemetry-pill">
       <span class="du-ping-core" style="background-color: var(--status-live);"></span>
       <span>Online</span>
     </div>
     ```

   - **Quick Command Palette / Barra de Pesquisa**:
     ```html
     <button class="du-command-bar" data-du-modal-open="du-command-dialog">
       <svg class="du-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
       <span>Procurar...</span>
       <span class="du-command-shortcut">Ctrl+K</span>
     </button>
     ```

## 🎮 Atributos Declarativos do Micro-Runtime (`du-runtime.js`)

Sem necessidade de escrever JavaScript por ecrã, utilize:
- **`data-du-nav-target="view-id"`**: Alterna vistas automaticamente na `.du-app-shell` e atualiza o breadcrumb `#du-breadcrumb-title`.
- **`data-du-filter-target="table-id"`**: Filtra linhas de tabela em tempo real com debounce nativo.
- **`data-du-status-filter="status-val"`**: Alterna chips de estado e filtra linhas com `data-status="status-val"`.
- **`data-du-modal-open="modal-id"`** & **`data-du-modal-close`**: Abre/fecha modais e diálogos com suporte a tecla `Escape`.
- **`data-du-drawer-open="drawer-id"`** & **`data-du-drawer-close`**: Abre/fecha slide-over drawers laterais de telemetria/informação (com suporte a clique no backdrop para fechar).
- **`data-du-copy="texto-a-copiar"`**: Copia para o clipboard e dá feedback visual ("Copied!").

## 🗂️ Drawer Lateral de Informação (`.du-drawer`)
```html
<div id="info-drawer" class="du-drawer-overlay">
  <div class="du-drawer">
    <div class="du-drawer-header">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <h3 id="drawer-title" style="font-weight: 700; margin: 0; font-size: 1rem;">System Telemetry</h3>
        <span class="ui-badge ui-badge-status-live">Live</span>
      </div>
      <button class="ui-btn ui-btn-ghost ui-btn-sm" data-du-drawer-close>✕</button>
    </div>
    <div id="drawer-content" class="du-drawer-body">
      <!-- Seções com cards, invariantes, sockets de telemetria e atalhos com data-du-copy -->
    </div>
    <div class="du-drawer-footer">
      <button class="ui-btn ui-btn-outline ui-btn-sm" data-du-drawer-close>Close</button>
    </div>
  </div>
</div>
```

## 🚀 Como Criar uma Nova App Cockpit / Projeto HTML

O kit oferece templates completos prontos para cópia em `ai-app-foundation/public/html-kit/templates/`:

1. **`du-html-app-template.html` (Template Completo de Referência DU)**:
   - Contém todos os componentes e capacidades:
     - Sidebar de navegação multi-vista com secções, ícones outline e badges flexíveis.
     - Top bar responsiva com telemetry pill, botão da drawer e quick command palette (`Ctrl+K`).
     - Alternador de visualização na Overview: **Bento Grid** vs **Master-Detail**.
     - Métricas SVG: Gauge radial, sparklines, stacked bars proporcionais e linear meters.
     - Tabelas completas com pesquisa em tempo real e chips de filtro de estado.
     - Slide-over Drawer de Informação (`.du-drawer`).
     - Modais de detalhe/dossier e Command Dialog nativo `<dialog>`.
   - **Como usar**: Copiar diretamente `public/html-kit/templates/du-html-app-template.html` para o novo projeto ou ecrã.

2. **`template-app-shell.html` (Starter Scaffold Limpo)**:
   - Estrutura base da Shell (`.du-app-shell`, sidebar, topbar, vistas) sem dados pesados de demonstração.

3. **`starter-cockpit.html` (Bento Grid Sem Sidebar)**:
   - Layout compacto de página única para widgets ou ferramentas rápidas.

### Passos de Implementação:
1. Copiar o template pretendido (ex: `du-html-app-template.html`).
2. Garantir as referências CSS/JS para `tokens.css`, `vendor/shadcn-html.all.css`, `du-components.css` e `du-runtime.js` (ou manter embutido como standalone).
3. Seguir rigorosamente as regras de estilo:
   - Outline SVG icons apenas;
   - Sem bordas nas badges;
   - `white-space: nowrap` e `flex-shrink: 0` em todas as badges/pills;
   - Sem overflow horizontal na janela (`max-width: 100%`).
