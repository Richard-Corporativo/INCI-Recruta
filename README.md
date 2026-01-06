# RecruitSys - Sistema de Gestão de Recrutamento (ATS)

## 📋 Visão Geral

O **INCIRECRUTA** é uma plataforma completa de **Applicant Tracking System (ATS)** desenvolvida para otimizar o fluxo de contratação de empresas. O sistema permite que gestores de RH e líderes de equipe gerenciem vagas, acompanhem candidatos através de um pipeline visual (Kanban), e mantenham registros de auditoria detalhados.

O projeto apresenta um design moderno, responsivo e suporta nativamente **Dark Mode**.

## 🚀 Principais Funcionalidades

### 1. Dashboard Analítico
- **KPIs em Tempo Real:** Visualização rápida de vagas abertas, candidatos ativos, tempo médio de contratação e gargalos.
- **Funil de Conversão:** Métricas de aprovação entre etapas (Triagem → Entrevista → Oferta).
- **Filtros Avançados:** Segmentação por período, departamento e gestor responsável.

### 2. Gestão de Processos Seletivos (Kanban)
- **Pipeline Visual:** Interface "Drag-and-Drop" para mover candidatos entre as etapas (Recebido, Triagem, Teste Técnico, Entrevista, Finalista, Contratado).
- **Cartões Detalhados:** Visualização rápida de "Match Score", tempo na etapa e alertas de feedback pendente.
- **Ações Rápidas:** Agendamento de entrevistas, reprovação e aprovação direta pelo card.

### 3. Catálogo de Vagas e Cargos
- **Criação Estruturada:** Fluxo guiado (Wizard) para abertura de novas vagas.
- **Biblioteca de Cargos:** Definição padronizada de requisitos, skills e escopo para reutilização.
- **Status:** Controle de vagas (Ativa, Pausada, Rascunho, Encerrada).

### 4. Perfil do Candidato (Drawer)
- **Histórico Completo:** Linha do tempo com todas as interações e mudanças de status.
- **Avaliação:** Módulo para registro de feedbacks de entrevistas com sistema de notas (estrelas) e parecer técnico.
- **Dados:** Informações de contato e resumo profissional.


### 5. Governança e Auditoria
- **Log de Auditoria:** Registro imutável de todas as ações no sistema (quem fez, quando e o que mudou).
- **Controle de Acesso (RBAC):** Diferenciação entre perfis de Admin, RH e Gestor Contratante.
- **Configurações de Escopo:** Definição granular de quais departamentos um gestor pode visualizar.

### 6. Portal do Candidato
- **Área Pública:** Listagem de vagas abertas e formulário de candidatura.
- **Dashboard Pessoal:** Acompanhamento do status de candidaturas em tempo real.
- **Gestão de Perfil:** Atualização de dados pessoais, currículo e informações de contato.

## 🔐 Segurança e Controle de Acesso

### Role-Based Access Control (RBAC)

O sistema implementa controle de acesso baseado em funções (roles) com validação em múltiplas camadas:

#### Funções Administrativas
- **admin** - Acesso total ao sistema, incluindo configurações e gestão de usuários
- **manager** - Gestão de departamentos e equipes
- **recruiter** - Operações de recrutamento e gestão de candidatos
- **quality** - Garantia de qualidade e auditoria de processos
- **dp** - Departamento pessoal e RH

#### Função de Candidato
- **candidate** - Acesso exclusivo ao portal do candidato (sem acesso administrativo)

### Proteção de Rotas

#### Rotas Administrativas (Requerem função administrativa)
- `/admin/*` - Painel administrativo
- `/jobs/*` - Gestão de vagas
- `/settings/*` - Configurações do sistema
- `/talent-bank` - Banco de talentos
- `/audit` - Logs de auditoria

#### Rotas do Candidato (Requerem função 'candidate')
- `/candidate/*` - Portal do candidato
- `/candidate/dashboard` - Dashboard pessoal
- `/candidate/applications` - Minhas candidaturas

#### Rotas Públicas (Sem autenticação)
- `/vagas` - Listagem de vagas
- `/login` - Login do candidato
- `/cadastro` - Registro de candidato

### Camadas de Segurança

1. **Frontend Guard**: Componente `RequireAuth` valida role antes de renderizar rotas
2. **Row Level Security (RLS)**: Políticas do Supabase garantem acesso aos dados
3. **API Validation**: Edge Functions validam permissões no servidor


## 🛠️ Stack Tecnológica

O projeto foi construído utilizando tecnologias modernas de frontend:

- **Core:** [React 18](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Supabase](https://supabase.com/) (Auth & Database)
- **Roteamento:** [React Router DOM](https://reactrouter.com/)
- **Ícones:** [Google Material Symbols](https://fonts.google.com/icons)
- **Build/Dev:** Vite (Implícito pela estrutura)

## 🎨 Design System

O sistema utiliza um tema personalizado com suporte a modo claro e escuro:

- **Tipografia:** Inter (Google Fonts)
- **Cores Semânticas:** 
  - Primary: Azul Institucional (`#197fe6`)
  - Status: Verde (Sucesso), Vermelho (Erro/Urgência Alta), Amarelo (Atenção/Média).
- **Componentes:** Modais, Drawers laterais, Breadcrumbs e Tabelas responsivas.

## 📂 Estrutura do Projeto

```
/
├── components/       # Componentes reutilizáveis (Sidebar, Modais, Drawers)
├── pages/            # Páginas da aplicação (Dashboard, Kanban, Jobs, etc.)
├── types.ts          # Definições de tipos TypeScript globais
├── App.tsx           # Configuração de rotas e layout principal
├── index.html        # Ponto de entrada e importmaps
└── index.tsx         # Renderização da raiz React
```

## 🚀 Como Executar

1. Certifique-se de ter um ambiente Node.js instalado.

2. Configure o ambiente Supabase:
   - Crie um projeto no Supabase.
   - Crie um arquivo `.env` na raiz com:
     ```
     VITE_SUPABASE_URL=seu_url
     VITE_SUPABASE_ANON_KEY=sua_chave
     ```
   - Execute o script SQL em `docs/db_init.sql`.
   - **Execute as migrations:**
     ```sql
     -- No SQL Editor do Supabase, execute:
     -- migrations/COMPLETE_SETUP.sql
     ```
     Ou execute individualmente:
     - `migrations/001_add_salary_to_roles.sql`
     - `migrations/002_add_role_id_to_jobs.sql`
   - **Configure RLS Policies** (ver `GUIA-EXECUCAO-COMPLETA.md`)

3. Para desenvolvimento tradicional com Vite:
   ```bash
   npm install
   npm run dev
   ```

4. O sistema abrirá no navegador padrão.

## 🔐 Acesso

O sistema utiliza **Supabase Auth**.
- **Login:** Utilize as credenciais de um usuário cadastrado na tabela `auth.users` (e `public.users`).
- **Cadastro:** Via convite ou inserção direta no banco de dados (Dashboard Supabase).

---

*Desenvolvido com foco em UX e eficiência para times de RH.*
