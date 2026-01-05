# Tasks: Implement Functional Candidate Portal

- [x] **Infrastructure: Candidate Data Hook** <!-- id: 0 -->
    - Create `hooks/useCandidateData.ts` to abstract `StorageService` interactions for the portal.
    - Implement `getCurrentCandidate()` and `updateCandidateProfile()`.
    - Add logic for calculating profile completeness.

- [x] **Public Pages: Connect Data** <!-- id: 1 -->
    - Update `JobsList.tsx` to fetch jobs from `localStorage`.
    - Update `JobDetailPublic.tsx` to find job by ID from `localStorage`.
    - Ensure "Apply" buttons link correctly to the application form with job ID.

- [x] **Application Flow: Persistence** <!-- id: 2 -->
    - Refactor `JobApplication.tsx` to save form data as a new `Candidate` object.
    - Implement check for existing candidate profile by email to avoid duplication.
    - Ensure newly created candidates appear in `recruitsys_candidates`.

- [x] **Candidate Portal: Dynamic Data** <!-- id: 3 -->
    - Update `CandidateDashboard.tsx` to use `useCandidateData`.
    - Update `MyApplications.tsx` to filter applications based on candidate email/id.
    - Update `ApplicationDetail.tsx` to show real status updates based on Kanban stage.

- [x] **Authentication: Candidate Login Sync** <!-- id: 4 -->
    - Ensure `CandidateLogin.tsx` correctly sets a "candidate session" (storing current candidate email in `localStorage`).
    - Add `RequireCandidateAuth` component in `App.tsx` to protect `/candidate/*` routes.

- [x] **Admin: Talent Bank (Banco de Talentos)** <!-- id: 5 -->
    - Create `pages/TalentBank.tsx` to list all registered candidates.
    - Add "Banco de Talentos" to the `Sidebar.tsx`.
    - Implement search and simple filters (by name/email).

- [x] **Validation & Polish** <!-- id: 6 -->
    - Verify Kanban in Admin shows applicants from the public site.
    - Cross-check all links in `PublicLayout` and `CandidateLayout`.
    - Final UI alignment with sentence casing guidelines.
