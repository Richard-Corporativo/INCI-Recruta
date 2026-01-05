# Proposal: Implement Functional Candidate Portal

The candidate portal and public job pages currently rely on mocked data and hardcoded links. This change will replace these mocks with a functional data layer using `StorageService`, enabling real job applications, profile management, and application tracking.

## Problem
- Public job listings and details use static mock data.
- Job application submission only shows an alert and doesn't save anything.
- Candidate dashboard displays a hardcoded "João da Silva" profile.
- Navigation links between public pages and candidate sections are partially broken or lead to static views.

## Solution
1. **Functional Public Pages**: Connect `JobsList` and `JobDetailPublic` to the synchronized `KEYS.JOBS` store.
2. **Real Applications**: Update `JobApplication` to save a `Candidate` record to `KEYS.CANDIDATES` in `StorageService`.
3. **Candidate Auth**: Implement a mechanism to identify the current candidate (authenticated via `CandidateLogin`) and load their specific data.
4. **Dynamic Candidate Dashboard**: Replace all hardcoded values with data retrieved from the `CANDIDATES` store.
5. **Route Cleanup**: Ensure all "Apply", "View Details", and "Dashboard" links point to active, data-driven routes.
6. **Talent Bank (Banco de Talentos)**: Create a dedicated view in the Admin panel to list all registered candidates, including those who haven't applied to a specific job.
7. **Stage Synchronization**: Explicitly verify that moving a candidate in the Kanban updates their status in the Candidate Portal immediately.

## Success Criteria
- [ ] Users can browse real jobs created in the Admin panel on the public site.
- [ ] Submitting an application creates a new record visible in both the Candidate portal and the Admin Kanban.
- [ ] Candidates can "log in" and see their own application history and status updates from the Admin.
- [ ] Admin has a "Banco de Talentos" view to see candidates not yet linked to any job.
- [ ] No hardcoded "João da Silva" or "UX Designer" strings remain in generic portal components.
