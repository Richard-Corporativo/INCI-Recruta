# Tasks: Central de Comunicação

## 1. Banco de Dados & Estrutura
- [x] 1.1 Criar tabela `email_templates` com campos: id, name, subject, body_html, body_text, variables (JSONB), version, category, is_active, created_by, timestamps
- [x] 1.2 Criar tabela `communication_logs` com campos: id, candidate_id, job_id, user_id, template_id, template_version, type, subject, content_html, status, message_id, error_message, metadata (JSONB), sent_at, delivered_at, opened_at
- [x] 1.3 Criar índices: candidate_id, job_id, user_id, status
- [x] 1.4 Implementar RLS: Admin/Qualidade veem tudo, Manager apenas suas vagas
- [x] 1.5 Seed inicial: Criar 5 templates base (Convite Entrevista, Solicitação Docs, Retorno/Reprovação, Confirmação, Próximos Passos)

## 2. Backend / API
- [ ] 2.1 Criar `EmailService` isolado com método `sendEmail(to, subject, html, metadata)`
- [ ] 2.2 Integrar provider de e-mail (Resend ou SendGrid)
- [ ] 2.3 Criar Edge Function `send-candidate-email` que:
  - Valida permissões (Admin/Qualidade/Manager)
  - Renderiza template com variáveis
  - Envia via provider
  - Salva em `communication_logs`
- [ ] 2.4 Implementar tratamento de falhas e retry
- [ ] 2.5 Criar RPC `get_candidate_communications(candidate_id)` para histórico
- [ ] 2.6 Criar RPC `get_communication_metrics()` para dashboard

## 3. Templates & Variáveis
- [ ] 3.1 Implementar sistema de placeholders: {{nome}}, {{vaga}}, {{data}}, {{hora}}, {{link}}, {{assinatura}}
- [ ] 3.2 Criar função de renderização de templates com validação de variáveis obrigatórias
- [ ] 3.3 Implementar versionamento de templates
- [ ] 3.4 Criar sanitização de HTML para prevenir XSS

## 4. Frontend - Perfil do Candidato
- [ ] 4.1 Criar componente `CommunicationBlock` no perfil do candidato
- [ ] 4.2 Implementar botão "Enviar E-mail" que abre modal
- [ ] 4.3 Criar `SendEmailModal` com:
  - Dropdown de seleção de template
  - Auto-preenchimento de variáveis
  - Campo "mensagem adicional" (opcional)
  - Preview do e-mail
  - Botão "Enviar Agora"
- [ ] 4.4 Criar `CommunicationTimeline` que mostra:
  - Data/hora
  - Assunto
  - Template usado
  - Enviado por (nome + role)
  - Status (ícone visual)
  - Preview expandível do conteúdo
  - Badge "Relacionado à vaga X"

## 5. Frontend - Gerenciamento de Templates
- [ ] 5.1 Criar página "Configurações > Templates de E-mail"
- [ ] 5.2 Implementar CRUD de templates:
  - Listagem com filtros (categoria, ativo/inativo)
  - Formulário de criação/edição
  - Rich text editor para body_html
  - Seletor de variáveis disponíveis
  - Preview em tempo real
- [ ] 5.3 Implementar controle de versão (histórico de alterações)
- [ ] 5.4 Adicionar validação de placeholders obrigatórios

## 6. Governança & Permissões
- [ ] 6.1 Implementar matriz de permissões:
  - Admin/Qualidade: todos os candidatos, todos os templates
  - Manager: apenas candidatos de suas vagas, templates limitados
- [ ] 6.2 Criar middleware de validação de permissões
- [ ] 6.3 Implementar rate limiting (50 e-mails/hora por usuário)
- [ ] 6.4 Adicionar confirmação antes de enviar e-mails de reprovação

## 7. Auditoria & Métricas
- [ ] 7.1 Garantir log completo de todos os envios em `communication_logs`
- [ ] 7.2 Criar dashboard de métricas:
  - E-mails enviados (total, por período)
  - Taxa de entrega
  - Tempo médio de resposta
  - Templates mais usados
  - E-mails por vaga
- [ ] 7.3 Implementar exportação de relatórios (CSV)

## 8. Testes & Validação
- [ ] 8.1 Testar envio de e-mail com cada template
- [ ] 8.2 Validar auto-preenchimento de variáveis
- [ ] 8.3 Testar permissões (Admin, Qualidade, Manager)
- [ ] 8.4 Validar histórico e timeline
- [ ] 8.5 Testar tratamento de falhas e retry
- [ ] 8.6 Validar rate limiting
- [ ] 8.7 Testar sanitização de HTML

## 9. Documentação
- [ ] 9.1 Documentar uso dos templates (guia para Qualidade)
- [ ] 9.2 Documentar variáveis disponíveis
- [ ] 9.3 Criar guia de boas práticas de comunicação
