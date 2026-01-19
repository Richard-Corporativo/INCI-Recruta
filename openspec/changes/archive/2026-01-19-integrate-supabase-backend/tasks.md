# Tasks: Supabase Integration

## 1. Setup & Configuration
- [x] 1.1 Install dependencies: `npm install @supabase/supabase-js`.
- [x] 1.2 Create `src/lib/supabase.ts` client initialization.
    - [x] Define `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`.
- [x] 1.3 Create SQL Init Script (`db_init.sql`) in `docs/` reflecting the Design Schema.

## 2. Authentication Refactor
- [x] 2.1 Update `AuthContext.tsx`:
    - [x] Replace `localStorage` mock logic with `supabase.auth` listeners.
    - [x] Implement `login`, `logout` using Supabase SDK.
    - [x] Fetch user profile from `public.users` on session change.

## 3. Service Layer Refactor (Async Migration)
- [x] 3.1 Create `src/services/` directory to house domain services (replacing monolithic `StorageService`).
    - [x] `JobService.ts`: `getJobs`, `createJob`, `updateJob`.
    - [x] `CandidateService.ts`: `getCandidates`, `addCandidate`, `moveCandidate`.
- [x] 3.2 Update `lib/storage.ts` to log warnings or forward to new services (Transition phase).

## 4. UI/Component Updates (Batch 1: Jobs)
- [x] 4.1 Update `JobsList.tsx` (Admin) to use `JobService` (async).
    - [x] Add `isLoading` state.
- [x] 4.2 Update `JobDetails.tsx` to fetch single job from DB.

## 5. UI/Component Updates (Batch 2: Candidates)
- [x] 5.1 Update `KanbanBoard` to fetch candidates asynchronously.
- [x] 5.2 Update `JobApplication.tsx` to submit to Supabase.

## 6. Cleanup
- [x] 6.1 Remove `StorageService` mock data initialization (StorageService left as deprecated fallback).
- [x] 6.2 Update `README` / `project.md` to reflect Backend dependency.
