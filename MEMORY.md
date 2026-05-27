# MEMORY

## PROJETO

nome: INCIRecruta | status: DONE | repo: git

## STACK

lang: TypeScript | framework: Next.js 15.5.15 (App Router) | infra: Vercel | db: Supabase | llm:

## ARQUITETURA

padrao: App Router (Next.js 15) / Balha DS v10.0.0
agentes:
tools:

## DECISÕES

[2026-05-20] Conclusão da Auditoria Técnica: (1) Validadas e confirmadas em baixo nível todas as migrations pendentes no Supabase (040, 041, 042 e 043 estão ativas e 100% aplicadas). (2) Confirmado build de produção Next.js íntegro e sem erros de tipagem. (3) Atualizado status global do projeto para DONE.
[2026-05-14] Diagnóstico de Erro na Agenda: (1) Identificado que a tabela `interviews` não existe no banco de dados remoto, causando falha no `InterviewService`. (2) Refatorados logs de erro em `InterviewService.ts` para exibir `message` e `code` do Supabase. (3) Migração necessária: `20260514_agenda_and_rls_hardening.sql`.
[2026-05-14] Correção de Auditoria (crash React): (1) Refatorado `AuditService.formatDetails` para converter objetos JSON em strings amigáveis. (2) Atualizado hook `useAudit.ts` para sanitizar dados antes da renderização, corrigindo o erro "Objects are not valid as a React child".

[2026-05-13] Implementado suporte a múltiplos logins simultâneos no mesmo navegador: (1) Criada segregação de cookies por caminho via `getAuthStorageConfig` (`sb-admin-auth-token`, `sb-candidate-auth-token`, etc). (2) Singleton `supabase` no browser convertido em Proxy dinâmico para chavear clientes automaticamente conforme a rota. (3) Centralizada criação de clientes SSR em `getServerSupabase`. (4) `AuthContext` atualizado para detectar mudanças de área e re-sincronizar sessões dinamicamente.
[2026-05-13] Melhoria na experiência de ResetPassword: (1) Adicionada animação dinâmica de zoom/escala nas barras de força ao digitar. (2) Implementada validação de paridade de senhas com feedback visual de erro e bloqueio inteligente do botão de submissão (exige força >= Média e senhas iguais).
[2026-05-13] Refatoração visual do indicador de força da senha (ResetPassword): (1) Implementadas cores institucionais específicas (#FF2C2C, #FFDE21, #008000) e labels (Baixa, Média, Forte). (2) Adicionada animação de preenchimento e brilho (glow) nas barras de progresso. (3) Limpeza de labels redundantes.
[2026-05-13] Corrigidos erros de TypeScript no `JobService`: Adicionado tratamento robusto para relações do Supabase que podem retornar como array (Array.isArray) ou objeto único, garantindo acesso seguro a `company_slug` e `company_name`.
[2026-05-13] Otimização de Performance e Auth: (1) Criada migração `20260513_performance_optimization.sql` para adicionar índices em chaves estrangeiras críticas (candidates, jobs, audit_logs) e refatorar políticas RLS para evitar InitPlans (custo computacional reduzido). (2) Otimizada busca de vagas no `JobService.getPublicJobs()` — filtragem de status de empresa movida do JavaScript para o SQL (PostgREST), reduzindo latência e tráfego. (3) Refatorado `middleware.ts` para desabilitar redirecionamento automático de usuários logados em rotas de Auth, permitindo re-login explícito.
[2026-05-13] Skill Cursor `compact` em `.cursor/skills/compact/SKILL.md`: invocação /compact ou pedido de resposta densa; preserva código/paths/URLs; não sobrescreve arquivos (para .md com backup usar caveman-compress).
[2026-05-12] Fix Bug Salvar Cargo (roles): (1) get_my_role() reescrita para priorizar company_members.role sobre users.role — era causa raiz do bloqueio RLS silencioso. (2) Políticas RLS da tabela roles refeitas: SELECT/INSERT/UPDATE/DELETE separadas, cobrindo owner+admin+recruiter via company_members. (3) Corrigido type mismatch: requirements_technical e requirements_behavioral são JSONB no banco — frontend enviava string com .join('\n'), agora envia array direto. (4) Corrigido level: banco é text, frontend enviava integer. Fix aplicado em 4 arquivos: src/views/CreateRole.tsx, src/views/EditRole.tsx, src/app/(admin)/admin/roles/new/page.tsx, src/app/(admin)/admin/roles/[id]/edit/page.tsx. SQL de migração gerado em migrations/fix_roles_rls_get_my_role.sql — aplicar no Supabase Dashboard manualmente.
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
