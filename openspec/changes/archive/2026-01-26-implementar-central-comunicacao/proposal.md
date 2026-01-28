# Proposta: Central de Comunicação Integrada

## Por que
A comunicação via e-mail está descentralizada (Outlook/Gmail), gerando perda de histórico no ATS e dificultando auditoria. Precisamos centralizar o envio e rastreamento de e-mails dentro do contexto do candidato, com templates padronizados e histórico completo.

**Problemas atuais:**
- Histórico de comunicação perdido fora do sistema
- Falta de padronização nas mensagens
- Impossibilidade de auditar quem enviou o quê
- Retrabalho ao escrever e-mails repetitivos
- Candidatos sem visibilidade do status

## O que muda

### MVP (Fase 1)
1. **Envio de e-mail pelo perfil do candidato** (Admin/Qualidade)
   - Interface integrada no perfil
   - Seleção de template
   - Auto-preenchimento de variáveis
   
2. **5 Templates padronizados:**
   - Convite para entrevista
   - Solicitação de documentos
   - Retorno/Reprovação
   - Confirmação de candidatura
   - Próximos passos/Atualização de status
   
3. **Histórico completo por candidato** (e por vaga)
   - Timeline de todas as comunicações
   - Filtros por tipo, data, enviado por
   
4. **Auditoria rigorosa:**
   - Quem enviou
   - Quando enviou
   - Qual template usou
   - Para qual vaga
   - Status de entrega

### Fase 2 (Alto Valor)
- Automação por evento (mudança de etapa → e-mail)
- Agendamento de envios
- Upload/solicitação de documentos via link seguro
- Rastreamento avançado (aberto/clicado)
- Métricas e relatórios

## Impacto

### Capabilities Afetadas
- **`communication-hub`** (nova) - Sistema completo de comunicação

### Código
- **Backend:** 
  - Integração com provider de e-mail (Resend/SendGrid)
  - Edge Functions para envio e webhooks
  - Tabelas: `email_templates`, `communication_logs`, `scheduled_emails`
  
- **Frontend:**
  - Bloco "Comunicação" no perfil do candidato
  - Modal de envio com preview
  - Timeline de histórico
  - CRUD de templates (Configurações)

### Permissões
- **Admin/Qualidade:** Acesso completo, todos os templates
- **Manager:** Apenas candidatos de suas vagas, templates limitados
- **Candidato:** Visualização do histórico (futuro)

### Métricas
- Tempo médio de resposta ao candidato
- Taxa de entrega de e-mails
- Templates mais utilizados
- E-mails por vaga
