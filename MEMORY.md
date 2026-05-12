# MEMORY

## PROJETO

nome: INCIRecruta | status: WIP | repo: git

## STACK

lang: TypeScript | framework: Next.js 15.5.15 (App Router) | infra: Vercel | db: Supabase | llm:

## ARQUITETURA

padrao: App Router (Next.js 15) / Balha DS v10.0.0
agentes:
tools:

## DECISÕES

[2026-05-11] Padronização de Vagas (Gestor/Área): (1) Renomeado 'Reporta a' para 'Gestor(a)' em toda a aplicação. (2) Sincronização estendida em EditRole (App Router e View) para propagar 'reports_to' e 'mission' para as vagas vinculadas. (3) Tratamento de fallback 'Geral' na UI para exibir 'Área não informada'. (4) Removido badge redundante de área no topo do JobDetailView.
[2026-05-11] UI Update: ProfileCompletenessModal (Candidate Dashboard): (1) Removido container de ícone do header. (2) Upgrade na tipografia (text-xl) e layout do cabeçalho. (3) Badges de campos pendentes agora são botões premium com ícones específicos (phone, summary, social, etc). (4) Melhorado espaçamento e scroll da lista de pendências.
[2026-05-11] Refactor Auth System (Session e46bdc0): (1) AuthContext fallback de role corrigido — usa metadata.role do Supabase Auth em vez de 'candidate' fixo, eliminando loop de redirect Admin→Candidato. (2) AdminLayout convertido para Server Component (async SSR com @supabase/ssr), igual ao CandidateLayout — ambos usam guard server-side. (3) AdminShell criado como client component separado com Sidebar/Header/QuickViewDrawer. (4) Middleware reescrito — cobre login, cadastro, navegação cruzada; redireciona /admin/login para /login?type=company. (5) CompanyRegister e CandidateRegister verificam data.session antes de redirecionar. (6) job.service.ts TS error corrigido no fallback de schema.
[2026-05-11] Correção de Login Empresa e Resiliência Supabase: Corrigida interceptação de redirecionamento no `AppCandidateLayout` que impedia acesso ao Dashboard Admin para perfis não-candidatos. Implementada resiliência no `JobService.getPublicJobs()` com fallback para colunas básicas, resolvendo o erro 400 causado por colunas ausentes no schema (`is_pcd`, `registration_deadline`).
[2026-05-07] Implementado Sistema de Analytics e Funil de Conversão: Criada tabela `analytics_events` e view `funnel_stats`. Implementado `AnalyticsService` e hook `useFunnelData`. Rastreamento adicionado em Landing, Busca, Clique em Vaga, Início/Fim de Cadastro e Candidatura. Novo componente de Funil adicionado ao Admin Dashboard.
[2026-05-07] Refatoração Sidebar Admin para Balha v10: Largura colapsada w-20, logo h-5/h-8, tipografia uppercase text-[11px] font-bold. Ícone de "Vagas" substituído pelo logo amarelo INCI (seta).
[2026-05-04] Implementado Algoritmo de Recomendação Determinístico (As 3 Primeiras Vagas): Criada RPC SQL `get_recommended_jobs_for_candidate` avaliando Skills, Localização, Senioridade, Disponibilidade e Modalidade. Implementados `RecommendationService`, `useRecommendedJobs` e o componente `RecommendedJobsBlock`. Integração feita no CandidateDashboard e JobsList.
[2026-04-30] Implementado Modal de Privacidade Institucional: Criada PrivacyTab (aba flutuante) e PrivacyPortalModal integrados no PublicLayout para acesso rápido às diretrizes de tratamento de dados.
[2026-04-30] Reorganização de formulários (Finalizada): Campos de "Classificação" e "Responsabilidades" removidos de CreateRole em src/views e admin/src/app. Classificação agora integrada exclusivamente em JobForm.
[2026-04-30] Corrigido erro de sintaxe JSX no JobForm.tsx: Fechamento de div da seção de Classificação restaurado.
[2026-04-30] Reorganização de formulários: Campos de "Classificação" (Senioridade e Experiência Mínima) movidos de Cargo para Vaga. Removido campo de "Responsabilidades" da criação de Cargo.
[2026-04-30] Corrigido erro JSX em PublicLayout: Substituída tag customizada ion-icon por <Icon icon="ion:exit-outline" /> para compatibilidade TypeScript e padronização.
[2026-04-30] Corrigida cor de fundo da Hero Section na JobsList: Alterado de var(--foreground) (#11233F) para #3857EF (Azul Vibrante).
[2026-04-30] Migração Candidate Portal para Balha DS v10.0.0: Siderbar 64px/256px, tokens bg-sidebar, rounded-lg (12px) padrão.
[2026-04-30] Implementado Breadcrumbs dinâmico no Header do CandidateLayout.
[2026-04-30] Refatoração de Dashboard, MyApplications e Settings para conformidade com v10 (Subtraction Radical).
[2026-04-29] Modularização de páginas e limpeza de arquitetura concluída (Fase 6 e 7).
[2026-04-29] Removido react-router-dom e centralizados formatadores.
[2026-04-29] Correção massiva de Design System v9.1.0 (raio cards 2xl, cores Navy tokens).
[2026-04-29] Resolvidas regressões de imports em Layouts, Sidebar e QuickViewDrawer após migração para aliases canônicos.
[2026-04-29] Fix Build Error: Corrigido alias @/_ no tsconfig.json e integrados layouts (Candidate/Public) nativamente no App Router (Next.js 15).
[2026-04-29] Fix Module Not Found: Corrigido import de BaseModal no TermsModal.tsx.
[2026-04-29] Proposta de refatoração do layout de Vagas: Filtros no topo, navegação em sidebar e detalhes no centro (Master-Detail).
[2026-04-29] docs/SYSTEM_MAP.md atualizado com mapeamento exaustivo de ~130 arquivos fonte (5 services, 9 hooks, 2 contexts, 6 libs, ~65 componentes, 27 rotas).
[2026-04-29] Corrigidas regressões em Settings.tsx (JSX/Imports) e removido <Outlet /> dos layouts.
[2026-04-29] Implementada segurança de tipo para searchParams e manipulação de Date em componentes críticos.
[2026-04-29] Estabilização final da camada Admin: Resolvidos todos os erros de "Module not found" nos modais administrativos.
[2026-04-29] Normalização de Imports: Substituídos caminhos relativos (`../`) por aliases canônicos (`@src/_`) em todos os componentes de `src/components/admin/`e`src/pages/`.
[2026-04-29] Restauração de Constantes: Recriado `src/constants/index.ts`com as definições de`COLUMNS_CONFIG`para o Pipeline do Kanban, resolvendo quebras críticas de build.
[2026-04-29] Proposta criada para portar implementação completa do Admin do diretório`admin/`para`src/app/(admin)`.
[2026-04-29] Porting do Admin concluído: 10 módulos, hooks e services migrados com sucesso para a estrutura principal com aliases `@src/\*`.
[2026-04-29] Estabilização Next.js 16: Resolvidos erros de Client/Server boundary em Sidebar e QuickViewDrawer.
[2026-04-29] Icon Standard: Padronizado uso de @iconify/react para evitar rendering de ícones como texto (Material Symbols).
[2026-04-29] Design System v9.5.0: Implementado contraste de profundidade no AdminLayout (bg-muted/20) e correção de tipografia Rethink Sans via layout root.

## BUGS CONHECIDOS

hero quebrado: DONE | Refatoração completa para layout Light Balha 9.1 concluída.
Regressões Admin: DONE | Todos os erros de importação e constantes ausentes foram corrigidos.
Auth Empresa (role candidate): DONE | CompanyRegister enviava role 'candidate' — corrigido para 'manager'. Trigger/constraints atualizados.
Auth Loop Admin↔Candidato: DONE | AuthContext fallback hardcoded 'candidate' causava loop — corrigido para usar metadata.role. AdminLayout virou Server Component.
DangerZone delete: DONE | Usava candidates.id (não existia para empresa) — corrigido para session.user.id via tabela users.
AdminLayout guard: DONE | Convertido para Server Component com SSR guard idêntico ao CandidateLayout.
Senha candidato divergente: PENDENTE MANUAL | israel.richard@incibrasil.com.br tem senha 'incicast1234' no banco — redefinir para 'incibrasil1234' no Supabase Dashboard.
