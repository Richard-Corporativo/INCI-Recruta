## ADDED Requirements

### Requirement: Integrated Email Sending
The system MUST allow Admin and Qualidade users to send emails to candidates directly from the candidate's profile to maintain a centralized communication log.

#### Scenario: Sending an email from candidate profile
- **WHEN** a Qualidade user is on a Candidate's profile
- **THEN** they can click "Enviar E-mail"
- **AND** select a predefined template from a dropdown
- **AND** the system auto-fills variables ({{nome}}, {{vaga}}, etc.)
- **AND** they can add an optional custom message
- **AND** preview the final email before sending
- **AND** click "Enviar Agora" to send immediately

#### Scenario: Permission validation
- **WHEN** a Manager tries to send an email
- **THEN** they can only send to candidates from jobs they manage
- **AND** they can only use limited templates (e.g., "Convite Entrevista")
- **AND** they cannot use "Retorno/Reprovação" template without approval

### Requirement: Email Templates Management
The system MUST support manageable email templates with variables to standardize communication while allowing personalization.

#### Scenario: Creating a new template
- **WHEN** an Admin accesses Settings > Templates de E-mail
- **THEN** they can create a new template
- **AND** define name, subject, and HTML body
- **AND** insert placeholders ({{nome}}, {{vaga}}, {{data}}, {{hora}}, {{link}}, {{assinatura}})
- **AND** mark which placeholders are required
- **AND** categorize the template (interview, rejection, update, etc.)
- **AND** save with automatic versioning

#### Scenario: Using template variables
- **WHEN** a Qualidade user selects "Convite para Entrevista" template
- **THEN** the system auto-fills:
  - {{nome}} with candidate's name
  - {{vaga}} with job title
  - {{assinatura}} with user's signature
- **AND** prompts for required variables ({{data}}, {{hora}}, {{link}})
- **AND** validates all required placeholders are filled before allowing send

#### Scenario: Template versioning
- **WHEN** an Admin edits an existing template
- **THEN** the system creates a new version (v2, v3, etc.)
- **AND** keeps previous versions for audit
- **AND** logs show which version was used for each sent email

### Requirement: Communication History & Timeline
The system MUST automatically log every sent email into the candidate's activity timeline with complete audit trail.

#### Scenario: Viewing communication history
- **WHEN** a recruiter views the candidate profile
- **THEN** they see a "Comunicação" section
- **AND** it displays a chronological timeline of all emails
- **AND** each entry shows:
  - Date/time sent
  - Subject line
  - Template used (name + version)
  - Sent by (user name + role)
  - Status (enviado/entregue/falhou)
  - Related job (if applicable)
- **AND** they can expand to see full content preview

#### Scenario: Filtering communication history
- **WHEN** a user views the communication timeline
- **THEN** they can filter by:
  - Date range
  - Template type
  - Sent by user
  - Related job
  - Status (sent/delivered/failed)

### Requirement: Communication Audit
The system MUST log complete metadata for every email sent for compliance and troubleshooting.

#### Scenario: Audit log capture
- **WHEN** any email is sent
- **THEN** the system logs:
  - template_id + version
  - subject (final rendered)
  - actor (user_id + name + role)
  - candidate_id + candidate_name
  - job_id + job_title (if applicable)
  - timestamp (ISO 8601)
  - status (pending/sent/delivered/failed)
  - message_id (from email provider)
  - error_message (if failed)
  - metadata (variables used, customizations)

#### Scenario: Reviewing audit trail
- **WHEN** an Admin needs to investigate a communication issue
- **THEN** they can access the communication_logs table
- **AND** see exactly who sent what, when, and to whom
- **AND** verify the template version used
- **AND** see delivery status and any errors

### Requirement: Email Delivery Handling
The system MUST handle email delivery failures gracefully and provide retry mechanisms.

#### Scenario: Successful email delivery
- **WHEN** an email is sent successfully
- **THEN** the status is updated to "sent"
- **AND** when the provider confirms delivery, status becomes "delivered"
- **AND** the timeline shows a green checkmark

#### Scenario: Email delivery failure
- **WHEN** an email fails to send
- **THEN** the status is marked as "failed"
- **AND** the error message is logged
- **AND** the timeline shows a red X with error details
- **AND** a "Re-enviar" button appears
- **AND** clicking it retries the send with the same content

#### Scenario: Rate limiting protection
- **WHEN** a user tries to send more than 50 emails in 1 hour
- **THEN** the system blocks the send
- **AND** shows an error: "Limite de envios atingido. Tente novamente em X minutos."

### Requirement: Template Categories & Organization
The system MUST organize templates by category for easy discovery and governance.

#### Scenario: Template categorization
- **WHEN** templates are listed
- **THEN** they are grouped by category:
  - Convite para Entrevista
  - Solicitação de Documentos
  - Retorno/Reprovação
  - Confirmação de Candidatura
  - Próximos Passos/Atualização
- **AND** each category shows count of active templates
- **AND** inactive templates are hidden by default

### Requirement: Auto-fill Candidate Data
The system MUST automatically populate email templates with candidate and job data to reduce manual work.

#### Scenario: Auto-filling template variables
- **WHEN** a Qualidade user selects a template
- **THEN** the system automatically fills:
  - {{nome}} from candidate.name
  - {{vaga}} from job.title
  - {{area}} from job.department
  - {{assinatura}} from user's configured signature
- **AND** leaves manual fields empty for user input ({{data}}, {{hora}}, {{link}})
- **AND** highlights unfilled required variables in red

### Requirement: Communication Metrics Dashboard
The system MUST provide metrics on communication activity for Qualidade team to monitor performance.

#### Scenario: Viewing communication metrics
- **WHEN** a Qualidade user accesses the Communication Dashboard
- **THEN** they see:
  - Total emails sent (this month)
  - Delivery success rate (%)
  - Average response time to candidates
  - Most used templates (top 5)
  - Emails sent per job
  - Failed deliveries (count + reasons)
- **AND** can filter by date range
- **AND** can export to CSV

#### Scenario: SLA monitoring
- **WHEN** viewing metrics
- **THEN** the system shows "Tempo médio de primeira resposta"
- **AND** highlights if it exceeds 24h (SLA breach)
- **AND** shows which jobs have delayed responses
