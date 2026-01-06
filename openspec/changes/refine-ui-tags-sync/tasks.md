# Tasks: Refine UI Tagging and Candidate Sync

- [x] **Scaffold Requirements Selector**: Create `components/RequirementsSelector.tsx` with a curated list of common job requirements (e.g., "Inglês Avançado", "React", "Node.js", "Scrum", "Proativo") and logic to toggle them.
- [x] **Update Admin Job Forms**: Replace `DynamicListInput` for Requirements in `CreateJob.tsx` and `EditJob.tsx` with `RequirementsSelector`.
- [x] **Enhance Candidate Settings UI**:
    - [x] Add "Habilidades" (Skills) section using a tag selector.
    - [x] Add "Experiência Profissional" (Experience) list editor (Company, Role, Dates).
    - [x] Add "Formação Acadêmica" (Education) list editor (Institution, Degree, Dates).
    - [x] Add "Idiomas" (Languages) selector.
- [x] **Update Candidate Sync Logic**:
    - [x] Verify `CandidateService.updateProfile` handles these new fields (likely packing into `metadata` or specific columns).
    - [x] Ensure Admin `QuickViewDrawer` displays these new fields.
- [x] **Validation**: Verify data persistence and UI alignment with "neo-brutalist/street" style (cards/tags).
