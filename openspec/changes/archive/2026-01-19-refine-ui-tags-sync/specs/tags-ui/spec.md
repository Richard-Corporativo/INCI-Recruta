# Spec: Tags UI for Jobs

## ADDED Requirements

#### Scenario: Selecting Job Requirements
-   **Given** I am an Admin creating/editing a job
-   **When** I view the "Requisitos" section
-   **Then** I see a cloud of common requirement tags (e.g., "Ensino Superior", "Inglês", "Híbrido", "React").
-   **And** I can click to toggle them ON/OFF.
-   **And** I can still add a custom requirement if needed (via a distinct "Add" button or input).
-   **And** the layout is flowing (`flex-wrap`), not a vertical column list.

#### Scenario: Selecting Job Benefits
-   **Given** I am an Admin creating/editing a job
-   **When** I view the "Benefícios" section
-   **Then** I see the `BenefitsSelector` I previously created.
-   **And** it uses a flowing layout (already refined in Step 711).

