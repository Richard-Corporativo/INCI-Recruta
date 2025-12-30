# RecruitSys - Sistema de Gestão de Recrutamento (ATS)

## 📋 Visão Geral

O **RecruitSys** é uma plataforma completa de **Applicant Tracking System (ATS)** desenvolvida para otimizar o fluxo de contratação de empresas. O sistema permite que gestores de RH e líderes de equipe gerenciem vagas, acompanhem candidatos através de um pipeline visual (Kanban), e mantenham registros de auditoria detalhados.

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

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando tecnologias modernas de frontend:

- **Core:** [React 18](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
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

1. Certifique-se de ter um ambiente Node.js instalado (para desenvolvimento local padrão) ou utilize um servidor estático simples, já que o projeto utiliza `importmap` no `index.html` para carregar dependências via CDN (esm.sh).

2. Para desenvolvimento tradicional com Vite (recomendado):
   ```bash
   npm install
   npm run dev
   ```

3. O sistema abrirá no navegador padrão.

## 🔐 Acesso (Dados Mockados)

Como é uma versão de demonstração/frontend, o sistema possui autenticação simulada.
- **Login:** Qualquer e-mail/senha válidos na lógica do `Login.tsx` (ex: `israel.richard@incibrasil.com.br` / `incibrasil1234`) ou acesso direto via rotas protegidas simuladas.

---

*Desenvolvido com foco em UX e eficiência para times de RH.*
