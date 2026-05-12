# INCI RECRUTA -Plataforma de Recrutamento

## Índice

1. [Visão Geral](#visão-geral)
2. [Guia de Uso](#guia-de-uso)
3. [API](#api)
4. [Arquitetura](#arquitetura)
5. [Referência de Código](#referência-de-código)

---

## Visão Geral

### Descrição do Projeto

O **INCIRECRUTA** é uma plataforma completa de **Applicant Tracking System (ATS)** desenvolvida para otimizar o fluxo de contratação de empresas. O sistema permite que gestores de RH e líderes de equipe gerenciem vagas, acompanhem candidatos através de um pipeline visual (Kanban), e mantenham registros de auditoria detalhados.

### Objetivo principal

Centralizar e automatizar o processo de recrutamento e seleção, desde a abertura da vaga até a contratação final, garantindo transparência, governança (audit log) e uma experiência superior para candidatos e recrutadores.

### Problema que resolve

- Desorganização em processos seletivos manuais.
- Dificuldade no acompanhamento de candidatos em múltiplas etapas.
- Falta de histórico e auditoria em mudanças de status de vagas e candidatos.
- Fragmentação da comunicação entre gestores e RH.

### Instalação

O projeto utiliza **Vite** com **React** e **TypeScript**.

1.  **Clonar o repositório** e instalar dependências:
    ```bash
    npm install
    ```
2.  **Configurar Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz:
    ```env
    VITE_SUPABASE_URL=sua_url_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima
    ```
3.  **Executar o ambiente de desenvolvimento**:
    ```bash
    npm run dev
    ```

---

## Guia de Uso

### Uso Básico

1.  **Login**: Acesse com suas credenciais de administrador ou recrutador.
2.  **Dashboard**: Visualize os KPIs gerais de vagas e candidatos.
3.  **Gestão de Vagas**: Navegue até "Vagas" para criar ou editar oportunidades.
4.  **Kanban**: Clique em uma vaga para ver o pipeline de candidatos e movê-los entre as etapas (Drag-and-Drop).

### Casos Avançados

- **Gestão de Cargos (Roles)**: Crie modelos de cargos com requisitos e faixas salariais pré-definidas para agilizar a abertura de vagas.
- **Log de Auditoria**: Monitore todas as ações críticas do sistema (alterações de privilégios, movimentação de candidatos, etc) na página de Auditoria.
- **Configurações de SLA**: Defina tempos esperados para cada etapa do processo seletivo.

### Exemplos Práticos

- **Movimentação de Candidato**: Arraste um card de "Triagem" para "Entrevista Técnica". O sistema registrará automaticamente a data de entrada na nova etapa para cálculos de métricas futuras.
- **Feedback de Entrevista**: Ao abrir o card de um candidato, utilize o módulo de feedback para registrar notas e pareceres técnicos que ficam salvos no histórico.

---

## API

### Visão Geral da API

A aplicação consome diretamente o **Supabase** via `supabase-js`, utilizando serviços especializados para abstrair a lógica de dados.

### Classes / Objetos Principais (Interfaces)

| Nome        | Descrição                                                                | Propriedades Principais                                                    |
| :---------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `Job`       | Representa uma vaga aberta no sistema.                                   | `id`, `title`, `status`, `department`, `salary_min/max`, `workflow_status` |
| `Candidate` | Representa um profissional inscrito em uma vaga ou no banco de talentos. | `id`, `name`, `email`, `columnId` (Kanban), `skills`, `experience`         |
| `Role`      | Modelo de cargo para padronização.                                       | `code`, `title`, `department`, `mission`, `requirements`                   |
| `User`      | Usuário do sistema (Admin, Recruiter, Manager, etc).                     | `id`, `name`, `role`, `department`, `scope`                                |
| `AuditLog`  | Registro de ação no sistema para conformidade.                           | `action`, `user_name`, `entity_type`, `old_value`, `new_value`             |

### Funções Globais (Serviços)

#### CandidateService

| Função               | Parâmetros               | Retorno                | Descrição                                                          |
| :------------------- | :----------------------- | :--------------------- | :----------------------------------------------------------------- |
| `getCandidates`      | -                        | `Promise<Candidate[]>` | Retorna todos os candidatos ordenados por data.                    |
| `getCandidatesByJob` | `jobId: string`          | `Promise<Candidate[]>` | Retorna candidatos de uma vaga específica com histórico de etapas. |
| `addCandidate`       | `candidate, resumeFile?` | `Promise<Candidate>`   | Cria um novo candidato e opcionalmente faz upload do currículo.    |
| `updateCandidate`    | `id, updates`            | `Promise<Candidate>`   | Atualiza dados do candidato e registra transições de etapa (SLA).  |
| `uploadAvatar`       | `file, candidateId`      | `Promise<string>`      | Faz upload da foto do candidato (limite 2MB).                      |
| `searchCandidates`   | `filters`                | `Promise<Candidate[]>` | Busca avançada no banco de talentos.                               |

#### JobService

| Função             | Parâmetros                | Retorno          | Descrição                                                                            |
| :----------------- | :------------------------ | :--------------- | :----------------------------------------------------------------------------------- |
| `getJobs`          | -                         | `Promise<Job[]>` | Lista todas as vagas.                                                                |
| `createJob`        | `jobData`                 | `Promise<Job>`   | Cria uma nova vaga.                                                                  |
| `transitionStatus` | `jobId, nextStatus, user` | `Promise<Job>`   | Gerencia o fluxo de estados da vaga (Rascunho -> Pendente -> Aprovado -> Publicado). |

---

## Arquitetura

### Stack Tecnológica

- **Linguagem**: TypeScript
- **Framework**: React 19 (Vite)
- **Backend-as-a-Service**: Supabase (Auth, Database, Edge Functions)
- **Estilização**: Tailwind CSS + Lucide React
- **Gerenciamento de Estado**: React Context API (Auth, QuickView)
- **Roteamento**: React Router DOM v7

### Estrutura de Pastas

```text
/
├── components/         # Componentes UI reutilizáveis
│   ├── atoms/          # Componentes básicos (Button, Input)
│   ├── molecules/      # Combinações de átomos (FormField, SearchBar)
│   ├── organisms/      # Blocos complexos (Sidebar, KanbanBoard)
│   └── ui/             # Componentes base (Radix/Tailwind)
├── pages/              # Páginas principais da aplicação
├── hooks/              # Hooks customizados (useAuth, useCandidates, etc)
├── services/           # Camada de integração com API (Supabase)
├── context/            # Provedores de Contexto (Auth, UI)
├── lib/                # Configurações de bibliotecas (supabase client)
├── types.ts            # Definições globais de interfaces TypeScript
└── constants.ts        # Constantes do sistema (Cores, Opções de Benefícios)
```

### Componentes Principais

- **Sidebar**: Navegação principal com controle de acesso por role.
- **Kanban Board**: Interface drag-and-drop para gestão de fluxo de candidatos.
- **CandidateProfileDrawer**: Detalhamento completo do perfil, histórico e feedbacks.
- **Wizard de Vaga**: Fluxo passo-a-passo para criação de requisições de pessoal.

### Fluxos de Dados

1.  **Autenticação**: O `AuthContext` monitora a sessão do Supabase e carrega o perfil estendido da tabela `public.users`.
2.  **Gestão de Candidatos**: Componentes chamam hooks (`useCandidates`), que utilizam o `CandidateService`, que por sua vez executa queries ou RPCs no Supabase.
3.  **Auditoria**: Ações críticas disparam o `AuditService`, que registra o "antes" e "depois" na tabela de logs para rastreabilidade total.

---

## Referência de Código

### Classes (Interfaces Principais)

As definições de dados estão centralizadas em `types.ts`.

#### Interface: `Candidate`

- **Arquivo**: `types.ts`
- **Atributos**: `id`, `name`, `email`, `phone`, `location`, `columnId`, `skills`, `education`, `experience`, `feedbacks`.
- **Propósito**: Define a estrutura de dados de um candidato em todo o sistema.

### Funções (Principais Métodos de Serviço)

| Função               | Localização           | Assinatura                                      | Descrição                                                            |
| :------------------- | :-------------------- | :---------------------------------------------- | :------------------------------------------------------------------- |
| `getCandidatesByJob` | `CandidateService.ts` | `(jobId: string) => Promise<Candidate[]>`       | Busca candidatos e injeta data de entrada na etapa atual.            |
| `transitionStatus`   | `JobService.ts`       | `(id, nextStatus, user) => Promise<Job>`        | Valida permissões e transiciona o estado de uma vaga no workflow.    |
| `logChange`          | `AuditService.ts`     | `(entityType, id, action, old, new) => Promise` | Compara dois estados de objeto e gera um log detalhado das mudanças. |

### Constantes

| Nome                   | Valor           | Arquivo        | Propósito                                                              |
| :--------------------- | :-------------- | :------------- | :--------------------------------------------------------------------- |
| `COLUMNS_CONFIG`       | `Array<Column>` | `constants.ts` | Define os IDs, títulos e cores das colunas do Kanban.                  |
| `JOB_BENEFITS_OPTIONS` | `string[]`      | `constants.ts` | Lista de benefícios pré-configurados para seleção na criação de vagas. |

### Módulos / Arquivos

| Arquivo                            | Propósito                                          | Dependências                             |
| :--------------------------------- | :------------------------------------------------- | :--------------------------------------- |
| `lib/supabase.ts`                  | Inicialização do cliente Supabase.                 | `@supabase/supabase-js`                  |
| `context/AuthContext.tsx`          | Gestão global de estado de autenticação e RBAC.    | `supabase`, `types.ts`                   |
| `src/services/CandidateService.ts` | Lógica de negócio e persistência para candidatos.  | `supabase`, `types.ts`                   |
| `App.tsx`                          | Definição de rotas, layouts e guards de segurança. | `react-router-dom`, `components/Sidebar` |

---

_Gerado automaticamente em 27 de Abril de 2026._
