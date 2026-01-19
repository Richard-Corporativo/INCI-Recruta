# Tasks: Centralize Data Storage

Planned sequence of tasks to implement centralized localStorage persistence.

## 1. Foundation
- [x] Create `src/lib/storage.ts` with general `StorageService` logic. <!-- id: 1 -->
- [x] Define shared Types for Jobs, Candidates, Roles and Audit Logs in `src/types.ts`. <!-- id: 2 -->
- [x] Implement `initializeData()` function to migrate hardcoded mocks to `localStorage`. <!-- id: 3 -->

## 2. Hooks & State Management
- [x] Create `src/hooks/useJobs.ts` to manage Vagas. <!-- id: 4 -->
- [x] Create `src/hooks/useCandidates.ts` to manage Candidatos. <!-- id: 5 -->
- [x] Create `src/hooks/useRoles.ts` to manage Cargos. <!-- id: 6 -->

## 3. Component Refactoring
- [x] Refactor `Dashboard.tsx` to use `useJobs` and `useCandidates` for KPIs. <!-- id: 7 -->
- [x] Refactor `Jobs.tsx` to read/write jobs from `useJobs`. <!-- id: 8 -->
- [x] Refactor `Kanban.tsx` to read/write candidates from `useCandidates`. <!-- id: 9 -->
- [x] Refactor `Roles.tsx` to use `useRoles`. <!-- id: 10 -->
- [x] Refactor `CreateJob.tsx` and `CreateRole.tsx` to persist new entries. <!-- id: 11 -->

## 4. Verification
- [x] Verify that a page reload preserves all changes. <!-- id: 12 -->
- [x] Verify that creating a job in "Create Job" appears in the "Jobs" list immediately. <!-- id: 13 -->
- [x] Verify that moving a candidate in Kanban updates the counts in the Dashboard. <!-- id: 14 -->
