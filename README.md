# INCI Recruta - Plataforma de Recrutamento

## 📋 Visão Geral

O **INCI Recruta** é uma plataforma completa de **Applicant Tracking System (ATS)** moderna, desenvolvida para otimizar o fluxo de contratação da INCI Brasil. Construída com **Next.js 15**, **React 19** e **Supabase**, a plataforma oferece uma experiência premium tanto para recrutadores quanto para candidatos.

---

## 🚀 Principais Funcionalidades

### 🏢 Portal Administrativo (Recrutadores & Gestores)

- **Dashboard Analítico:** KPIs em tempo real e métricas de funil de contratação.
- **Pipeline Kanban:** Gestão visual de candidatos (Drag-and-Drop).
- **Banco de Talentos:** Busca avançada com filtros de competências, localização e pretensão salarial.
- **Gestão de Vagas:** Fluxo estruturado para criação e publicação de oportunidades.
- **Auditoria:** Log imutável de todas as ações críticas no sistema.

### 👤 Portal do Candidato

- **Dashboard Pessoal:** Acompanhamento em tempo real do status das candidaturas.
- **Perfil Profissional:** Gestão de currículo (PDF), avatar e dados de contato.
- **Recomendações Determinísticas:** Sugestão de vagas baseada em match de perfil e localização.
- **Busca de Vagas:** Listagem pública com filtros responsivos e busca por geolocalização (IBGE).

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **UI & UX:** [Tailwind CSS](https://tailwindcss.com/) + [Iconify](https://iconify.design/)
- **Backend as a Service:** [Supabase](https://supabase.com/) (Auth, Database, Storage, Edge Functions)
- **Componentes de Ícones:** Web Components (`iconify-icon`) para melhor performance e suporte a Duotone.

---

## 🔐 Segurança e Governança

### Role-Based Access Control (RBAC)

O sistema utiliza políticas estritas de **Row Level Security (RLS)** no Supabase e Middleware no Next.js para garantir que cada usuário acesse apenas o que lhe é permitido.

- **admin:** Gestão total do sistema e usuários.
- **recruiter:** Gestão de vagas e candidatos.
- **manager:** Gestão de departamentos específicos.
- **candidate:** Acesso exclusivo aos seus próprios dados e candidaturas.

### Proteção de Dados (LGPD)

- **Storage Privado:** Currículos e avatares são armazenados em buckets privados do Supabase.
- **Acesso Controlado:** Links de download são gerados sob demanda com URLs assinadas.
- **Auditoria:** Todas as mudanças de etapa e acessos a dados sensíveis são registrados.

---

## 📂 Estrutura do Projeto

```bash
src/
├── app/              # Rotas do App Router (Layouts e Pages)
├── components/       # Componentes React (Shadcn, Shared, Admin, Public)
├── context/          # Provedores de Estado Global (AuthContext)
├── hooks/            # Hooks Customizados para lógica de negócio
├── lib/              # Configurações de bibliotecas (Supabase, Utils)
├── services/         # Camada de I/O (candidate.service, job.service, etc)
├── types/            # Definições de Tipos TypeScript
└── views/            # Componentes de visão principal injetados nas páginas
```

---

## 🚀 Como Iniciar

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Ambiente de Banco de Dados:**
   As definições de tabelas e RLS estão localizadas em `docs/archive/`. Use o SQL Editor do Supabase para aplicar as migrations mais recentes.

---

## 📄 Documentação Relacionada

- [ARCHITECTURE.md](./ARCHITECTURE.md): Detalhes técnicos e padrões de design.
- [SYSTEM_MAP.md](./docs/SYSTEM_MAP.md): Mapeamento completo de arquivos e rotas.
- [Análise de Melhorias](./docs/archive/Análise%20de%20Melhorias%20do%20Portal%20do%20Candidato%20INCI%20Recruta.md): Roadmap de evolução técnica.

---

_por INCI Brasil_
