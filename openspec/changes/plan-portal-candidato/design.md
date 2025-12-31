# Design: Candidate Portal Blueprint

## Context
The system needs a public-facing side. The main challenge is the transition from `localStorage` to a shared persistence layer (Supabase) to allow communication between Recruiter (Admin) and Candidate.

## Blueprint: Implementation Lifecycle

### Phase 1: Infrastructure & Shared Data
- **Transition Strategy**: Move from `localStorage` to Supabase.
- **Data Model**:
  - `candidates`: Profile info, auth.
  - `applications`: Links `jobs` and `candidates`, tracks `columnId` (Kanban).
  - `notifications`: Tracks status changes.

### Phase 2: Public Job Board
- **Entry Point**: `/vagas` (Public list).
- **Deep Links**: `/vagas/:id` (Shareable job links).
- **SEO**: Static generation or meta tags for job previews.

### Phase 3: Candidate Authentication
- **Flow**: Sign Up with Resume Upload (Supabase Storage).
- **Dashboard**: Simple overview of active applications.

### Phase 4: Real-time Sync & Notifications
- **Trigger**: Moving a card in Admin Kanban updates `applications.columnId`.
- **Feedback**: Candidates see their progress bar update instantly.

### Phase 5: Polish & Communication
- **Messenger**: (Optional) Direct chat between candidate and recruiter.
- **Emails**: Automated emails for staging transitions.

## Decisions
- **Decision**: Use Supabase for the backend.
  - **Rationale**: Provides Auth, Database, and Real-time out of the box with zero boilerplate.
- **Decision**: Keep Admin and Portal in the same React SPA.
  - **Rationale**: Easier to share types and theme tokens. Use `AuthGuard` to separate access.

## Risks / Trade-offs
- **Risk**: Migration complexity.
- **Mitigation**: Implement a dual-mode storage service that can sync from localStorage to Supabase during a transition period.
