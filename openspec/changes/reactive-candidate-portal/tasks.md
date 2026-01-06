# Tasks: Reactive Candidate Portal Refactor

An ordered list of tasks to implement the reactive sync and optimization of the candidate portal.

## 1. Setup & Hook Refactoring
- [x] Migrate `useCandidateData` to `useQuery` and `useMutation`.
    - [x] Implement `queryKey` logic based on `auth.user.id`.
    - [x] Port `refreshData` logic into the `queryFn`.
    - [x] Port `updateProfile` into `useMutation` with optimistic updates.
- [x] Implement database-to-interface mapping directly in the service layer or `queryFn`.

## 2. Component Integration
- [x] Update `CandidateDashboard.tsx` to use the refactored hook.
    - [x] Remove manual `useEffect` logic for initializing `formData`.
    - [x] Adjust `handleSave` to use the mutation.
- [x] Update `CandidateSettings.tsx` to use the refactored hook.
- [x] Update `MyApplications.tsx` to use the refactored hook.

## 3. UI/UX & Performance Polish
- [x] Apply `// --> otimizado` comments for all performance improvements.
- [x] Ensure all buttons and interactive elements follow the 200ms transition and hit target rules.
- [x] Verify Skeleton screens are correctly timed with React Query's `isLoading` state.

## 4. Validation
- [x] Verify that navigating between Dashboard and Settings preserves state.
- [x] Verify that profile updates are visible across pages without F5.
- [x] Run `npm run lint` and verify no regressions.
