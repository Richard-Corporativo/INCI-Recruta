# Change: Refatorar Telas /admin/ para Balha Design System v10

## Why
Admin screens (`/admin/dashboard`, `/jobs`, `/roles`, `/talent-bank`, `/audit`, `/settings`) usam layout legado baseado em tabelas e seções verticais. Sidebar não segue Balha v10 (não é colapsável 64/256px, não usa tokens `bg-sidebar`/`sidebar-border`). Tabelas de dados e formulários longos geram scroll vertical excessivo, violando Scroll Zero.

## What Changes
- **AdminLayout + Sidebar**: sidebar colapsável 64px/256px com tokens Balha (`bg-sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-border`). Header sticky com breadcrumbs. Mobile bottom nav.
- **Dashboard**: tabelas + KPIs → grid de metric-cards (2-3 col) + horizontal scroll de filtros + gráfico funnel em card. CTA sticky global.
- **Jobs Listing**: tabela → grid de cards interativos (2-3 col) com status badge, ação rápida. Filtros em horizontal scroll de pills.
- **Job Detail**: seções empilhadas → card header + tabs (Descrição/Requisitos/Candidatos) + accordion para informações secundárias.
- **Job Form** (create/edit): formulário longo → stepper de cards (Dados Gerais → Requisitos → Configurações). Cada step = 1 card.
- **Kanban**: já card-based. Atualizar tokens (bg-sidebar nas colunas, border-2 → border, tokens Balha).
- **Roles**: tabela → grid de cards. Formulário → stepper de cards.
- **Talent Bank**: grid de cards já existe. Atualizar tokens, adicionar filtros horizontais, CTA sticky.
- **Audit**: tabela mantida (dados tabulares são exceção). Cards para filtros/data range.
- **Settings**: tabs mantidas. Cada aba → cards Balha. Tabela de usuários mantida com cards para ações.
- **Global**: Remover shadow/gradient/bold>600. Aplicar Rethink Sans. `border` (1px) em vez de `border-2`.

## Impact
- Affected specs: `admin-management` (MODIFIED — layout, tokens, scroll-zero)
- Affected files: ~30 files (layouts, pages, components, sidebar)
- Breaking: visual only on all admin screens. No API/behavior change.
