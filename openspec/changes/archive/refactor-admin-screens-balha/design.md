# Design: Telas /admin/ → Balha v10 (Scroll Zero + Cards)

## Context
Admin portal (~15 rotas) precisa migrar de layout tabelas/seções para Balha v10. Sidebar atual usa `bg-card` em vez de `bg-sidebar`. Tabelas de dados dominam. Formulários têm scroll vertical.

## Goals
- Sidebar colapsável 64px/256px com tokens Balha
- Grid de cards substitui tabelas onde possível
- Filtros em horizontal scroll pills
- Formulários em stepper de cards
- Zero shadow/gradient, font-weight ≤600, Rethink Sans
- CTA sticky global nas telas de ação

## Decisions

### 1. AdminLayout + Sidebar
- Sidebar: `bg-sidebar`, w-16/w-64, hover expand. Active pill `bg-sidebar-primary`.
- Header: sticky, `bg-background`, 64px, `border-b border-sidebar-border`.
- Breadcrumbs: em fluxos >2 níveis.
- Mobile: bottom nav igual candidate.

### 2. Dashboard (`/admin/dashboard`)
- Filtros (período, área, gestor, urgência): horizontal scroll pills.
- Grid 3-col metric-cards: Vagas Abertas, Candidatos Ativos, Tempo Médio, Atrasados.
- Funnel conversão: card único com barra horizontal (não bento grid).
- Tabelas "Vagas Recentes" e "Candidatos Recentes" → grid de cards interativos (2-3 col) com dados essenciais + link.
- CTA sticky: "Criar Vaga".

### 3. Jobs Listing (`/jobs`)
- Filtros: horizontal scroll pills (status, gestor, área).
- Tabela → grid 2-3 col de cards interativos. Cada card: título, departamento, local, modelo, urgência badge, status, deadline, nº candidatos. Ações: Kanban, Editar, Excluir em ghost buttons no rodapé.
- Empty state: card dashed border.

### 4. Job Detail (`/jobs/[id]`)
- Card header: título, status, metadados.
- Tabs: Descrição, Requisitos, Candidatos.
- Accordion: informações secundárias (SLA, trilha).
- CTA: "Editar Vaga" no header.

### 5. Job Form (`/jobs/new`, `/jobs/[id]/edit`)
- Stepper de cards: Step 1 Dados Gerais, Step 2 Requisitos, Step 3 Configurações.
- Cada step = 1 card autocontido. Progress bar Balha.
- Botões: Próximo/Voltar/ Salvar.

### 6. Kanban (`/jobs/[id]/kanban`)
- Colunas: `bg-sidebar` ou `bg-muted`, `border border-border`.
- Cards candidato: tokens Balha, zero shadow.
- Modais (agendar, feedback): cards Balha.

### 7. Roles (`/roles`, `/roles/new`, `/roles/[id]/edit`)
- Listing: tabela → grid 2-3 col de cards (título, código, dept, status, vagas ativas).
- Form: stepper de cards (Cadastrais → Classificação → Requisitos → Escopo).

### 8. Talent Bank (`/talent-bank`)
- Grid de cards mantido (já é card-based). Atualizar tokens.
- Filtros avançados: horizontal scroll pills.
- CTA sticky: "Convidar Candidato".

### 9. Audit (`/audit`)
- Tabela de logs mantida (dados tabulares extensos). 
- Cards para filtros (data range, tipo, usuário) em horizontal scroll.
- Modal detalhes: card Balha.

### 10. Settings (`/settings`)
- Tabs mantidas (Usuários, Privilégios, Escopo, Sistema).
- Users: tabela mantida com cards para modal create/edit.
- Privilégios: toggle switches em cards.
- Escopo: selects + chips em cards.

### 11. Remoção de Anti-Patterns (global admin)
- `border-2` → `border` (1px)
- `shadow-*` → remover
- `font-bold` → `font-semibold`
- `bg-white`/`#ffffff` → `bg-background`/`bg-card`
- Hardcoded colors → tokens CSS

## Non-Goals
- Não alterar comportamento de modais/drawers (só tokens)
- Não alterar lógica de drag-and-drop no Kanban
- Não alterar rotas/URLs
- Não refatorar serviços/hooks

## Risks
- Tabelas grandes (Audit, Users) viram grid → perdem densidade informacional. Manter tabela como exceção justificada.
- Stepper em Job Form → tempo extra de desenvolvimento. Trade-off aceito por Scroll Zero.
- Sidebar colapsável → testar em todas as páginas admin.
