# INCIRECRUTA - Sistema de Gestão de Recrutamento (ATS)

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Guia de Uso](#guia-de-uso)
3. [API](#api)
4. [Arquitetura](#arquitetura)
5. [Referência de Código](#referência-de-código)

---

## 🔍 Visão Geral

### Descrição do Projeto

O **INCIRECRUTA** é uma plataforma completa de **Applicant Tracking System (ATS)** desenvolvida para otimizar o fluxo de contratação de empresas. O sistema permite que gestores de RH e líderes de equipe gerenciem vagas, acompanhem candidatos através de um pipeline visual (Kanban), e mantenham registros de auditoria detalhados.

#### Objetivo Principal
Fornecer uma solução moderna e eficiente para gestão de processos seletivos, desde a publicação de vagas até a contratação final, com controle granular de permissões e auditoria completa.

#### Problema que Resolve
- **Desorganização** no processo de recrutamento
- **Falta de visibilidade** sobre o status dos candidatos
- **Ausência de métricas** para tomada de decisão
- **Controle inadequado** de permissões e acessos
- **Dificuldade** em rastrear histórico de ações

### Instalação

#### Pré-requisitos
```bash
Node.js >= 20.0.0
npm ou yarn
Conta no Supabase
```

#### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd Sistema-de-Recrutamento
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=seu_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Configure o banco de dados Supabase**
- Execute o script SQL em `docs/db_init.sql`
- Execute as migrations em ordem:
  - `migrations/001_add_salary_to_roles.sql`
  - `migrations/002_add_role_id_to_jobs.sql`
  - `migrations/COMPLETE_SETUP.sql`
- Configure as políticas RLS (Row Level Security)

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

---

## 📖 Guia de Uso

### Uso Básico

#### Login e Autenticação
```typescript
// O sistema utiliza Supabase Auth
// Credenciais padrão de desenvolvimento:
Email: admin@admin.com
Senha: admin
```

#### Criando uma Nova Vaga
1. Acesse **Jobs** no menu lateral
2. Clique em **Nova Vaga**
3. Preencha o formulário wizard:
   - Informações básicas (título, departamento, localização)
   - Detalhes da vaga (missão, responsabilidades, requisitos)
   - Configurações (urgência, status, salário)
4. Clique em **Criar Vaga**

#### Gerenciando Candidatos no Kanban
1. Acesse **Kanban** no menu lateral
2. Selecione a vaga desejada
3. Arraste e solte candidatos entre as colunas:
   - Recebido
   - Em Triagem
   - Avaliação Técnica
   - Entrevista RH
   - Entrevista Gestor
   - Finalista
   - Contratado
   - Não Selecionado

### Casos Avançados

#### Controle de Permissões (RBAC)
```typescript
// Funções disponíveis:
- admin: Acesso total ao sistema
- manager: Gestão de departamentos e equipes
- recruiter: Operações de recrutamento
- quality: Auditoria e garantia de qualidade
- dp: Departamento pessoal
- candidate: Portal do candidato (sem acesso admin)
```

#### Configuração de Escopo de Gestor
```typescript
// Em Settings > Escopo do Gestor
{
  vacancy_view_type: 'direct' | 'department',
  allowed_departments: ['TI', 'Marketing'],
  allowed_role_codes: ['DEV-001', 'MKT-002']
}
```

#### Auditoria de Ações
```typescript
// Todas as ações são registradas automaticamente
// Acesse: Audit > Filtros por:
- Categoria (privileges, scope, user_management, etc.)
- Período
- Usuário
- Tipo de entidade
```

### Exemplos Práticos

#### Exemplo 1: Fluxo Completo de Contratação
```typescript
// 1. Criar cargo padronizado
const role = {
  code: 'DEV-001',
  title: 'Desenvolvedor Full Stack',
  department: 'TI',
  seniority: 'Pleno',
  salary_min: 5000,
  salary_max: 8000
};

// 2. Criar vaga baseada no cargo
const job = {
  role_id: role.id,
  urgency: 'Alta',
  status: 'Ativa',
  registration_deadline: '2026-02-28'
};

// 3. Candidato se candidata via portal público
// 4. RH move candidato pelo Kanban
// 5. Registra feedbacks em cada etapa
// 6. Finaliza com contratação ou rejeição
```

#### Exemplo 2: Configuração de Permissões Customizadas
```typescript
// Em Settings > Privilégios
const customPermissions = {
  close_job: true,
  approve_finalist: true,
  register_feedback: true,
  view_salaries: false,
  return_candidate_stage: true
};

// Aplicar ao usuário específico
await UserService.updateUser(userId, {
  custom_permissions: customPermissions
});
```

---

## 🔌 API

### Visão Geral da API

O sistema utiliza **Supabase** como backend, com três camadas principais:
1. **Supabase Client** - Comunicação direta com o banco de dados
2. **Services** - Camada de abstração para operações de dados
3. **Hooks** - Integração com React para gerenciamento de estado

### Classes / Objetos Principais

| Classe/Interface | Descrição | Métodos Públicos |
|-----------------|-----------|------------------|
| `CandidateService` | Gerenciamento de candidatos | `getCandidates()`, `addCandidate()`, `updateCandidate()`, `deleteCandidate()`, `addFeedback()` |
| `JobService` | Gerenciamento de vagas | `getJobs()`, `getJobById()`, `createJob()`, `updateJob()`, `deleteJob()`, `syncJobsByRole()` |
| `UserService` | Gerenciamento de usuários | `getUsers()`, `getUserById()`, `updateUser()`, `deleteUser()`, `addUser()` |
| `StorageService` | Armazenamento local (deprecated) | `get()`, `set()`, `exportData()`, `importData()` |
| `AuthContext` | Contexto de autenticação | `login()`, `logout()`, `refreshProfile()` |

### Funções Globais

| Função | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `cn()` | `...inputs: ClassValue[]` | `string` | Utilitário para combinar classes CSS (clsx + tailwind-merge) |
| `useAuth()` | - | `AuthContextType` | Hook para acessar contexto de autenticação |
| `useJobs()` | - | `{ jobs, loading, error, refetch }` | Hook para gerenciar vagas |
| `useCandidates()` | `jobId?: string` | `{ candidates, loading, error, refetch }` | Hook para gerenciar candidatos |
| `useRoles()` | - | `{ roles, loading, error, refetch }` | Hook para gerenciar cargos |
| `useUsers()` | - | `{ users, loading, error, refetch }` | Hook para gerenciar usuários |
| `useAudit()` | - | `{ logs, loading, error, refetch }` | Hook para logs de auditoria |
| `useSettings()` | - | `{ settings, updateSettings }` | Hook para configurações do sistema |
| `useDebounce()` | `value: T, delay: number` | `T` | Hook para debounce de valores |
| `useCandidateData()` | - | `{ profile, applications, updateProfile }` | Hook para dados do candidato logado |
| `useQuickView()` | - | `{ openQuickView, closeQuickView }` | Hook para visualização rápida |

### Interfaces TypeScript Principais

#### Candidate
```typescript
interface Candidate {
  id: string;
  jobId?: string | number;
  name: string;
  email: string;
  phone: string;
  location: string;
  role?: string;
  summary?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resume_url?: string;
  resume_name?: string;
  user_id?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  languages?: string[];
  avatar?: string;
  avatarColor: string;
  textColor: string;
  columnId: KanbanColumnId;
  applied_at?: string;
  hired_at?: string;
  feedbacks?: CandidateFeedback[];
}
```

#### Job
```typescript
interface Job {
  id: string | number;
  role_id?: string;
  title: string;
  context: string;
  department: string;
  location: string;
  model: string;
  contract: string;
  urgency: 'Alta' | 'Média' | 'Baixa';
  status: 'Ativa' | 'Pausada' | 'Rascunho' | 'Encerrada';
  salary_min: number;
  salary_max: number;
  mission?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string[];
  seniority?: string;
  candidates_count: number;
  created_at: string;
  manager_id?: string;
  registration_deadline?: string;
}
```

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'recruiter' | 'quality' | 'dp' | 'candidate';
  status: 'active' | 'suspended';
  lastAccess: string;
  department?: string;
  phone?: string;
  location?: string;
  summary?: string;
  linkedin?: string;
  portfolio?: string;
  resume_url?: string;
  resume_name?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  languages?: string[];
  scope?: {
    vacancy_view_type: 'direct' | 'department';
    allowed_departments: string[];
    allowed_role_codes?: string[];
  };
  custom_permissions?: {
    close_job?: boolean;
    approve_finalist?: boolean;
    register_feedback?: boolean;
    view_salaries?: boolean;
    return_candidate_stage?: boolean;
  };
}
```

#### Role
```typescript
interface Role {
  id: string;
  code: string;
  title: string;
  area: string;
  department: string;
  open_positions: number;
  status: 'Ativo' | 'Inativo';
  updated_at: string;
  mission?: string;
  responsibilities?: string;
  seniority?: string;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  activeJobsCount?: number;
}
```

---

## 🏗️ Arquitetura

### Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Linguagem** | TypeScript | ~5.8.2 |
| **Framework UI** | React | ^19.2.3 |
| **Build Tool** | Vite | ^6.2.0 |
| **Roteamento** | React Router DOM | ^7.11.0 |
| **Estilização** | Tailwind CSS | ^3.4.19 |
| **Backend/Auth** | Supabase | ^2.89.0 |
| **Drag & Drop** | @dnd-kit | ^6.3.1 |
| **Ícones** | Lucide React | ^0.562.0 |
| **Utilitários CSS** | clsx, tailwind-merge, CVA | - |

### Estrutura de Pastas

```
Sistema-de-Recrutamento/
├── .agent/                    # Configurações de agentes AI
│   └── workflows/             # Workflows automatizados
├── components/                # Componentes React reutilizáveis
│   ├── atoms/                 # Componentes atômicos (Button, Input, etc.)
│   ├── molecules/             # Componentes moleculares (Card, Form, etc.)
│   ├── organisms/             # Componentes complexos (Header, Sidebar, etc.)
│   ├── templates/             # Templates de página
│   ├── ui/                    # Componentes de UI genéricos
│   └── candidate/             # Componentes específicos do portal do candidato
├── constants/                 # Constantes e configurações
│   ├── departments.ts         # Departamentos disponíveis
│   └── roles.ts               # Funções e permissões
├── context/                   # Contextos React
│   ├── AuthContext.tsx        # Contexto de autenticação
│   └── QuickViewContext.tsx   # Contexto de visualização rápida
├── docs/                      # Documentação
│   └── db_init.sql            # Script de inicialização do banco
├── hooks/                     # Custom React Hooks
│   ├── useAuth.ts             # Hook de autenticação
│   ├── useJobs.ts             # Hook de vagas
│   ├── useCandidates.ts       # Hook de candidatos
│   ├── useRoles.ts            # Hook de cargos
│   ├── useUsers.ts            # Hook de usuários
│   ├── useAudit.ts            # Hook de auditoria
│   ├── useSettings.ts         # Hook de configurações
│   ├── useCandidateData.ts    # Hook de dados do candidato
│   └── useDebounce.ts         # Hook de debounce
├── layouts/                   # Layouts de página
│   ├── PublicLayout.tsx       # Layout público (vagas)
│   └── CandidateLayout.tsx    # Layout do portal do candidato
├── lib/                       # Bibliotecas e utilitários
│   ├── supabase.ts            # Cliente Supabase
│   └── storage.ts             # Serviço de armazenamento (deprecated)
├── migrations/                # Migrations do banco de dados
│   ├── 001_add_salary_to_roles.sql
│   ├── 002_add_role_id_to_jobs.sql
│   └── COMPLETE_SETUP.sql
├── openspec/                  # Especificações OpenSpec
│   └── specs/                 # Especificações de mudanças
├── pages/                     # Páginas da aplicação
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── Kanban.tsx             # Board Kanban
│   ├── Jobs.tsx               # Listagem de vagas
│   ├── CreateJob.tsx          # Criação de vaga
│   ├── EditJob.tsx            # Edição de vaga
│   ├── JobDetail.tsx          # Detalhes da vaga
│   ├── Roles.tsx              # Listagem de cargos
│   ├── CreateRole.tsx         # Criação de cargo
│   ├── EditRole.tsx           # Edição de cargo
│   ├── Settings.tsx           # Configurações do sistema
│   ├── Audit.tsx              # Logs de auditoria
│   ├── TalentBank.tsx         # Banco de talentos
│   ├── Login.tsx              # Login
│   ├── ForgotPassword.tsx     # Recuperação de senha
│   ├── ResetPassword.tsx      # Reset de senha
│   ├── TwoFactorAuth.tsx      # Autenticação 2FA
│   ├── RequestAccess.tsx      # Solicitação de acesso
│   ├── EditUser.tsx           # Edição de usuário
│   ├── DebugAuth.tsx          # Debug de autenticação
│   ├── candidate/             # Páginas do portal do candidato
│   │   ├── Dashboard.tsx      # Dashboard do candidato
│   │   ├── Applications.tsx   # Candidaturas
│   │   ├── Profile.tsx        # Perfil do candidato
│   │   └── ApplicationDetail.tsx # Detalhes da candidatura
│   └── public/                # Páginas públicas
│       ├── JobsList.tsx       # Listagem pública de vagas
│       ├── JobDetailPublic.tsx # Detalhes públicos da vaga
│       ├── ApplyForm.tsx      # Formulário de candidatura
│       ├── SignUp.tsx         # Cadastro de candidato
│       ├── VerifyEmail.tsx    # Verificação de email
│       └── NotFound.tsx       # Página 404
├── public/                    # Arquivos públicos estáticos
├── scripts/                   # Scripts utilitários
│   └── create_admin.ts        # Script para criar admin
├── src/                       # Código-fonte adicional
│   ├── index.css              # Estilos globais
│   ├── lib/                   # Bibliotecas
│   │   └── utils.ts           # Utilitários gerais
│   └── services/              # Serviços de dados
│       ├── CandidateService.ts # Serviço de candidatos
│       ├── JobService.ts      # Serviço de vagas
│       └── UserService.ts     # Serviço de usuários
├── App.tsx                    # Componente raiz e roteamento
├── index.tsx                  # Entry point React
├── index.html                 # HTML principal
├── types.ts                   # Definições de tipos TypeScript
├── constants.ts               # Constantes globais
├── package.json               # Dependências do projeto
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite
├── tailwind.config.ts         # Configuração Tailwind
├── postcss.config.cjs         # Configuração PostCSS
├── vercel.json                # Configuração Vercel
└── README.md                  # Documentação principal
```

### Componentes

#### Componentes Principais e Responsabilidades

| Componente | Responsabilidade | Localização |
|-----------|------------------|-------------|
| `App.tsx` | Roteamento principal e estrutura da aplicação | `/App.tsx` |
| `Sidebar` | Navegação lateral do sistema | `/components/Sidebar.tsx` |
| `CandidateProfileDrawer` | Visualização detalhada do perfil do candidato | `/components/CandidateProfileDrawer.tsx` |
| `QuickViewDrawer` | Visualização rápida de candidatos | `/components/QuickViewDrawer.tsx` |
| `DroppableKanbanColumn` | Coluna do Kanban com drag & drop | `/components/DroppableKanbanColumn.tsx` |
| `SortableCandidateCard` | Card de candidato arrastável | `/components/SortableCandidateCard.tsx` |
| `InterviewFeedbackModal` | Modal para registro de feedback | `/components/InterviewFeedbackModal.tsx` |
| `UserModal` | Modal de criação/edição de usuário | `/components/UserModal.tsx` |
| `BenefitsSelector` | Seletor de benefícios para vagas | `/components/BenefitsSelector.tsx` |
| `SkillsSelector` | Seletor de habilidades | `/components/SkillsSelector.tsx` |
| `EducationListEditor` | Editor de formação acadêmica | `/components/EducationListEditor.tsx` |
| `ExperienceListEditor` | Editor de experiência profissional | `/components/ExperienceListEditor.tsx` |

### Fluxos

#### Fluxo de Autenticação
```
1. Usuário acessa /login
2. Insere credenciais (email/senha)
3. AuthContext.login() chama supabase.auth.signInWithPassword()
4. Supabase valida credenciais
5. AuthContext.fetchProfile() busca dados do usuário em public.users
6. Se não encontrar, usa fallback com metadata do auth
7. Usuário é redirecionado baseado em sua role:
   - admin/manager/recruiter/quality/dp → /admin/dashboard
   - candidate → /candidate/dashboard
```

#### Fluxo de Candidatura (Portal Público)
```
1. Candidato acessa /vagas
2. Visualiza listagem de vagas ativas
3. Clica em uma vaga para ver detalhes
4. Clica em "Candidatar-se"
5. Se não estiver logado:
   a. Redirecionado para /cadastro
   b. Cria conta com role 'candidate'
   c. Verifica email (opcional)
6. Preenche formulário de candidatura
7. Faz upload do currículo
8. CandidateService.addCandidate() cria registro
9. Candidato aparece na coluna "Recebido" do Kanban
10. Candidato pode acompanhar status em /candidate/applications
```

#### Fluxo de Movimentação no Kanban
```
1. Recrutador acessa /admin/kanban
2. Seleciona vaga específica
3. Visualiza candidatos em colunas (received, screening, etc.)
4. Arrasta candidato para nova coluna (drag & drop)
5. handleDragEnd() é acionado
6. CandidateService.updateCandidate() atualiza column_id
7. Log de auditoria é criado automaticamente
8. UI é atualizada em tempo real
9. Candidato vê mudança de status em seu portal
```

#### Fluxo de Criação de Vaga
```
1. Admin/Recruiter acessa /admin/jobs
2. Clica em "Nova Vaga"
3. Wizard de criação em 3 etapas:
   a. Informações básicas (título, departamento, localização)
   b. Detalhes (missão, responsabilidades, requisitos)
   c. Configurações (urgência, status, salário, benefícios)
4. Pode vincular a um Role existente (role_id)
5. JobService.createJob() cria registro
6. Vaga aparece em /admin/jobs e /vagas (se status = Ativa)
7. Log de auditoria registra criação
```

#### Fluxo de Auditoria
```
1. Qualquer ação crítica no sistema (CRUD de usuários, mudança de status, etc.)
2. Trigger automático ou chamada manual a supabase.from('audit_logs').insert()
3. Registro inclui:
   - action: descrição da ação
   - user_name: quem executou
   - timestamp: quando
   - details: detalhes adicionais
   - category: tipo de ação
   - entity_type/entity_id: entidade afetada
4. Admin/Quality pode visualizar em /admin/audit
5. Filtros por categoria, período, usuário
```

---

## 📚 Referência de Código

### Classes

#### CandidateService
**Arquivo:** `src/services/CandidateService.ts`

**Descrição:** Serviço responsável por todas as operações relacionadas a candidatos, incluindo CRUD, upload de currículos e gerenciamento de feedbacks.

**Métodos:**

| Método | Assinatura | Descrição |
|--------|-----------|-----------|
| `getCandidates` | `async getCandidates(): Promise<Candidate[]>` | Busca todos os candidatos com feedbacks |
| `getCandidatesByJob` | `async getCandidatesByJob(jobId: string): Promise<Candidate[]>` | Busca candidatos de uma vaga específica |
| `uploadResume` | `async uploadResume(file: File, candidateEmail: string): Promise<string>` | Faz upload do currículo para Supabase Storage |
| `addCandidate` | `async addCandidate(candidate: Omit<Candidate, 'id' \| 'applied_at'>): Promise<Candidate \| null>` | Adiciona novo candidato e sincroniza com public.users |
| `updateCandidate` | `async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate \| null>` | Atualiza dados do candidato |
| `deleteCandidate` | `async deleteCandidate(id: string): Promise<boolean>` | Remove candidato (com validação RLS) |
| `addFeedback` | `async addFeedback(candidateId: string, feedback: any): Promise<boolean>` | Adiciona feedback de entrevista |

**Atributos:**
- Utiliza `mapDbToCandidate()` helper para conversão snake_case → camelCase

---

#### JobService
**Arquivo:** `src/services/JobService.ts`

**Descrição:** Serviço para gerenciamento de vagas de emprego.

**Métodos:**

| Método | Assinatura | Descrição |
|--------|-----------|-----------|
| `getJobs` | `async getJobs(): Promise<Job[]>` | Lista todas as vagas |
| `getJobById` | `async getJobById(id: string): Promise<Job \| null>` | Busca vaga por ID |
| `createJob` | `async createJob(job: Omit<Job, 'id' \| 'created_at' \| 'candidates_count'>): Promise<Job \| null>` | Cria nova vaga |
| `updateJob` | `async updateJob(id: string, updates: Partial<Job>): Promise<Job \| null>` | Atualiza vaga existente |
| `deleteJob` | `async deleteJob(id: string): Promise<boolean>` | Remove vaga |
| `syncJobsByRole` | `async syncJobsByRole(roleId: string, updates: {...}): Promise<void>` | Sincroniza vagas vinculadas a um cargo |

---

#### UserService
**Arquivo:** `src/services/UserService.ts`

**Descrição:** Serviço para gerenciamento de usuários administrativos (exclui candidatos).

**Métodos:**

| Método | Assinatura | Descrição |
|--------|-----------|-----------|
| `getUsers` | `async getUsers(): Promise<User[]>` | Lista usuários (exceto candidatos) |
| `getUserById` | `async getUserById(id: string): Promise<User \| null>` | Busca usuário por ID |
| `updateUser` | `async updateUser(id: string, updates: Partial<User>): Promise<User \| null>` | Atualiza usuário via Edge Function |
| `deleteUser` | `async deleteUser(id: string): Promise<boolean>` | Remove perfil público do usuário |
| `addUser` | `async addUser(user: Omit<User, 'id'>): Promise<User \| null>` | Cria usuário via Edge Function |

**Observações:**
- Utiliza Edge Functions (`update-user-admin`, `create-user-admin`) para operações sensíveis
- Requer token de autenticação válido

---

#### AuthContext
**Arquivo:** `context/AuthContext.tsx`

**Descrição:** Contexto React para gerenciamento de autenticação e sessão do usuário.

**Métodos:**

| Método | Assinatura | Descrição |
|--------|-----------|-----------|
| `login` | `async login(email: string, password: string): Promise<boolean>` | Autentica usuário |
| `logout` | `async logout(): void` | Encerra sessão |
| `refreshProfile` | `async refreshProfile(): Promise<void>` | Atualiza dados do perfil |
| `fetchProfile` | `async fetchProfile(userId: string, metadata?: any): Promise<User \| null>` | Busca perfil com fallback |

**Atributos:**
- `user: User | null` - Usuário autenticado
- `isAuthenticated: boolean` - Status de autenticação
- `isEmailConfirmed: boolean` - Email verificado
- `isLoading: boolean` - Estado de carregamento

---

### Funções

| Função | Localização | Assinatura | Descrição |
|--------|------------|-----------|-----------|
| `cn` | `src/lib/utils.ts` | `cn(...inputs: ClassValue[]): string` | Combina classes CSS com clsx e tailwind-merge |
| `useAuth` | `context/AuthContext.tsx` | `useAuth(): AuthContextType` | Hook para acessar contexto de autenticação |
| `useJobs` | `hooks/useJobs.ts` | `useJobs(): { jobs, loading, error, refetch }` | Hook para gerenciar vagas |
| `useCandidates` | `hooks/useCandidates.ts` | `useCandidates(jobId?: string): { candidates, loading, error, refetch }` | Hook para gerenciar candidatos |
| `useRoles` | `hooks/useRoles.ts` | `useRoles(): { roles, loading, error, refetch }` | Hook para gerenciar cargos |
| `useUsers` | `hooks/useUsers.ts` | `useUsers(): { users, loading, error, refetch }` | Hook para gerenciar usuários |
| `useAudit` | `hooks/useAudit.ts` | `useAudit(): { logs, loading, error, refetch }` | Hook para logs de auditoria |
| `useSettings` | `hooks/useSettings.ts` | `useSettings(): { settings, updateSettings }` | Hook para configurações |
| `useDebounce` | `hooks/useDebounce.ts` | `useDebounce<T>(value: T, delay: number): T` | Hook para debounce |
| `useCandidateData` | `hooks/useCandidateData.ts` | `useCandidateData(): { profile, applications, updateProfile }` | Hook para dados do candidato |
| `useQuickView` | `context/QuickViewContext.tsx` | `useQuickView(): { openQuickView, closeQuickView }` | Hook para visualização rápida |
| `isAdminRole` | `constants/roles.ts` | `isAdminRole(role?: string): boolean` | Verifica se é função administrativa |
| `isCandidateRole` | `constants/roles.ts` | `isCandidateRole(role?: string): boolean` | Verifica se é função de candidato |
| `mapDbToCandidate` | `src/services/CandidateService.ts` | `mapDbToCandidate(dbCandidate: any): Candidate` | Converte dados do DB para interface Candidate |

---

### Constantes

| Nome | Valor | Arquivo | Propósito |
|------|-------|---------|-----------|
| `COLUMNS_CONFIG` | Array de configurações de colunas | `constants.ts` | Define colunas do Kanban (id, título, cor) |
| `JOB_BENEFITS_OPTIONS` | Array de strings | `constants.ts` | Lista de benefícios predefinidos para vagas |
| `ADMIN_ROLES` | `['admin', 'manager', 'recruiter', 'quality', 'dp']` | `constants/roles.ts` | Funções administrativas |
| `ALL_ROLES` | `[...ADMIN_ROLES, 'candidate']` | `constants/roles.ts` | Todas as funções do sistema |
| `DEPARTMENT_AREAS` | Array de departamentos | `constants/departments.ts` | Departamentos disponíveis |
| `KEYS` | Objeto com chaves de localStorage | `lib/storage.ts` | Chaves para armazenamento local (deprecated) |

---

### Módulos / Arquivos

| Arquivo | Propósito | Dependências Principais |
|---------|-----------|------------------------|
| `App.tsx` | Roteamento e estrutura principal | `react-router-dom`, `AuthContext`, todas as páginas |
| `types.ts` | Definições de tipos TypeScript | Nenhuma |
| `constants.ts` | Constantes globais | Nenhuma |
| `lib/supabase.ts` | Cliente Supabase | `@supabase/supabase-js` |
| `lib/storage.ts` | Serviço de armazenamento (deprecated) | `types.ts` |
| `src/lib/utils.ts` | Utilitários gerais | `clsx`, `tailwind-merge` |
| `context/AuthContext.tsx` | Contexto de autenticação | `react`, `supabase`, `types.ts` |
| `context/QuickViewContext.tsx` | Contexto de visualização rápida | `react` |
| `hooks/useJobs.ts` | Hook de vagas | `react`, `JobService` |
| `hooks/useCandidates.ts` | Hook de candidatos | `react`, `CandidateService` |
| `hooks/useRoles.ts` | Hook de cargos | `react`, `supabase` |
| `hooks/useUsers.ts` | Hook de usuários | `react`, `UserService` |
| `hooks/useAudit.ts` | Hook de auditoria | `react`, `supabase` |
| `hooks/useSettings.ts` | Hook de configurações | `react`, `supabase` |
| `hooks/useDebounce.ts` | Hook de debounce | `react` |
| `hooks/useCandidateData.ts` | Hook de dados do candidato | `react`, `supabase`, `AuthContext` |
| `pages/Dashboard.tsx` | Dashboard principal | `useJobs`, `useCandidates`, `useUsers`, `useAuth` |
| `pages/Kanban.tsx` | Board Kanban | `@dnd-kit/*`, `useCandidates`, `QuickViewContext` |
| `pages/Jobs.tsx` | Listagem de vagas | `useJobs`, `react-router-dom` |
| `pages/Settings.tsx` | Configurações do sistema | `useUsers`, `useSettings`, `useAuth` |
| `pages/Audit.tsx` | Logs de auditoria | `useAudit` |
| `components/Sidebar.tsx` | Navegação lateral | `react-router-dom`, `useAuth` |
| `components/CandidateProfileDrawer.tsx` | Drawer de perfil do candidato | `CandidateService`, `StorageService` |
| `components/QuickViewDrawer.tsx` | Drawer de visualização rápida | `QuickViewContext`, `CandidateService` |
| `src/services/CandidateService.ts` | Serviço de candidatos | `supabase`, `types.ts` |
| `src/services/JobService.ts` | Serviço de vagas | `supabase`, `types.ts` |
| `src/services/UserService.ts` | Serviço de usuários | `supabase`, `types.ts` |

---

## 🔐 Segurança

### Row Level Security (RLS)

O sistema implementa políticas RLS no Supabase para garantir que:
- Candidatos só acessem suas próprias candidaturas
- Gestores só vejam vagas de seus departamentos (se configurado)
- Admins tenham acesso total
- Logs de auditoria sejam imutáveis

### Validação de Permissões

```typescript
// Frontend Guard
<RequireAuth>
  <AdminRoutes />
</RequireAuth>

// Backend (Edge Functions)
const { data: { user } } = await supabase.auth.getUser(token);
if (!user || !isAdminRole(user.role)) {
  return new Response('Unauthorized', { status: 401 });
}
```

---

## 📝 Notas de Desenvolvimento

### Padrões de Código

1. **TypeScript Strict Mode**: Todos os arquivos usam tipagem forte
2. **Naming Conventions**:
   - Componentes: PascalCase (`CandidateCard.tsx`)
   - Hooks: camelCase com prefixo `use` (`useJobs.ts`)
   - Services: PascalCase com sufixo `Service` (`JobService.ts`)
   - Constantes: UPPER_SNAKE_CASE (`COLUMNS_CONFIG`)
3. **Imports**: Organizados em ordem (React, bibliotecas, componentes locais, tipos)
4. **Comentários**: JSDoc para funções públicas

### Boas Práticas

- ✅ Sempre use hooks customizados para acesso a dados
- ✅ Valide permissões no frontend E backend
- ✅ Registre ações críticas em audit_logs
- ✅ Use TypeScript interfaces para contratos de dados
- ✅ Implemente loading states e error handling
- ✅ Mantenha componentes pequenos e focados
- ✅ Use context para estado global (Auth, QuickView)

---

## 🚀 Deploy

O sistema está configurado para deploy no **Vercel**:

```bash
# Build de produção
npm run build

# Preview local
npm run preview
```

Configurações em `vercel.json`:
- Rewrites para SPA routing
- Variáveis de ambiente via Vercel Dashboard
- Build command: `npm run build`
- Output directory: `dist`

---

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

**Documentação gerada automaticamente em:** 2026-01-09  
**Versão do Sistema:** 1.0.0  
**Última atualização:** 2026-01-09
