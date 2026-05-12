# SYSTEM MAP — INCIRecruta

> **Gerado em**: 2026-04-29
> **Versão**: Next.js 15 + Balha Design System 9.1.0
> **Método**: Análise estática exaustiva (sem alteração de código)
> **Último Commit**: N/A (repo local)

---

## 1. Core & Config

### 1.1 Build & Runtime

#### `tsconfig.json`
- **Tipo**: Config
- **Papel**: Definição de aliases `@src/*`, target ES2022, modo bundler, plugin Next.js.
- **Regras**: `strict: false`, `strictNullChecks: true`, `jsx: react-jsx`, `moduleResolution: bundler`.

#### `next.config.mjs`
- **Tipo**: Config
- **Papel**: Configurações mínimas do Next.js (vazio — defaults do Next 15).

#### `postcss.config.mjs` / `postcss.config.cjs`
- **Tipo**: Config
- **Papel**: Pipeline PostCSS com Tailwind v4.

#### `vercel.json`
- **Tipo**: Config
- **Papel**: Configuração de deploy na Vercel.

#### `.env` / `.env.example`
- **Tipo**: Config
- **Papel**: Variáveis de ambiente (Supabase URL, Anon Key).

#### `package.json`
- **Tipo**: Config
- **Papel**: Definição de dependências (Next 16.2.4, React 19, Supabase, @dnd-kit, Tailwind 4).
- **Scripts**: `dev`, `build`, `start`, `validate:design-system`.

#### `.gitignore`
- **Tipo**: Config
- **Papel**: Padrão Next.js — exclui `.next/`, `node_modules/`, `.env`, etc.

### 1.2 Type Definitions

#### `src/types/index.ts`
- **Tipo**: Type
- **Papel**: **Fonte única de verdade** para todas as interfaces do domínio.
- **API/Assinatura**: `Job`, `Candidate`, `CandidateFeedback`, `CandidateAvatar`, `CandidateResume`, `Role`, `User`, `SystemSettings`, `AuditLog`, `StageHistory`, `Education`, `Experience`, `KanbanColumnId`, `AuditLogCategory`.

### 1.3 Tokens Globais

#### `src/app/globals.css`
- **Tipo**: Token
- **Papel**: Definição de tokens CSS do Balha 9.1.0 (cores, fontes, utilitários Tailwind).
- **Regras**: Sem shadows, sem gradients, sem backdrop-blur. Cores somente via tokens CSS.

### 1.4 Utilitários de Build (Legacy)

#### `fix-duplicate-classnames.cjs`, `fix-icon-titles.cjs`, `fix-icons.cjs`, `fix-public-pages.cjs`, `fix-typography.cjs`
- **Tipo**: Script
- **Papel**: Scripts de correção em massa aplicados durante a migração do Design System.

---

## 2. Data Layer (Services)

Puro I/O. Sem estado React. Consumidos por Hooks ou Server Components.

#### `src/services/job.service.ts`
- **Tipo**: Service
- **Papel**: CRUD completo de vagas e transições de workflow com auditoria.
- **API**: `getJobs()`, `getJobById(id)`, `createJob(job)`, `updateJob(id, updates)`, `deleteJob(id)`, `syncJobsByRole(roleId, updates)`, `transitionStatus(jobId, nextStatus, user)`.
- **Estado/Ações**: Gerencia transições de workflow com validação de permissão (admin/quality para approve).
- **Regras**: Transições de workflow seguem matriz definida (`draft → pending_approval → approved → published → archived`). Log automático via `AuditService`.

#### `src/services/candidate.service.ts`
- **Tipo**: Service
- **Papel**: Gestão completa de candidatos — CRUD, movimentação Kanban, upload/download de avatar e currículo, busca avançada, histórico de etapas.
- **API**: `getCandidates()`, `getCandidatesByJob(jobId)`, `getJobForecast(jobId)`, `uploadAvatar(file, candidateId)`, `downloadAvatar(candidateId)`, `getAvatarUrl(candidateId)`, `uploadResume(file, candidateId)`, `downloadResume(candidateId)`, `hasResume(candidateId)`, `deleteResume(candidateId)`, `addCandidate(candidate, resumeFile?)`, `updateCandidate(id, updates)`, `recordStageEntry()`, `recordStageTransition()`, `getStageHistory()`, `getAverageStageDurations()`, `deleteCandidate(id)`, `addFeedback()`, `searchCandidates(filters)`, `saveDiversityData()`.
- **Estado/Ações**: Mapeamento DB snake_case → TS camelCase. Rastreia histórico de movimentação por etapa.
- **Regras**: Avatar max 2MB (image only). Resume max 5MB (PDF only). Invoca Edge Function `notify-talent-bank` para candidaturas espontâneas.

#### `src/services/user.service.ts`
- **Tipo**: Service
- **Papel**: Gestão de usuários do painel administrativo via Edge Functions.
- **API**: `getUsers()`, `getUserById(id)`, `updateUser(id, updates)`, `deleteUser(id)`, `addUser(user)`.
- **Regras**: Create/Update usam Edge Functions (`create-user-admin`, `update-user-admin`) com auth session token.

