## Context
The application is a recruitment management system (REMS) composed of an Admin Panel and a Candidate Portal. Currently, the integration between these two sides is mocked. This change aims to unify the data layer using `StorageService` and `localStorage`, ensuring a single source of truth for jobs and candidates.

## Decisions
- **Persistence Layer**: Use `StorageService` with `localStorage` keys `recruitsys_jobs` and `recruitsys_candidates`.
- **Identity (Candidate)**: Use `recruitSys_candidate_email` in `localStorage` as a simple unique identifier for candidate sessions. This email will be used to filter applications and load profile data.
- **Data Hook**: Introduce `useCandidateData.ts` to centralize business logic for the portal (calculating profile completeness, fetching specific applications, etc.).
- **Admin UI Expansion**: Add a "Banco de Talentos" module to the admin sidebar and dashboard to view the global pool of talent.

## Risks / Trade-offs
- **Local Storage Limitations**: Data is client-side only and will be lost if the user clears browser data. Mitigation: A future capability for backup/restore or real backend integration is planned.
- **Security**: Current candidate identification is strictly client-side. This is acceptable for the current "demo/functional prototype" scope but would require JWT/Server-side auth for production.
