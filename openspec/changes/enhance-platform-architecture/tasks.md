# Tasks: Enhance Platform Architecture

## Phase 1: Authentication & Candidate Flow
- [ ] **Public Header**: Update `App.tsx` navigation to show user profile/logout for authenticated candidates.
- [ ] **Persistence**: Refactor `CandidateService.addCandidate` to ensure single-profile integrity per user.
- [ ] **Profile Expansion**: Update `Candidate` type and UI to include bio, detailed skills, and deeper professional links.

## Phase 2: Admin User Management
- [ ] **Edge Function**: Create `supabase/functions/create-user-admin` to handle secure user creation.
- [ ] **Service Integration**: Update `UserService` to call the new edge function.
- [ ] **Admin UI**: Implement the user creation flow in `Settings.tsx`.

## Phase 3: Settings Modules
- [ ] **Privileges**: Implement RBAC UI and backend mapping for Roles.
- [ ] **Manager Scope**: Create the Department/Job scope selector in Settings.
- [ ] **Audit/System**: Connect existing hooks to the remaining Settings tabs.

## Phase 4: Operations Optimization
- [ ] **QuickView UI**: Develop the `QuickViewDrawer` component.
- [ ] **Job QuickView**: Integrate preview into the Jobs list.
- [ ] **Candidate QuickView**: Integrate preview into the Kanban and Talent Bank.
- [ ] **User QuickView**: Integrate preview into the Settings user list.
