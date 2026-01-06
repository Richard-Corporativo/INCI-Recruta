# Design: Platform Architecture Enhancement

## 1. User Management Architecture
Administrative user creation (Admins, Managers, etc.) cannot be done safely directly from the client.
- **Client-Side**: `UserService.addUser` will trigger a Supabase Edge Function `create-user-admin`.
- **Edge Function**: Will use the Supabase Service Role key to create a user in `auth.users` with the correct metadata and then insert/sync with the `public.users` table.
- **Workflow**: Invite-based or direct creation with a temporary password/link.

## 2. Settings Engine Structure
The `Settings.tsx` page will be refactored into modular components:
- `UserTab`: Handles list and modal for admin team members.
- `PrivilegesTab`: Map roles to permission flags.
- `ScopeTab`: Tree-view or multi-select for managing manager access to departments.
- `AuditTab`: Log viewer specific to structural changes.
- `SystemTab`: Form to update global constants stored in a new `public.system_config` table.

## 3. Unified QuickView Pattern
To improve triage speed, a global `QuickViewDrawer` component will be introduced.
- **State Management**: A global context or dedicated hook `useQuickView` will control which entity is being previewed.
- **Trigger**: Single-click on a table row or Kanban card.
- **Content**:
    - **Candidate**: Resume preview, match score, last comment.
    - **Job**: Summary, key dates, applicant count.
    - **User**: Role, permissions, activity history.

## 4. Candidate Portal Sync
- **Header**: Responsive navbar component that toggles between "Login" and "Profile Dropdown" based on `AuthContext` state.
- **Persistence Logic**: `CandidateService.addCandidate` will now strictly check `auth.uid()` and link the application, updating the `public.users` record if new professional details are provided during application.
