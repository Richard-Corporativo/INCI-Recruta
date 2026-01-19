# Design: Supabase Architecture

## Database Schema
We will map the TypeScript interfaces to PostgreSQL tables.

### Tables
1.  **`public.users`** (Extends `auth.users`)
    *   `id` (UUID, FK to `auth.users`)
    *   `name` (Text)
    *   `role` (Enum: admin, manager, recruiter, etc.)
    *   `avatar` (Text)
    *   `department` (Text)
    *   `permissions` (JSONB for custom permissions)

2.  **`public.jobs`**
    *   `id` (UUID)
    *   `title`, `department`, `location`, `status` (Text/Enum)
    *   `salary_min`, `salary_max` (Numeric)
    *   `description` (Text for context/responsibilities)
    *   `manager_id` (UUID, FK to `users`)

3.  **`public.candidates`**
    *   `id` (UUID)
    *   `job_id` (UUID, FK to `jobs`, Nullable for General Pool)
    *   `name`, `email`, `phone` (Text)
    *   `column_id` (Text - Kanban status)
    *   `details` (JSONB for resume, urls, custom fields)
    *   `user_id` (UUID, FK to `users`, Nullable - if candidate is a registered user)

4.  **`public.feedbacks`**
    *   `id` (UUID)
    *   `candidate_id` (UUID, FK to `candidates`)
    *   `rating` (Int)
    *   `content` (Text)
    *   `created_by` (UUID, FK to `users`)

5.  **`public.roles`** & **`public.audit_logs`**
    *   Standard mapping.

## Authentication Strategy
-   Use `@supabase/supabase-js`.
-   **Login Flow**: `supabase.auth.signInWithPassword`.
-   **Session**: Persisted by Supabase SDK.
-   **Role Management**: On login, fetch profile from `public.users` to set the application context (Admin/Manager).

## Data Access Layer (DAL)
We will refactor `lib/storage.ts` or create `lib/supabase.ts`.
Instead of synchronizing strictly `KEY -> VALUE`, we will implement typed service methods.

*   `JobService.getAll()` -> `supabase.from('jobs').select('*')`
*   `CandidateService.getByJob(jobId)` -> `supabase.from('candidates').select('*').eq('job_id', jobId)`

## Migration Strategy
1.  **Parallel Run**: Keep `StorageService` for a smooth transition or...
2.  **Hard Swap**: Given the `tasks.md` structure, we will perform a Hard Swap. The `StorageService` methods will be rewritten to call Supabase, or replaced by `SupabaseService` calls in the components.
    *   *Preference*: Refactoring `StorageService` content to use Supabase under the hood might minimize UI breakage, but `localStorage` is synchronous and Supabase is Asynchronous. **This will require UI updates to `await` results.**

## UI Implications
-   All `useEffect` data fetching must handle `loading` states.
-   Form submissions (`handleSubmit`) must be `async`.
-   "Offline" mode will no longer work by default.
