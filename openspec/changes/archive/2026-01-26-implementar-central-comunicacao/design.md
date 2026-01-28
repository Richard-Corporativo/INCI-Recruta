# Design: Central de Comunicação Integrada

## Visão Geral
Sistema centralizado de comunicação com candidatos via e-mail, mantendo histórico completo, templates padronizados e auditoria rigorosa.

## Arquitetura em Fases

### MVP (Fase 1) - Essencial
1. **Envio de e-mail pelo perfil do candidato** (Admin/Qualidade)
2. **Templates prontos** (5 modelos base)
3. **Histórico por candidato** (e por vaga)
4. **Auditoria completa** (quem, quando, qual vaga, qual template)

### Fase 2 - Alto Valor
1. **Automação por evento** (mudança de etapa → e-mail opcional)
2. **Agendamento** (enviar em data/hora específica)
3. **Upload/solicitação de documentos** via link seguro
4. **Rastreamento** (entregue/aberto/falhou)

## Templates Padronizados

### 5 Templates Base (MVP)
1. **Convite para entrevista**
   - Variáveis: {{nome}}, {{vaga}}, {{data}}, {{hora}}, {{link}}, {{local}}
   
2. **Solicitação de documentos**
   - Variáveis: {{nome}}, {{vaga}}, {{lista_documentos}}, {{prazo}}
   
3. **Retorno / Reprovação**
   - Variáveis: {{nome}}, {{vaga}}, {{feedback_opcional}}
   
4. **Confirmação de candidatura recebida**
   - Variáveis: {{nome}}, {{vaga}}, {{area}}, {{proximos_passos}}
   
5. **Próximos passos / Atualização de status**
   - Variáveis: {{nome}}, {{vaga}}, {{status_atual}}, {{acao_esperada}}

### Regras dos Templates
- **Campos variáveis (placeholders):** {{nome}}, {{vaga}}, {{area}}, {{data}}, {{hora}}, {{link}}, {{assinatura}}
- **Versionamento:** Cada template tem versão para auditoria
- **Personalização:** Permitir edição antes de enviar (sem quebrar padrão)
- **Validação:** Garantir que placeholders obrigatórios sejam preenchidos

## UI/UX

### No Perfil do Candidato (Admin/Qualidade)

