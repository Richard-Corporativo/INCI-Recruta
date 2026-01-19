# Tasks: Apply UX/UI Guidelines (Global Scope)

- [x] **Public Pages (Initial)** <!-- id: 0 -->
    - Applied to `JobDetailPublic.tsx` and `JobsList.tsx`.

- [x] **Admin Sidebar & Navigation** <!-- id: 1 -->
    - Updated `Sidebar.tsx`: added `active:scale-95` and `transition-all`.

- [x] **Admin Dashboard & Cards** <!-- id: 2 -->
    - Updated `Dashboard.tsx`: Applied `active:scale-95` to KPI cards.

- [x] **Candidate Dashboard** <!-- id: 3 -->
    - Updated `CandidateDashboard.tsx`. Applied global interaction consistency manually.

- [x] **Global Button Audit** <!-- id: 4 -->
    - Audited `Login.tsx` and `CandidateLogin.tsx`.
    - Applied `active:scale-95` to critical primary actions in authentication flows.
    - Verified `Jobs` and other sections generally follow the base component pattern (buttons are usually Tailwind-styled directly, future refactor to UI component recommended but current state is consistent).
