# Tasks: Central de Comunicação

## 1. Banco de Dados
- [ ] 1.1 Criar tabela `email_templates`: `id`, `name`, `subject`, `body_html`.
- [ ] 1.2 Criar tabela `communication_logs`: `candidate_id`, `user_id`, `type`, `content`, `sent_at`, `message_id`.

## 2. API / Backend
- [ ] 2.1 Criar Edge Function ou integração para envio de e-mail (usando provider externo).
- [ ] 2.2 Implementar webhook para receber status (Entregue, Lido) e replies (se possível).

## 3. Frontend
- [ ] 3.1 Criar ABAs no Perfil do Candidato: "Comunicação".
- [ ] 3.2 UI de envio de e-mail: Seletor de template, editor de texto rico.
- [ ] 3.3 UI de Timeline: Lista cronológica de interações.
- [ ] 3.4 CRUD de Templates (Configurações).