#### `src/services/role.service.ts`
- **Tipo**: Service
- **Papel**: CRUD do catálogo de cargos.
- **API**: `getRoles()`, `addRole(role)`, `updateRole(id, updates)`, `deleteRole(id)`.
- **Regras**: Atualiza `updated_at` automaticamente em create/update.

#### `src/services/audit.service.ts`
- **Tipo**: Service
- **Papel**: Registro de logs de auditoria para compliance.
- **API**: `log(entry)`, `logChange(entityType, entityId, action, oldState, newState, category?)`.
- **Estado/Ações**: Captura automaticamente user_id da sessão Supabase. Calcula diff entre oldState e newState.
- **Regras**: Entidades válidas: `role | job | candidate | user | privilege`.

---

## 3. Logic Layer (Hooks & Context)

### 3.1 Contexts

#### `src/context/AuthContext.tsx`
- **Tipo**: Context
- **Papel**: Gestão centralizada de sessão — login, logout, refresh de perfil, estado de autenticação.
- **API**: `AuthProvider`, `useAuth()` → `{ user, login, logout, refreshProfile, isAuthenticated, isEmailConfirmed, isLoading }`.
- **Estado/Ações**: Sessão Supabase com listener `onAuthStateChange`. Fallback para metadata se DB indisponível (timeout 4s).
- **Regras**: Força re-fetch se user.id muda. Cleanup de subscription no unmount.

#### `src/context/QuickViewContext.tsx`
- **Tipo**: Context
- **Papel**: Painel de visualização rápida (job/candidate/user/role) em drawer.
- **API**: `QuickViewProvider`, `useQuickView()` → `{ isOpen, viewType, data, openQuickView, closeQuickView }`.
- **Estado/Ações**: Abre/fecha drawer com delay de 300ms para animação.

### 3.2 Hooks — Domínio

#### `src/hooks/useJobs.ts`
- **Tipo**: Hook
- **Papel**: Consome `JobService` com estado de loading e operações CRUD reativas.
- **API**: `{ jobs, isLoading, addJob, updateJob, deleteJob, transitionJobStatus }`.
- **Regras**: Update otimista no `updateJob`. Refresh após cada mutação.

#### `src/hooks/useCandidates.ts`
- **Tipo**: Hook
- **Papel**: Orquestra candidatos com filtro por job, busca de avatares, movimentação Kanban.
- **API**: `{ candidates, isLoading, addCandidate, moveCandidate, updateCandidate, addFeedback, deleteCandidate, refresh, searchCandidates }`.
- **Regras**: Busca avatares do DB em paralelo para candidatos com `has_avatar=true`.

#### `src/hooks/useRoles.ts`
- **Tipo**: Hook
- **Papel**: Estado reativo do catálogo de cargos.
- **API**: `{ roles, isLoading, addRole, updateRole, deleteRole, refresh }`.

#### `src/hooks/useUsers.ts`
- **Tipo**: Hook
- **Papel**: Gestão de usuários admin com refresh do AuthContext quando usuário atual é modificado.
- **API**: `{ users, isLoading, addUser, updateUser, deleteUser, refresh }`.
- **Regras**: Se `updateUser` afeta o próprio usuário logado, dispara `refreshProfile()`.

#### `src/hooks/useAudit.ts`
- **Tipo**: Hook
- **Papel**: Carrega e gerencia logs de auditoria com filtro por entidade.
- **API**: `{ logs, isLoading, addLog, getLogsByEntity }`.

#### `src/hooks/useSettings.ts`
- **Tipo**: Hook
- **Papel**: Gerencia configurações do sistema (permissões de manager).
- **API**: `{ settings, isLoading, updateSettings, updateManagerPermission }`.
- **Regras**: Defaults hardcoded se DB vazio. Upsert em `system_settings` por key `manager_permissions`.

#### `src/hooks/useCandidateData.ts`
- **Tipo**: Hook
- **Papel**: Lógica complexa do portal candidato — perfil, aplicações, jobs ativos, cálculo de completude.
- **API**: `{ currentCandidate, jobs, myApplications, isLoading, refreshData, updateProfile, completeness }`.
- **Regras**: Filtra candidatos por `user_id` da sessão. Sincroniza com tabela `users`. Cálculo de completude baseado em 10 campos.

### 3.3 Hooks — Utilitários

#### `src/hooks/useAuth.ts`
- **Tipo**: Hook (re-export)
- **Papel**: Re-export de `useAuth` do `AuthContext` para conveniência de import.

#### `src/hooks/useDebounce.ts`
- **Tipo**: Hook
- **Papel**: Hook genérico de debounce para valores.
- **API**: `useDebounce<T>(value: T, delay: number): T`.

---

## 4. Lib Layer (Utilitários)

#### `src/lib/supabase.ts`
- **Tipo**: Lib
- **Papel**: Instância singleton do cliente Supabase.
- **Regras**: Usa vars de ambiente. Fallback com credenciais inválidas se ausentes (com warning).

