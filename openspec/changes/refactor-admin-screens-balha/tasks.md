# Tasks: Refatorar Telas /admin/ → Balha v10

## Phase 1: Layout Base
- [ ] 1.1 Refatorar `Sidebar.tsx` — colapsável 64px/256px, tokens `bg-sidebar`/`sidebar-primary`/`sidebar-border`
- [ ] 1.2 Refatorar `(admin)/layout.tsx` — header sticky, breadcrumbs, content padding
- [ ] 1.3 Remover shadow/gradient/bold>600 e hardcoded colors dos arquivos admin
- [ ] 1.4 Adicionar no-scrollbar CSS se necessário

## Phase 2: Dashboard
- [ ] 2.1 Filtros (período, área, gestor, urgência) → horizontal scroll pills
- [ ] 2.2 KPIs → grid 3-col metric-cards (Vagas, Candidatos, Tempo Médio, Atrasados)
- [ ] 2.3 Funnel conversão → card único
- [ ] 2.4 Tabelas recentes → grid de cards interativos
- [ ] 2.5 CTA sticky "Criar Vaga"

## Phase 3: Jobs
- [ ] 3.1 Jobs listing → grid 2-3 col cards + filtros horizontais
- [ ] 3.2 Job Detail → card header + tabs + accordion
- [ ] 3.3 Job Form → stepper de 3 cards
- [ ] 3.4 Empty states → card dashed border

## Phase 4: Kanban
- [ ] 4.1 Colunas → `bg-sidebar`/`bg-muted`, border-2 → border
- [ ] 4.2 Cards candidato → tokens Balha v10
- [ ] 4.3 Modais → cards Balha

## Phase 5: Roles
- [ ] 5.1 Roles listing → grid 2-3 col cards
- [ ] 5.2 Role Form → stepper de 4 cards

## Phase 6: Talent Bank
- [ ] 6.1 Grid cards → tokens Balha v10
- [ ] 6.2 Filtros avançados → horizontal scroll pills
- [ ] 6.3 CTA sticky "Convidar Candidato"

## Phase 7: Audit & Settings
- [ ] 7.1 Audit: cards para filtros, tabela mantida, modal detalhes → card Balha
- [ ] 7.2 Settings: tabs mantidas, cada aba → cards Balha, tokens
- [ ] 7.3 Users table mantida, modal edit → card Balha

## Phase 8: Spec & Validation
- [ ] 8.1 Atualizar spec `admin-management` com requisitos de UI Balha v10
- [ ] 8.2 Build: `npm run build` sem erros
- [ ] 8.3 Checklist auditoria Balha v10:
  - [ ] Nenhum bg-white/#ffffff como fundo principal
  - [ ] Nenhum shadow-*
  - [ ] Nenhum font-bold (700+)
  - [ ] Scroll vertical < 2 viewports por tela
  - [ ] Rethink Sans confirmado
  - [ ] Foreground #031525
  - [ ] Cards com role="listitem" semântico