#### Bloco "Comunicação"
```
┌─────────────────────────────────────────┐
│ 📧 Comunicação                          │
├─────────────────────────────────────────┤
│ [+ Enviar E-mail]                       │
│                                         │
│ Histórico de Mensagens                  │
│ ┌─────────────────────────────────────┐ │
│ │ 📨 26/01 14:20 - Convite Entrevista │ │
│ │    Enviado por: Maria (Qualidade)   │ │
│ │    Status: ✓ Entregue               │ │
│ │    Vaga: Desenvolvedor Full Stack   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Modal de Envio
```
┌─────────────────────────────────────────┐
│ Enviar E-mail para João Silva           │
├─────────────────────────────────────────┤
│ Template: [Convite para entrevista ▼]   │
│                                         │
│ Assunto: Convite para Entrevista -     │
│          Desenvolvedor Full Stack       │
│                                         │
│ Variáveis:                              │
│ Data: [26/01/2026]  Hora: [14:00]      │
│ Local: [Remoto - Google Meet]          │
│ Link: [https://meet.google.com/...]    │
│                                         │
│ Mensagem Adicional (opcional):         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Preview: [👁️ Visualizar]                │
│                                         │
│ [Cancelar]  [📤 Enviar Agora]           │
└─────────────────────────────────────────┘
```

### Histórico de Mensagens (Timeline)
Cada entrada mostra:
- **Data/hora** de envio
- **Assunto** do e-mail
- **Template usado** (nome + versão)
- **Enviado por** (Nome do usuário + role)
- **Status** (enviado/entregue/aberto/falhou)
- **Preview** do conteúdo (expandível)
- **Relacionado à vaga** (se aplicável)

## Governança e Permissões

### Matriz de Permissões
| Ação | Admin | Qualidade | Manager |
|------|-------|-----------|---------|
| Enviar para qualquer candidato | ✓ | ✓ | ✗ |
| Enviar para candidatos de suas vagas | ✓ | ✓ | ✓ |
| Usar todos os templates | ✓ | ✓ | ✗ |
| Usar templates limitados (convite) | ✓ | ✓ | ✓ |
| Criar/editar templates | ✓ | ✓ | ✗ |
| Ver histórico completo | ✓ | ✓ | Apenas suas vagas |
| Reprovar candidato via e-mail | ✓ | ✓ | ✗ (requer aprovação) |

### Auditoria Obrigatória
Cada envio registra:
- `template_id` + `version`
- `subject` (assunto final)
- `actor` (user_id + nome + role)
- `candidate_id` + `candidate_name`
- `job_id` + `job_title` (se aplicável)
- `timestamp` (ISO 8601)
- `status` (pending/sent/delivered/opened/failed)
- `error_message` (se falhou)
- `metadata` (variáveis usadas, personalizações)

## Integração de Envio

### Provider Recomendado
- **MVP:** SMTP básico ou Resend (simples e confiável)
- **Produção:** SendGrid ou AWS SES (rastreamento avançado)

### EmailService (Isolado)
```typescript
interface EmailService {
  sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    metadata: {
      candidateId: string;
      jobId?: string;
      templateId: string;
      userId: string;
    }
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}
```

### Tratamento de Falhas
1. **Se falhar:**
   - Salvar no histórico como "falhou"
   - Registrar erro detalhado
   - Permitir "re-enviar" com 1 clique
   
2. **Fila (Fase 2):**
   - Usar queue (BullMQ/Inngest) para não depender do request
   - Retry automático (3 tentativas)
   - Dead letter queue para falhas persistentes

## Auto-preenchimento de Dados

### Dados Dinâmicos (Reduzir trabalho manual)
O sistema auto-preenche:
- Nome do candidato
- Nome da vaga
- Nome do gestor responsável
- Local/modalidade da vaga
- Link da vaga ou painel do candidato
- Assinatura padrão (configurável por usuário)

### Exemplo de Renderização
```
Template: "Olá {{nome}}, você foi selecionado para {{vaga}}..."
Dados: { nome: "João Silva", vaga: "Dev Full Stack" }
Resultado: "Olá João Silva, você foi selecionado para Dev Full Stack..."
```

## Solicitação de Documentos

### MVP (Simples)
E-mail pedindo documento com orientação para responder por e-mail.

### Fase 2 (Recomendado)
1. **Gerar link único e temporário:**
   - `/candidato/upload-documentos?token=abc123`
   - Token expira em 7 dias
   
2. **Candidato envia:**
   - RG/CPF
   - Comprovante de residência
   - Currículo atualizado
   - Portfólio
   
3. **Sistema salva:**
   - Arquivos no storage
   - Marca como "recebido" no perfil
   - Notifica Qualidade

## Automação por Evento (Opt-in)

### Gatilhos Possíveis
| Evento | Template Sugerido | Automático? |
|--------|-------------------|-------------|
| Candidatura recebida | Confirmação | Checkbox por vaga |
| Movido para "Entrevista" | Convite | Checkbox |
| Movido para "Reprovado" | Retorno | Checkbox |
| Movido para "Finalista" | Próximos passos | Checkbox |
| Vaga pausada | Atualização status | Manual |

### Implementação MVP
- **Checkbox na configuração da vaga:** "Enviar e-mail automático ao mover para [etapa]"
- **Não 100% automático:** Qualidade pode desabilitar por vaga
- **Preview antes de enviar:** Opção de revisar antes do envio automático

## Métricas e Relatórios

### KPIs para Qualidade
1. **Tempo médio de resposta ao candidato** (SLA comunicação)
   - Meta: < 24h para primeira resposta
   
2. **Quantidade de e-mails enviados por vaga**
   - Identificar vagas com comunicação excessiva
   
3. **Taxa de falha de envio**
   - Meta: < 1%
   
4. **Taxa de abertura** (Fase 2)
   - Identificar templates com baixo engajamento
   
5. **Motivos comuns de reprovação**
   - Se padronizar feedback em templates

### Dashboard de Comunicação
```
┌─────────────────────────────────────────┐
│ 📊 Métricas de Comunicação (Jan/2026)  │
├─────────────────────────────────────────┤
│ E-mails Enviados: 342                   │
│ Taxa de Entrega: 99.1%                  │
│ Tempo Médio de Resposta: 18h           │
│                                         │
│ Templates Mais Usados:                  │
│ 1. Convite Entrevista (45%)            │
│ 2. Confirmação Candidatura (28%)       │
│ 3. Retorno/Reprovação (18%)            │
└─────────────────────────────────────────┘
```

## Banco de Dados

### Tabelas Principais

#### `email_templates`
```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT, -- fallback plain text
  variables JSONB, -- lista de placeholders obrigatórios
  version INTEGER DEFAULT 1,
  category TEXT, -- 'interview', 'rejection', 'update', etc.
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `communication_logs`
```sql
CREATE TABLE communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  template_id UUID REFERENCES email_templates(id),
  template_version INTEGER,
  
  type TEXT NOT NULL, -- 'email', 'sms' (futuro)
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  
  status TEXT NOT NULL DEFAULT 'pending', -- pending/sent/delivered/opened/failed
  message_id TEXT, -- ID do provider (SendGrid/SES)
  error_message TEXT,
  
  metadata JSONB, -- variáveis usadas, personalizações
  sent_at TIMESTAMPTZ DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ
);

CREATE INDEX idx_comm_logs_candidate ON communication_logs(candidate_id);
CREATE INDEX idx_comm_logs_job ON communication_logs(job_id);
CREATE INDEX idx_comm_logs_user ON communication_logs(user_id);
CREATE INDEX idx_comm_logs_status ON communication_logs(status);
```

#### `scheduled_emails` (Fase 2)
```sql
CREATE TABLE scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  template_id UUID NOT NULL REFERENCES email_templates(id),
  
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending/sent/cancelled
  
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Segurança

### Proteções Implementadas
1. **Rate limiting:** Máximo 50 e-mails/hora por usuário
2. **Validação de destinatário:** Apenas candidatos válidos
3. **Sanitização de HTML:** Prevenir XSS em templates
4. **Tokens seguros:** Para links de upload (JWT com expiração)
5. **Auditoria completa:** Rastreabilidade total

### Compliance (LGPD)
- Candidato pode solicitar histórico de comunicações
- Opção de "opt-out" de comunicações não-essenciais
- Retenção de logs por 2 anos (configurável)
