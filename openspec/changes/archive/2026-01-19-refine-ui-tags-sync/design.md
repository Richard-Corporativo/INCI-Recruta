# Design: Tagging UI & Candidate Data Model

## Visual Design Strategy
-   **Tagging/Selection**: Instead of `input + enter`, use a layout of pre-defined "Chips" (Cards) that are clickable. 
    -   **State**: Selected = Filled Color (Primary). Unselected = Outline/Gray.
    -   **Layout**: `flex flex-wrap gap-2` (Flowing) instead of columns.
-   **Candidate Profile**: Use the "Card" metaphor. Experience/Education items should be distinct cards with "Edit/Delete" actions.

## Data Model Changes
-   **Job Requirements**: Store as `text[]` or `json`. No schema change needed if column is `text` (we just join/split). ideally `text[]`.
-   **Candidate Profile**:
    -   Schema currently maps `Candidate` to `public.users`.
    -   We need to persist `skills` (text[]), `experience` (jsonb), `education` (jsonb), `languages` (text[]) in `public.users`.
    -   **Strategy**: Use a `metadata` or `profile_data` JSONB column in `public.users` if specific columns don't exist. Checking schema is required.

## Components
-   `TagSelector`: Generic component for selecting strings from a preset list + custom add.
-   `ListEditor`: Component for complex items (Education/Experience) with form modal or inline expansion.

