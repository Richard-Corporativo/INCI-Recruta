# Capability: Candidate Portal Sync

## MODIFIED Requirements
### Requirement: Authentication-Aware Public Header
The public job board header must dynamically adapt based on the user's login state.

#### Scenario: Unauthorized user views job board
- **Given** a guest visitor.
- **Then** the header displays "Entrar" and "Cadastrar-se" buttons.

#### Scenario: Authenticated candidate views job board
- **Given** a logged-in user with role 'candidate'.
- **Then** the header displays the user's avatar, name, and a link to "Meu Painel" and "Sair".

### Requirement: Unified Application Persistence
Candidate applications must be linked to a single user profile to avoid data fragmentation.

#### Scenario: Authenticated user applies for a job
- **Given** a logged-in candidate already in the system.
- **When** they apply for a new job.
- **Then** the system pre-fills the form with their current profile data.
- **Then** it creates a record in `candidates` linked to their existing `user_id`.
- **Then** it updates any new information (like a new phone number) back to the `public.users` table.
