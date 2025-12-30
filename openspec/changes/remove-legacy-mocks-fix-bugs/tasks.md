# Tasks: Remove Legacy Mocks and Fix Bugs

## Phase 1: Authentication & Sidebar
- [x] Add `password` field to `User` type in `types.ts` and `StorageService` seed data.
- [x] Create `hooks/useAuth.ts` and `context/AuthContext.tsx`.
- [x] Refactor `Login.tsx` to use the new `AuthContext` and validate against stored users.
- [x] Update `Sidebar.tsx` to display `currentUser` data from `AuthContext`.
- [x] Implement theme persistence in `localStorage`.

## Phase 2: Dynamic Dashboard
- [x] Add `hired_at` (ISO date) to `Candidate` type.
- [x] Update `Dashboard.tsx` to calculate average time to hire dynamically.
- [x] Implement state management for Dashboard filters (Period, Dept, Manager).
- [x] Connect filters to KPI calculations and lists.
- [x] Replace hardcoded "Ana Silva" option with dynamic list of managers.

## Phase 3: Settings & Cleanups
- [x] Extrapolate `InviteUserModal` into a standalone component or fully dynamicize the inline version.
- [x] Connect "Adicionar usuário" and "Convidar" flows to the `useUsers` hook.
- [x] Update `RequestAccess.tsx` to remove hardcoded name placeholders and mock email responses.
- [x] Perform a global grep for hardcoded strings and replace them with dynamic data.

## Phase 4: Validation
- [x] Verify that new users can login with their credentials.
- [x] Validate that Dashboard metrics change when filters are applied.
- [x] Ensure that Sidebar reflects the correct user after login.
- [x] Verify persistence across full browser reloads.
