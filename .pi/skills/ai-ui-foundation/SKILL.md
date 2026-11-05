---
name: ai-ui-foundation
description: >-
  Design, compose, and build React 19 / Next.js 16 user interfaces using the
  canonical ai-app-foundation design system, shadcn/ui components, and Tailwind
  v4.
---
# 🎨 AI UI Foundation Guide (`ai-ui-foundation`)

Use this skill when building or refactoring React interfaces in `ai-app-foundation` or downstream projects (`du-dashboard`, etc.).

## 🏛️ Invariantes do Design System (DU Standard)

1. **Stack Canónica**:
   - Next.js 16 (App Router, Server Components por defeito, Client Components apenas quando estritamente interativo).
   - Tailwind CSS v4 (`@import "tailwindcss"; @theme inline { ... }` em `app/globals.css`).
   - Componentes Radix UI + shadcn/ui estilizados com Phosphor Icons (`phosphor-react` / `@phosphor-icons/react`).
   - Fontes: `Geist` (Sans) e `Geist Mono` (para telemetria, portas, IDs e métricas).

2. **Cores & Tokens Semânticos**:
   - Usar **sempre** classes semânticas: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`.
   - **Nunca** inventar cores hexadecimais arbitrarias nos componentes (`#11131a`, `#1e2230`, `#6366f1`).
   - Usar os tokens de telemetria canónicos do DU para estados:
     - `text-status-live` / `bg-status-live` (Verde esmeralda para serviços ativos e portas online).
     - `text-status-drift` / `bg-status-drift` (Âmbar para drift ou avisos).
     - `text-status-missing` / `bg-status-missing` (Vermelho para offline ou falhas).

3. **Arquitetura de Layout**:
   - Layout com **Tree-view Sidebar** (`components/app-sidebar.tsx`) estruturado por áreas de domínio.
   - Top Header com Breadcrumb navegável (`components/dashboard-breadcrumb.tsx`), pesquisa rápida e `ThemeToggle`.
   - Divisão de ecrãs complexos em sub-rotas dedicadas em vez de modais gigantes ou gavetas aninhadas.

4. **Tolerância a Falhas & Resiliência (PAT-0098)**:
   - Para catálogos, grelhas densas ou visualizadores de dados pesados, isolar cada bloco/card com um `ErrorBoundary` dedicado ou carregamento assíncrono via `next/dynamic` com skeleton fallback.

## 🛠️ Composição Exemplo (KPI Stat Card em React)

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function KpiCard({ title, value, unit, status }: { title: string; value: string; unit?: string; status?: string }) {
  return (
    <Card className="hover:border-ring transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {title}
        </CardTitle>
        {status && <Badge variant="secondary">{status}</Badge>}
      </CardHeader>
      <CardContent>
        <div className="font-mono text-3xl font-bold flex items-baseline gap-2">
          {value}
          {unit && <span className="text-xs font-normal text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
```