#### `src/lib/utils.ts`
- **Tipo**: Lib
- **Papel**: Função `cn()` para merge de classes Tailwind com `clsx` + `tailwind-merge`.

#### `src/lib/formatters.ts`
- **Tipo**: Lib
- **Papel**: Formatadores centralizados.
- **API**: `formatCurrency()`, `formatSalaryRange()`, `formatDate()`, `formatPhone()`.
- **Regras**: Moeda em BRL, datas em pt-BR, telefone no formato `(XX) XXXXX-XXXX`.

#### `src/lib/storage.ts`
- **Tipo**: Lib (DEPRECATED)
- **Papel**: Abstração de localStorage (legado). Logs warning em cada chamada.
- **API**: `get()`, `set()`, `exportData()`, `importData()`, `initialize()`.
- **Regras**: **DEPRECATED** — migrar para Supabase Services.

#### `src/lib/router-compat.tsx`
- **Tipo**: Lib
- **Papel**: Camada de compatibilidade entre react-router-dom API e next/navigation.
- **API**: `useNavigate()`, `useLocation()`, `useParams<T>()`, `Link`, `Navigate`, `Outlet`.
- **Regras**: Permite migração gradual — pages trocam import de `react-router-dom` por `@src/lib/router-compat`. `Outlet` emite warning (App Router usa `{children}`).

#### `src/lib/job-helpers.ts`
- **Tipo**: Lib
- **Papel**: Helpers específicos para vagas — mapeamento de ícones de benefícios e transformação de job para detail view.
- **API**: `BENEFIT_ICON_MAP`, `getBenefitIcon(benefitText)`, `mapJobToDetail(found)`.

---

## 5. Constants

#### `src/constants/index.ts`
- **Tipo**: Constant
- **Papel**: Barrel principal — exporta `COLUMNS_CONFIG` e re-exporta departments/roles.
- **API**: `COLUMNS_CONFIG: { id, title, dotColor }[]` — 8 colunas do Kanban.

#### `src/constants/departments.ts`
- **Tipo**: Constant
- **Papel**: Áreas predefinidas para cargos.
- **API**: `DEPARTMENT_AREAS: ['Tecnologia', 'Marketing', 'Design', 'Recursos Humanos', 'Financeiro']`, `DepartmentArea` type.

#### `src/constants/roles.ts`
- **Tipo**: Constant
- **Papel**: Definições de RBAC (Role-Based Access Control).
- **API**: `ADMIN_ROLES`, `ALL_ROLES`, `isAdminRole()`, `isCandidateRole()`, `AdminRole` type, `UserRole` type.

---

## 6. Layouts

#### `src/layouts/PublicLayout.tsx`
- **Tipo**: Layout
- **Papel**: Layout para rotas públicas — header com navegação, footer com links de governança.
- **Estado/Ações**: Controla menu mobile, modal de termos/privacidade, detecção de full-page routes.
- **Regras**: Força light mode. Full-page routes (`/login`, `/cadastro`, `/recuperar-senha`, `/verificar-email`) não renderizam header/footer.

#### `src/layouts/CandidateLayout.tsx`
- **Tipo**: Layout
- **Papel**: Layout para portal candidato — sidebar desktop + bottom nav mobile.
- **Estado/Ações**: Navegação entre aplicações, perfil e ajustes. Logout com prevenção de double-click.
- **Regras**: Força light mode. Bottom nav com safe-area padding para iOS.

---

## 7. UI Layer (Components)

### 7.1 Atoms (`src/components/atoms/`)

#### `src/components/atoms/index.ts`
- **Tipo**: Barrel
- **Papel**: Re-exporta todos os átomos.
- **API**: `Button`, `Input`, `Text`, `Skeleton`, `Icon`, `Avatar`.

#### `src/components/atoms/Button/Button.tsx`
- **Tipo**: Componente (Atom)
- **Papel**: Botão base com variantes do Balha DS.

#### `src/components/atoms/Input/Input.tsx`
- **Tipo**: Componente (Atom)
- **Papel**: Campo de input base com label e estado de erro.

#### `src/components/atoms/Text/Text.tsx`
- **Tipo**: Componente (Atom)
- **Papel**: Tipografia base com hierarquia.

#### `src/components/atoms/Skeleton/Skeleton.tsx`
- **Tipo**: Componente (Atom)
- **Papel**: Placeholder animado de carregamento.

#### `src/components/atoms/Icon/Icon.tsx`
- **Tipo**: Componente (Atom)
- **Papel**: Wrapper para `@iconify/react` (Material Symbols).

#### `src/components/atoms/Avatar/Avatar.tsx`
- **Tipo**: Componente (Atom)
- **Papel**: Avatar com fallback para iniciais.

### 7.2 Molecules (`src/components/molecules/`)

#### `src/components/molecules/index.ts`
- **Tipo**: Barrel
- **Papel**: Re-exporta moléculas.
- **API**: `FormField`, `NavLink`, `SearchBar`.

