# persistence Specification Delta

## MODIFIED Requirements

### Requirement: [REQ-PERS-001] Cloud-Based Persistence (Supabase)
The application MUST use **Supabase** as the primary data storage backend, replacing `localStorage`.

#### Scenario: First application load
- **Given** the user opens the application
- **When** the application initializes
- **Then** it MUST attempt to connect to the Supabase client
- **And** check for an active user session.

### Requirement: [REQ-PERS-003] CRUD Operations Persistence
All Creation, Update, and Deletion operations MUST persist data to the **Supabase Database**.

#### Scenario: Creating a new job
- **Given** the user is authenticated as a Manager or Admin
- **When** the user submits the "Create Job" form
- **Then** the system MUST send a `POST` request (via Supabase SDK) to the `jobs` table
- **And** verify the success response before updating the UI.

## ADDED Requirements

### Requirement: [REQ-PERS-004] Real-Time Synchronization (Optional)
The system SHOULD reflect data changes made by other users in real-time or near real-time.

#### Scenario: Remote update
- **Given** two users are viewing the Kanban board
- **When** User A moves a candidate
- **Then** User B SHOULD see the candidate move without refreshing the page (via Supabase Realtime subscriptions).

### Requirement: [REQ-PERS-005] Authentication & Security
The system MUST enforce access control at the database level using Row Level Security (RLS).

#### Scenario: Unauthorized Access attempt
- **Given** an authenticated user with "Recruiter" role
- **When** they attempt to delete a `System Setting` (Admin only) via API
- **Then** the Supabase Database MUST reject the request with a `403 Forbidden` error.
