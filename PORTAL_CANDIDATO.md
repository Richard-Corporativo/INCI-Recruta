# Estruturação do Portal do Candidato - Sistema de Recrutamento

Este documento detalha a arquitetura e o fluxo de trabalho para a implementação da parte do **Candidato** no sistema de recrutamento, integrando-se com a área administrativa já existente.

## 1. Visão Geral
O Portal do Candidato é a interface externa do sistema, permitindo que talentos descubram oportunidades, gerenciem seus perfis e acompanhem seu progresso nos processos seletivos.

## 2. Jornada do Candidato
1.  **Descoberta:** O candidato acessa a página pública de vagas (`/vagas`).
2.  **Visualização:** Consulta detalhes de uma vaga específica (requisitos, salário, modelo de trabalho).
3.  **Cadastro/Login:** Para se candidatar, o usuário deve criar uma conta ou entrar.
4.  **Candidatura:** O usuário clica em "Candidatar-se" e confirma seus dados/currículo.
5.  **Acompanhamento:** Através de um Dashboard, o candidato vê em qual etapa do Kanban ele se encontra.
6.  **Notificação:** Recebe alertas (e-mail e plataforma) quando seu status é alterado pelo Admin.

---

## 3. Estrutura de Rotas (Frontend)
| Rota | Descrição | Acesso |
| :--- | :--- | :--- |
| `/vagas` | Listagem pública de vagas abertas. | Público |
| `/vagas/:id` | Detalhes da vaga e botão de candidatura. | Público |
| `/login` / `/cadastro` | Autenticação do candidato. | Público |
| `/dashboard` | Resumo das candidaturas e status atual. | Privado |
| `/perfil` | Edição de dados pessoais, experiências e currículo. | Privado |
| `/notificacoes` | Histórico de mudanças de status e mensagens. | Privado |

---

## 4. Arquitetura de Dados (Proposta)
Para que o sistema funcione em tempo real e integre Admin + Candidato, recomenda-se a migração do `localStorage` para um backend (ex: **Supabase**).

### Novas Entidades / Campos:
*   **Tabela `candidatos` (Extensão):**
    *   `password_hash`: Para autenticação.
    *   `resume_url`: Link para o PDF do currículo.
    *   `bio`: Breve descrição do candidato.
*   **Tabela `applications` (Candidaturas):**
    *   `candidate_id` (FK)
    *   `job_id` (FK)
    *   `current_step`: Relacionado ao `KanbanColumnId` do Admin.
    *   `notes_for_candidate`: Feedback que o admin decide compartilhar.
*   **Tabela `notifications`:**
    *   `user_id`: Destinatário.
    *   `title` / `message`.
    *   `read`: booleano.
    *   `type`: (ex: 'status_change', 'message').

---

## 5. Sistema de Notificações
A peça central da integração entre Admin e Candidato.

### Fluxo de Notificação por Mudança de Status:
1.  **Ação Admin:** O recrutador move o "Card" do candidato de *Triagem* para *Entrevista Técnica* no Kanban.
2.  **Trigger (Gatilho):** O sistema detecta a mudança de `columnId`.
3.  **Processamento:**
    *   **In-app:** Uma nova entrada é criada na tabela `notifications`.
    *   **E-mail:** Um serviço de e-mail (ex: Resend, SendGrid ou SMTP) é disparado com um template tipo: *"Olá [Nome], seu status na vaga [Vaga] foi atualizado para [Novo Status]!"*.
4.  **Visualização:** O candidato vê um "badge" (bolinha vermelha) no ícone de notificações na plataforma.

---

## 6. Componentes Necessários
*   `JobCardPublic`: Versão simplificada do card de vaga para o público.
*   `ApplicationStatusStepper`: Barra de progresso visual para o candidato ver onde está no processo.
*   `NotificationCenter`: Dropdown ou página para listar alertas recentes.
*   `AuthGuard`: Proteção de rotas para garantir que apenas candidatos logados acessem o dashboard.

---

## 7. Próximos Passos Recomendados
1.  **Backend Integration:** Configurar Supabase ou similar para persistência compartilhada.
2.  **Layout Portal:** Criar uma identidade visual "Clean" e convidativa para o candidato (diferente da densidade de dados do Admin).
3.  **Email Templates:** Definir os textos para cada mudança de fase no Kanban.
