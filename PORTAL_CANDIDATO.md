# 🚀 Roadmap Frontend: Portal do Candidato

Este documento foca exclusivamente na implementação da **Interface do Candidato**, priorizando a experiência visual e de navegação antes da integração com o backend.

---

## 🗺️ Visão Geral da Jornada
O objetivo é entregar um fluxo completo de ponta a ponta:
**Descoberta (Vagas)** -> **Interesse (Detalhes)** -> **Ação (Cadastro/Login)** -> **Confirmação (Dashboard)**.

---

## 📅 Etapa 1: Descoberta e Visualização (Public)
*Onde o candidato se apaixona pela empresa.*

### 1.1 Layout Público (`PublicLayout`)
- **Header:** Logotipo da empresa + Botões "Login" (Outline) e "Cadastre-se" (Solid Primary).
- **Footer:** Links institucionais simplificados.
- **Estilo:** Clean, espaçamento generoso, tipografia moderna (Inter/Outfit).

### 1.2 Listagem de Vagas (`/vagas`)
- **Hero Section:** Título convidativo ("Encontre seu próximo desafio").
- **Filtros:** Barra lateral ou topo (Modelo de trabalho, Departamento).
- **Cards de Vaga (`JobCardPublic`):**
    - Título da vaga em destaque.
    - Tags (e.g., "Remoto", "Engenharia").
    - Botão "Ver Detalhes" com micro-interação de hover.

### 1.3 Detalhes da Vaga (`/vagas/:id`)
- **Header da Vaga:** Título, Localização e Salário (se público).
- **Conteúdo:** Descrição rica (Rich Text) com requisitos e benefícios.
- **Call to Action (CTA):** Sticky bar no mobile ou Card flutuante no desktop com botão "Candidatar-se".

---

## 🔐 Etapa 2: Identidade e Acesso (Auth)
*Onde o visitante vira um usuário.*

### 2.1 Login (`/login`)
- **Design:** Card centralizado em fundo neutro ou com imagem lateral inspiradora.
- **Campos:** E-mail e Senha.
- **Social:** (Opcional) "Entrar com Google/LinkedIn" (apenas UI por enquanto).

### 2.2 Cadastro (`/cadastro`)
- **Wizard Simplificado:**
    1.  **Credenciais:** Nome, E-mail, Senha.
    2.  **Profissional:** Link LinkedIn, Link Portfólio.
    3.  **Currículo:** Drag-and-drop para upload de PDF.
- **Feedback:** Feedback visual imediato de sucesso ("Conta criada!").

---

## 📋 Etapa 3: Candidatura e Acompanhamento (Private)
*Onde o candidato gerencia sua carreira.*

### 3.1 Modal de Aplicação
- Ao clicar em "Candidatar-se" (logado):
- Confirmação dos dados do perfil.
- Campo opcional para "Carta de Apresentação" ou "Por que devo ser contratado?".
- Botão final "Enviar Candidatura".

### 3.2 Dashboard do Candidato (`/dashboard`)
- **Resumo:** "Você tem X candidaturas ativas".
- **Lista de Aplicações:**
    - Cards horizontais para cada vaga aplicada.
    - **Stepper Visual:** Barra de progresso mostrando a etapa atual.
        - `Enviado` -> `Triagem` -> `Entrevista` -> `Proposta`
    - **Status:** Badge com cor semântica (Amarelo: Em andamento, Verde: Aprovado, Cinza: Banco de Talentos).

---

## 🛠️ Checklist de Desenvolvimento (Frontend First)

- [ ] **Setup**
    - [ ] Criar `PublicLayout.tsx` e `CandidateLayout.tsx`.
    - [ ] Configurar rotas no React Router (`vagas/*`, `candidate/*`).

- [ ] **Componentes Base (UI)**
    - [ ] `JobCardPublic`: Versão "marketável" do card de vaga.
    - [ ] `StatusStepper`: Componente visual de etapas (bolinhas conectadas por linha).
    - [ ] `ResumeUploader`: Área de dropzone estilizada.

- [ ] **Páginas**
    - [ ] `/vagas` (Grid com dados mockados).
    - [ ] `/vagas/:id` (Página de vendas da vaga).
    - [ ] `/login` & `/cadastro` (Formulários validados).
    - [ ] `/dashboard` (Visualização do status).

---

## 🎨 Diretrizes de Design (INCI v2.0)
- **Cores:** Usar a paleta primária da marca para CTAs.
- **Espaçamento:** Aumentar o whitespace em 20% comparado ao Admin para ar mais "leve".
- **Raio de Borda:** Manter consistência (`rounded-lg` ou `rounded-xl`).