#### `src/components/molecules/FormField/`
- **Tipo**: Componente (Molecule)
- **Papel**: Combinação de label + input + mensagem de erro.

#### `src/components/molecules/NavLink/`
- **Tipo**: Componente (Molecule)
- **Papel**: Link de navegação com estado ativo.

#### `src/components/molecules/SearchBar/`
- **Tipo**: Componente (Molecule)
- **Papel**: Barra de busca com debounce.

### 7.3 Organisms (`src/components/organisms/`)

#### `src/components/organisms/index.ts`
- **Tipo**: Barrel
- **API**: `Header`.

#### `src/components/organisms/Header/Header.tsx`
- **Tipo**: Componente (Organism)
- **Papel**: Header principal com logo, navegação e ações de usuário.

### 7.4 Templates (`src/components/templates/`)

#### `src/components/templates/index.ts`
- **Tipo**: Barrel
- **API**: `MainLayout`.

#### `src/components/templates/MainLayout/MainLayout.tsx`
- **Tipo**: Componente (Template)
- **Papel**: Layout completo do painel admin — sidebar, header, área de conteúdo.

### 7.5 Shared (`src/components/shared/`)

#### `src/components/shared/Sidebar.tsx`
- **Tipo**: Componente
- **Papel**: Sidebar de navegação do admin com links para dashboard, jobs, roles, audit, settings, talent-bank.

#### `src/components/shared/Breadcrumbs.tsx`
- **Tipo**: Componente
- **Papel**: Navegação breadcrumb para hierarquia de páginas.

#### `src/components/shared/BaseModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal genérico com header, corpo e ações.

#### `src/components/shared/ConfirmationModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal de confirmação para ações destrutivas.

#### `src/components/shared/Toast.tsx`
- **Tipo**: Componente
- **Papel**: Sistema de notificações toast.

#### `src/components/shared/AdminLayoutSkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton de carregamento para layout admin.

#### `src/components/shared/CandidateLayoutSkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton de carregamento para layout candidato.

#### `src/components/shared/BenefitsSelector.tsx`
- **Tipo**: Componente
- **Papel**: Seletor de benefícios para formulário de vaga.

#### `src/components/shared/SkillsSelector.tsx`
- **Tipo**: Componente
- **Papel**: Seletor de habilidades para candidato/vaga.

#### `src/components/shared/RequirementsSelector.tsx`
- **Tipo**: Componente
- **Papel**: Seletor de requisitos para vaga.

#### `src/components/shared/LanguagesSelector.tsx`
- **Tipo**: Componente
- **Papel**: Seletor de idiomas para perfil do candidato.

#### `src/components/shared/DynamicListInput.tsx`
- **Tipo**: Componente
- **Papel**: Input de lista dinâmica genérico (add/remove items).

#### `src/components/shared/EducationListEditor.tsx`
- **Tipo**: Componente
- **Papel**: Editor de formação acadêmica do candidato.

#### `src/components/shared/ExperienceListEditor.tsx`
- **Tipo**: Componente
- **Papel**: Editor de experiência profissional do candidato.

### 7.6 Admin (`src/components/admin/`)

#### `src/components/admin/CandidateCard.tsx`
- **Tipo**: Componente
- **Papel**: Card de candidato para listagens e Kanban.

#### `src/components/admin/CandidateCardSkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton para CandidateCard.

#### `src/components/admin/CandidateProfileDrawer.tsx`
- **Tipo**: Componente
- **Papel**: Drawer com perfil completo do candidato (tabs: perfil, entrevistas, audit).

#### `src/components/admin/candidate-profile/CandidateProfileHeader.tsx`
- **Tipo**: Componente
- **Papel**: Header do perfil do candidato com foto e info básica.

#### `src/components/admin/candidate-profile/CandidateJobInfo.tsx`
- **Tipo**: Componente
- **Papel**: Info da vaga vinculada ao candidato.

#### `src/components/admin/candidate-profile/CandidateProfileTimeline.tsx`
- **Tipo**: Componente
- **Papel**: Timeline de atividades do candidato.

#### `src/components/admin/candidate-profile/CandidateTabProfile.tsx`
- **Tipo**: Componente
- **Papel**: Tab de dados pessoais do candidato.

#### `src/components/admin/candidate-profile/CandidateTabInterviews.tsx`
- **Tipo**: Componente
- **Papel**: Tab de entrevistas agendadas.

#### `src/components/admin/candidate-profile/CandidateTabAudit.tsx`
- **Tipo**: Componente
- **Papel**: Tab de logs de auditoria do candidato.

#### `src/components/admin/DroppableKanbanColumn.tsx`
- **Tipo**: Componente
- **Papel**: Coluna de Kanban com drop zone (@dnd-kit).

#### `src/components/admin/SortableCandidateCard.tsx`
- **Tipo**: Componente
- **Papel**: Card de candidato draggable no Kanban.

