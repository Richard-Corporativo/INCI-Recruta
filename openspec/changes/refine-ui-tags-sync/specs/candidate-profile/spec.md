# Spec: Candidate Profile & Sync

## ADDED Requirements

#### Scenario: Editing Candidate Skills
-   **Given** I am a Candidate on `/candidate/settings`
-   **When** I scroll to "Complementary Info"
-   **Then** I see a "Habilidades" section.
-   **And** I can select skills from a list or type to add.

#### Scenario: Editing Experience/Education
-   **Given** I am a Candidate
-   **When** I add an Experience item
-   **Then** I can enter Company, Role, Start/End Date, Description.
-   **And** it renders as a "Card" in my profile view.

#### Scenario: Syncing to Admin
-   **Given** a Candidate has saved Skills/Experience
-   **When** an Admin views this Candidate in `QuickViewDrawer` (Kanban/Tables)
-   **Then** the Admin sees these new fields populated.
-   **And** the data is persisted in Supabase.
