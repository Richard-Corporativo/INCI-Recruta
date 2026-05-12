# Tasks: Refatorar Telas /candidate → Balha v10

## Phase 1: Projeto & Layout Base
- [ ] 1.1 Atualizar `CandidateLayout.tsx` — sidebar 64px/256px + header sticky + main bg-background + breadcrumbs
- [ ] 1.2 Remover shadow/gradient/bold>600 e hardcoded colors globais dos candidatos (CSS audit)
- [ ] 1.3 Garantir Rethink Sans em todos os textos + tabular-nums em números

## Phase 2: Dashboard
- [ ] 2.1 Refatorar `CandidateDashboard.tsx` — grid 2-col de cards (Identidade, Métricas, Resumo, Links)
- [ ] 2.2 Adicionar horizontal scroll de cards de ação rápida (Minhas Candidaturas, Ver Vagas, Editar Perfil)
- [ ] 2.3 Adicionar CTA sticky global "Nova Candidatura"
- [ ] 2.4 Atualizar skeletons para layout de grid

## Phase 3: My Applications
- [ ] 3.1 Refatorar `MyApplications.tsx` — horizontal strip de metric-cards (Total/Ativos/Encerrados)
- [ ] 3.2 Grid 2-3 col de cards de candidatura (interactive card com hover → bg-muted)
- [ ] 3.3 Empty state como card com dashed border + CTA
- [ ] 3.4 Remover stats vertical → horizontal scroll com snap

## Phase 4: Application Detail
- [ ] 4.1 Refatorar `ApplicationDetail.tsx` — job header card + horizontal scroll de stage cards
- [ ] 4.2 Accordion de ações no rodapé (FAQ + Desistir)
- [ ] 4.3 Breadcrumb de navegação (aplicações > detalhe)
- [ ] 4.4 Manter modal de confirmação com wrapper Balha

## Phase 5: Settings
- [ ] 5.1 Refatorar `CandidateSettings.tsx` — tab bar mantida, ProfileSection em grid 2-col
- [ ] 5.2 Criar 6 cards independentes para cada seção do perfil:
  - [ ] Dados Pessoais (nome, role, phone, location, salary + avatar)
  - [ ] Resumo Profissional (textarea)
  - [ ] Formação (EducationListEditor)
  - [ ] Experiência (ExperienceListEditor)
  - [ ] Habilidades (SkillsSelector + LanguagesSelector)
  - [ ] Links (LinkedIn/GitHub/Portfolio + resume upload)
- [ ] 5.3 Cada card com CTA "Salvar" próprio
- [ ] 5.4 Responsivo: grid-cols-1 <1024px, grid-cols-2 >=1024px
- [ ] 5.5 Manter aba Notificações/Segurança/Dados como cards únicos (já compactos)

## Phase 6: Wizard
- [ ] 6.1 Refatorar `CandidateWizard.tsx` — tokens Balha v10 (bg-background page, bg-card stepper, progress bar sem shadow)
- [ ] 6.2 Header dark bar → bg-foreground
- [ ] 6.3 Botões: primary / secondary conforme Balha
- [ ] 6.4 Zero shadow/gradient

## Phase 7: Spec & Validation
- [ ] 7.1 Atualizar spec `candidate-portal` com requisitos de UI Balha v10
- [ ] 7.2 Validar: `npm run build` sem erros
- [ ] 7.3 Checklist de auditoria Balha v10 (Bloco 8 do design system):
  - [ ] Nenhum bg-white/branco puro como fundo
  - [ ] Nenhum shadow-*
  - [ ] Nenhum font-bold (700+)
  - [ ] Scroll vertical < 2 viewports em cada tela
  - [ ] Rethink Sans confirmado
  - [ ] Foreground #031525
  - [ ] Cards com role="listitem" semântico