#### `src/components/admin/KanbanColumn.tsx`
- **Tipo**: Componente
- **Papel**: Coluna base do Kanban.

#### `src/components/admin/JobForm.tsx`
- **Tipo**: Componente
- **Papel**: Formulário completo de criação/edição de vaga.

#### `src/components/admin/UserModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal para criar/editar usuários admin.

#### `src/components/admin/AdvancedSearchFilters.tsx`
- **Tipo**: Componente
- **Papel**: Filtros avançados para busca de candidatos.

#### `src/components/admin/InterviewFeedbackModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal para registrar feedback de entrevista.

#### `src/components/admin/LogDetailsModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal com detalhes de um log de auditoria.

#### `src/components/admin/MoveStageModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal para mover candidato entre etapas do pipeline.

#### `src/components/admin/ScheduleInterviewModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal para agendar entrevista.

#### `src/components/admin/SLAConfig.tsx`
- **Tipo**: Componente
- **Papel**: Configuração de SLA por etapa do pipeline.

#### `src/components/admin/QuickViewDrawer.tsx`
- **Tipo**: Componente
- **Papel**: Drawer de visualização rápida (integrado com QuickViewContext).

### 7.7 Public (`src/components/public/`)

#### `src/components/public/HeroSection.tsx`
- **Tipo**: Componente
- **Papel**: Hero section da página de vagas — layout Light Balha 9.1.

#### `src/components/public/JobCardPublic.tsx`
- **Tipo**: Componente
- **Papel**: Card de vaga para listagem pública.

#### `src/components/public/JobCardCompact.tsx`
- **Tipo**: Componente
- **Papel**: Card de vaga em formato compacto.

#### `src/components/public/JobDetailView.tsx`
- **Tipo**: Componente
- **Papel**: Visualização detalhada de vaga (missão, responsabilidades, requisitos, benefícios).

#### `src/components/public/JobFilterConsole.tsx`
- **Tipo**: Componente
- **Papel**: Console de filtros para busca de vagas.

#### `src/components/public/JobFilterSidebar.tsx`
- **Tipo**: Componente
- **Papel**: Sidebar de filtros para listagem de vagas.

#### `src/components/public/TermsModal.tsx`
- **Tipo**: Componente
- **Papel**: Modal de Termos de Uso e Política de Privacidade.

#### `src/components/public/JobCardSkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton para JobCardPublic.

#### `src/components/public/ApplicationCardSkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton para card de aplicação do candidato.

#### `src/components/public/JobSummarySkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton para resumo de vaga.

#### `src/components/public/ProfileSkeleton.tsx`
- **Tipo**: Componente
- **Papel**: Skeleton para perfil do candidato.

#### `src/components/public/Pt24.tsx`
- **Tipo**: Componente
- **Papel**: Componente de tipografia (pt-24).

### 7.8 UI Elements (`src/components/ui/`)

#### `src/components/ui/Toast.tsx`
- **Tipo**: Componente
- **Papel**: Toast notifications — `ToastProvider` + `useToast()`.

#### `src/components/ui/SplashScreen.tsx`
- **Tipo**: Componente
- **Papel**: Tela de carregamento inicial com logo.

### 7.9 Barrel

#### `src/components/index.ts`
- **Tipo**: Barrel
- **Papel**: Re-exporta componentes por domínio (shared, ui, atoms, molecules, organisms, templates).

---

## 8. Route Layer (App Router)

### 8.1 Root

#### `src/app/layout.tsx`
- **Tipo**: Rota (Root Layout)
- **Papel**: Root layout HTML — `html lang="pt-BR"`, body com `font-sans antialiased`, wrap em `<Providers>`.
- **Metadata**: Title "INCI Recruta — Sistema de Recrutamento", descrição ATS.

#### `src/app/providers.tsx`
- **Tipo**: Componente (Client)
- **Papel**: Wrapper client-side — `AuthProvider` → `ToastProvider` → `QuickViewProvider` → `Suspense`.
- **Regras**: Permite que root layout (Server Component) use context providers.

#### `src/app/page.tsx`
- **Tipo**: Rota (Home)
- **Papel**: Redirect baseado em role — candidato → `/candidate/dashboard`, admin → `/admin/dashboard`, não autenticado → `/vagas`.
- **Regras**: Exibe `SplashScreen` durante loading.

#### `src/app/not-found.tsx`
- **Tipo**: Rota (404)
- **Papel**: Página 404 global — delega para `@src/pages/public/NotFound`.

### 8.2 Route Group: `(public)`

#### `src/app/(public)/layout.tsx`
- **Tipo**: Layout
- **Papel**: Layout para rotas públicas — wrap em `PublicLayout`.

#### `src/app/(public)/vagas/page.tsx`
- **Rota**: `/vagas`
- **Tipo**: Rota
- **Papel**: Lista pública de vagas — delega para `JobsList`.

#### `src/app/(public)/vagas/[id]/page.tsx`
- **Rota**: `/vagas/[id]`
- **Tipo**: Rota
- **Papel**: Detalhes públicos de vaga — delega para `JobDetailPublic`.

