# Proposal: Refine UI Tagging and Candidate Profile Sync

## Context
The user has expressed dissatisfaction with the current "text-typing" experience for adding Job Requirements and Benefits. They desire a "Card/Tag" selection model where they do not have to type manually, avoiding columns. Additionally, they noted that the Candidate Profile is missing fields ("informações que pedi") and synchronization with the Admin panel is incomplete.

## Goals
1.  **Refine Job/Role Creation UI**: Replace typing-heavy inputs for Requirements with a visual "Tag Selection" interface (similar to the Benefits selector implemented), defaulting to a curated list of requirements that can be toggled.
2.  **Enhance Candidate Profile & Sync**: Add missing "Experience", "Education", "Skills", and "Languages" sections to the Candidate Profile settings, ensuring these fields sync correctly to `public.users` and are viewable in the Admin's `QuickViewDrawer`.
3.  **Visual Alignment**: Ensure "Card/Tag" styling is used consistently across Admin and Candidate views, avoiding rigid column structures where flowing layouts are preferred.

## Scope
-   **Admin**: `CreateJob.tsx`, `EditJob.tsx` (Components: `BenefitsSelector`, `RequirementsSelector`).
-   **Candidate**: `CandidateSettings.tsx` (New sections for Education/Experience/Skills).
-   **Database**: Verify `public.users` schema supports JSONB or separate tables for these lists, or map them to existing fields. (Likely need `candidate_profiles` table or JSON column in `public.users` if not present).

## Risks
-   **Data Migration**: If existing text-based requirements are unstructured, they may not map cleanly to new "Tags". We will treat existing text as "Custom Tags".
-   **Schema Limits**: `public.users` might not store complex arrays. We may need to use a `metadata` JSONB column or a separate `candidates` table (which seems to exist as `Candidate` service implies).

