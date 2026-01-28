# Spec: Notificações de Cadastro Espontâneo

## ADDED Requirements

### Requirement: Detecção de Cadastro Espontâneo
The system SHALL distinguish between an application for a specific vacancy and a registration in the Talent Bank.
#### Scenario: Cadastro sem ID de Vaga
- **Given** um candidato preenchendo o formulário de candidatura.
- **When** o formulário é enviado sem um `jobId`.
- **Then** o sistema deve disparar a rotina de notificação ao RH.

### Requirement: Conteúdo da Notificação
The email sent to RH SHALL contain essential data for immediate screening.
#### Scenario: E-mail formatado
- **Then** o assunto deve ser "Novo cadastro no Banco de Talentos".
- **And** o corpo deve incluir Nome, E-mail, Localização (se informada) e um link direto para o Perfil no Admin.

### Requirement: Proteção contra Spam
The system SHALL NOT overload the HR inbox with repetitive notifications.
#### Scenario: Cadastro duplicado em curto período
- **Given** que uma notificação já foi enviada para o e-mail `candidato@teste.com` há menos de 10 minutos.
- **When** um novo cadastro ocorrer com o mesmo e-mail.
- **Then** a nova notificação por e-mail deve ser suprimida ou agrupada.