#### `src/app/(public)/vagas/[id]/candidatar/page.tsx`
- **Rota**: `/vagas/[id]/candidatar`
- **Tipo**: Rota
- **Papel**: Formulário de candidatura — delega para `JobApplication`.

#### `src/app/(public)/login/page.tsx`
- **Rota**: `/login`
- **Tipo**: Rota
- **Papel**: Login de candidato — delega para `CandidateLogin`.

#### `src/app/(public)/cadastro/page.tsx`
- **Rota**: `/cadastro`
- **Tipo**: Rota
- **Papel**: Registro de candidato — delega para `CandidateRegister`.

#### `src/app/(public)/talentos/page.tsx`
- **Rota**: `/talentos`
- **Tipo**: Rota
- **Papel**: Landing page do banco de talentos — delega para `TalentLanding`.

#### `src/app/(public)/termos/page.tsx`
- **Rota**: `/termos`
- **Tipo**: Rota
- **Papel**: Termos de uso — delega para `TermsOfUse`.

#### `src/app/(public)/privacidade/page.tsx`
- **Rota**: `/privacidade`
- **Tipo**: Rota
- **Papel**: Política de privacidade — delega para `PrivacyPolicy`.

#### `src/app/(public)/verificar-email/page.tsx`
- **Rota**: `/verificar-email`
- **Tipo**: Rota
- **Papel**: Verificação de email — delega para `VerifyEmail`.

#### `src/app/(public)/recuperar-senha/page.tsx`
- **Rota**: `/recuperar-senha`
- **Tipo**: Rota
- **Papel**: Recuperação de senha do candidato — delega para `CandidateForgotPassword`.

### 8.3 Route Group: `(admin)`

#### `src/app/(admin)/layout.tsx`
- **Tipo**: Layout (TODO)
- **Papel**: Layout para rotas admin — atualmente placeholder (`{children}`).
- **Regras**: TODO — migrar AdminLayout + Sidebar + QuickViewDrawer.

#### `src/app/(admin)/admin/dashboard/page.tsx`
- **Rota**: `/admin/dashboard`
- **Tipo**: Rota
- **Papel**: Dashboard admin — métricas e visão geral.

#### `src/app/(admin)/jobs/page.tsx`
- **Rota**: `/admin/jobs`
- **Tipo**: Rota
- **Papel**: Listagem de vagas admin — delega para `Jobs`.

#### `src/app/(admin)/jobs/new/page.tsx`
- **Rota**: `/admin/jobs/new`
- **Tipo**: Rota
- **Papel**: Criação de vaga — delega para `CreateJob`.

#### `src/app/(admin)/jobs/[id]/page.tsx`
- **Rota**: `/admin/jobs/[id]`
- **Tipo**: Rota
- **Papel**: Detalhes da vaga admin — delega para `JobDetail`.

#### `src/app/(admin)/jobs/[id]/edit/page.tsx`
- **Rota**: `/admin/jobs/[id]/edit`
- **Tipo**: Rota
- **Papel**: Edição de vaga — delega para `EditJob`.

#### `src/app/(admin)/jobs/[id]/kanban/page.tsx`
- **Rota**: `/admin/jobs/[id]/kanban`
- **Tipo**: Rota
- **Papel**: Kanban de candidatos por vaga — delega para `Kanban`.

#### `src/app/(admin)/roles/page.tsx`
- **Rota**: `/admin/roles`
- **Tipo**: Rota
- **Papel**: Catálogo de cargos — delega para `Roles`.

#### `src/app/(admin)/roles/new/page.tsx`
- **Rota**: `/admin/roles/new`
- **Tipo**: Rota
- **Papel**: Criação de cargo — delega para `CreateRole`.

#### `src/app/(admin)/roles/[id]/edit/page.tsx`
- **Rota**: `/admin/roles/[id]/edit`
- **Tipo**: Rota
- **Papel**: Edição de cargo — delega para `EditRole`.

#### `src/app/(admin)/settings/page.tsx`
- **Rota**: `/admin/settings`
- **Tipo**: Rota
- **Papel**: Configurações do sistema (tabs: audit, privileges, system, users) — delega para `Settings`.

#### `src/app/(admin)/settings/users/[id]/edit/page.tsx`
- **Rota**: `/admin/settings/users/[id]/edit`
- **Tipo**: Rota
- **Papel**: Edição de usuário — delega para `EditUser`.

#### `src/app/(admin)/audit/page.tsx`
- **Rota**: `/admin/audit`
- **Tipo**: Rota
- **Papel**: Logs de auditoria.

#### `src/app/(admin)/talent-bank/page.tsx`
- **Rota**: `/admin/talent-bank`
- **Tipo**: Rota
- **Papel**: Banco de talentos admin — delega para `TalentBank`.

### 8.4 Route Group: `(candidate)`

#### `src/app/(candidate)/layout.tsx`
- **Tipo**: Layout
- **Papel**: Layout para rotas candidato — wrap em `CandidateLayout`.

