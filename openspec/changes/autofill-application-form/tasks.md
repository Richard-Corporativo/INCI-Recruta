# Tasks: Autofill for Logged-In Candidates

## 1. Preparation
- [x] 1.1 Review `JobApplication.tsx` current state handling.
- [x] 1.2 Identify where Candidate Profile data comes from (currently `public.users` or a separate table?). *Note: We need to ensure we fetch Phone/LinkedIn/Portfolio if available.*

## 2. Implementation: JobApplication.tsx
- [x] 2.1 Integrate `useAuth` hook (or `supabase.auth`) to detect session.
- [x] 2.2 Create `useEffect` to pre-fill `formData` when user is authenticated.
    - Fields: Name, Email, Phone, LinkedIn, Portfolio.
- [x] 2.3 Add "Authenticated as [Name]" Banner at the top of the form.
- [x] 2.4 Conditionals to Hide "Password" / "Create Account" fields if logged in.
- [x] 2.5 Update `handleSubmit` to skip User Creation step if `userId` exists.

## 3. Testing
- [ ] 3.1 Test as Guest (clean state) -> Should see full form.
- [ ] 3.2 Test as Logged In User -> Should see pre-filled form, no password fields.