#### `src/app/(candidate)/candidate/dashboard/page.tsx`
- **Rota**: `/candidate/dashboard`
- **Tipo**: Rota
- **Papel**: Dashboard/perfil do candidato.

#### `src/app/(candidate)/candidate/applications/page.tsx`
- **Rota**: `/candidate/applications`
- **Tipo**: Rota
- **Papel**: Listagem de candidaturas do candidato.

#### `src/app/(candidate)/candidate/applications/[id]/page.tsx`
- **Rota**: `/candidate/applications/[id]`
- **Tipo**: Rota
- **Papel**: Detalhes de uma candidatura.

#### `src/app/(candidate)/candidate/settings/page.tsx`
- **Rota**: `/candidate/settings`
- **Tipo**: Rota
- **Papel**: Ajustes do candidato (perfil, segurança).

### 8.5 Rotas Avulsas (fora de groups)

#### `src/app/2fa/page.tsx`
- **Rota**: `/2fa`
- **Tipo**: Rota
- **Papel**: Autenticação em dois fatores — delega para `TwoFactorAuth`.

#### `src/app/request-access/page.tsx`
- **Rota**: `/request-access`
- **Tipo**: Rota
- **Papel**: Solicitação de acesso admin — delega para `RequestAccess`.

#### `src/app/forgot-password/page.tsx`
- **Rota**: `/forgot-password`
- **Tipo**: Rota
- **Papel**: Recuperação de senha admin — delega para `ForgotPassword`.

#### `src/app/reset-password/page.tsx`
- **Rota**: `/reset-password`
- **Tipo**: Rota
- **Papel**: Redefinição de senha — delega para `ResetPassword`.

#### `src/app/debug/page.tsx`
- **Rota**: `/debug`
- **Tipo**: Rota
- **Papel**: Página de debug de autenticação — delega para `DebugAuth`.

#### `src/app/admin/login/page.tsx`
- **Rota**: `/admin/login`
- **Tipo**: Rota
- **Papel**: Login admin.

#### `src/app/perfil/completar/page.tsx`
- **Rota**: `/perfil/completar`
- **Tipo**: Rota
- **Papel**: Completar perfil do candidato.

### 8.6 Middleware

#### `src/middleware.ts`
- **Tipo**: Middleware (Scaffold)
- **Papel**: Guards server-side para rotas `/admin/*` e `/candidate/*`.
- **Regras**: **SCAFFOLD** — verificação de sessão ainda comentada. Ativar quando App Router substituir SPA.

---

## 9. Pages (Componentes de Página)

> Arquivos em `src/pages/` são componentes React delegados pelas rotas do App Router.

### 9.1 Admin Pages

| Arquivo | Delegado por | Responsabilidade |
|---------|-------------|-----------------|
| `src/pages/Dashboard.tsx` | `/admin/dashboard` | Painel de métricas admin |
| `src/pages/Jobs.tsx` | `/admin/jobs` | Listagem CRUD de vagas |
| `src/pages/CreateJob.tsx` | `/admin/jobs/new` | Formulário de criação de vaga |
| `src/pages/EditJob.tsx` | `/admin/jobs/[id]/edit` | Formulário de edição de vaga |
| `src/pages/JobDetail.tsx` | `/admin/jobs/[id]` | Detalhes da vaga (tabs: spec, history) |
| `src/pages/Kanban.tsx` | `/admin/jobs/[id]/kanban` | Pipeline Kanban de candidatos |
| `src/pages/Roles.tsx` | `/admin/roles` | Catálogo de cargos |
| `src/pages/CreateRole.tsx` | `/admin/roles/new` | Criação de cargo |
| `src/pages/EditRole.tsx` | `/admin/roles/[id]/edit` | Edição de cargo |
| `src/pages/Settings.tsx` | `/admin/settings` | Configurações (4 tabs) |
| `src/pages/EditUser.tsx` | `/admin/settings/users/[id]/edit` | Edição de usuário |
| `src/pages/TalentBank.tsx` | `/admin/talent-bank` | Busca avançada de candidatos |
| `src/pages/Login.tsx` | `/admin/login` | Login de admin |
| `src/pages/TwoFactorAuth.tsx` | `/2fa` | Verificação 2FA |
| `src/pages/ForgotPassword.tsx` | `/forgot-password` | Recuperação de senha admin |
| `src/pages/ResetPassword.tsx` | `/reset-password` | Redefinição de senha |
| `src/pages/RequestAccess.tsx` | `/request-access` | Solicitação de acesso |
| `src/pages/DebugAuth.tsx` | `/debug` | Debug de autenticação |

### 9.2 Candidate Pages

| Arquivo | Delegado por | Responsabilidade |
|---------|-------------|-----------------|
| `src/pages/public/CandidateLogin.tsx` | `/login` | Login de candidato |
| `src/pages/public/CandidateRegister.tsx` | `/cadastro` | Registro de candidato |
| `src/pages/public/CandidateForgotPassword.tsx` | `/recuperar-senha` | Recuperação de senha |
| `src/pages/public/VerifyEmail.tsx` | `/verificar-email` | Verificação de email |
| `src/pages/public/TalentLanding.tsx` | `/talentos` | Landing banco de talentos |
| `src/pages/public/TermsOfUse.tsx` | `/termos` | Termos de uso |
| `src/pages/public/PrivacyPolicy.tsx` | `/privacidade` | Política de privacidade |
| `src/pages/public/NotFound.tsx` | `not-found` | Página 404 |
| `src/pages/public/JobsList.tsx` | `/vagas` | Lista pública de vagas |
| `src/pages/public/JobDetailPublic.tsx` | `/vagas/[id]` | Detalhes públicos de vaga |
| `src/pages/public/JobApplication.tsx` | `/vagas/[id]/candidatar` | Formulário de candidatura |

### 9.3 Page Sub-Components

#### `src/pages/_components/settings/`
- `SettingsScopeTab.tsx` — Tab de escopo de visão (por departamento)
- `SettingsAuditTab.tsx` — Tab de configurações de audit
- `SettingsPrivilegesTab.tsx` — Tab de privilégios por role
- `SettingsSystemTab.tsx` — Tab de configurações do sistema
- `SettingsUsersTab.tsx` — Tab de gestão de usuários
- `index.ts` — Barrel
- `types.ts` — Tipos específicos de Settings

#### `src/pages/_components/job-detail/`
- `JobDetailHeader.tsx` — Header com título e ações
- `JobDetailSidebar.tsx` — Sidebar com info resumida
- `JobDetailSpec.tsx` — Tab de especificação da vaga
- `JobDetailHistory.tsx` — Tab de histórico de mudanças
- `index.ts` — Barrel

#### `src/pages/candidate/_components/settings/`
- `CandidateProfileSection.tsx` — Seção de perfil do candidato
- `CandidateSecuritySection.tsx` — Seção de segurança (senha, 2FA)
- `index.ts` — Barrel

---

## 10. Edge Functions (Supabase)

#### `supabase/functions/notify-talent-bank/index.ts`
- **Tipo**: Edge Function
- **Papel**: Notifica equipe de RH quando candidato espontâneo se registra no banco de talentos.

---

## 11. Scripts

#### `scripts/create_admin.ts`
- **Tipo**: Script
- **Papel**: Cria usuário admin inicial no Supabase.

#### `scripts/README.md`
- **Tipo**: Doc
- **Papel**: Documentação dos scripts utilitários.

---

## 12. Documentação do Projeto

| Arquivo | Tipo | Papel |
|---------|------|-------|
| `ARCHITECTURE.md` | Doc | Arquitetura canônica, regras de camadas, aliases, design system, status da migração |
| `AGENTS.md` | Doc | Instruções para agentes AI — Agentic AI Engineering |
| `Balha Design System.md` | Doc | Especificação completa do Design System |
| `DOCUMENTATION.md` | Doc | Documentação geral do projeto |
| `PORTAL_CANDIDATO.md` | Doc | Especificação do portal candidato |
| `README.md` | Doc | README do projeto |
| `MEMORY.md` | Doc | Memória de decisões e progresso do projeto |
| `openspec/project.md` | Doc | Convenções do OpenSpec |
| `openspec/design-system/ux-ui-guidelines.md` | Doc | Guidelines de UX/UI |
| `docs/SYSTEM_MAP.md` | Doc | Este arquivo — mapeamento do sistema |
| `docs/PROPOSALS_WORKFLOW.md` | Doc | Workflow de propostas |
| `docs/IMPLEMENTATION_PLAN_V2.md` | Doc | Plano de implementação |
| `docs/archive/*` | Doc | Arquivo de docs de sprints anteriores |

---

## 13. Mapa de Relacionamentos (Dependências)

```
App Router (src/app/*)
  └── src/pages/* (componentes de página)
        └── src/components/* (UI)
              ├── src/hooks/* (estado)
              │     └── src/services/* (I/O)
              │           └── src/lib/supabase.ts
              └── src/context/* (auth, quick view)
                    └── src/lib/supabase.ts

src/middleware.ts → rotas /admin/* e /candidate/*

Edge Functions:
  notify-talent-bank → triggered por CandidateService.addCandidate()
  create-user-admin → usado por UserService.addUser()
  update-user-admin → usado por UserService.updateUser()
```

---

## 14. Status de Sincronização

| Métrica | Valor |
|---------|-------|
| **Gerado em** | 2026-04-29 |
| **Total de arquivos mapeados** | ~130 arquivos fonte |
| **Services** | 5 |
| **Hooks** | 9 |
| **Contexts** | 2 |
| **Libs** | 6 |
| **Componentes** | ~65 |
| **Rotas App Router** | 27 page.tsx + 4 layouts + 1 root |
| **Design System** | Balha 9.1.0 |
| **Framework** | Next.js 16.2.4 + React 19 |
| **DB** | Supabase (PostgreSQL) |
