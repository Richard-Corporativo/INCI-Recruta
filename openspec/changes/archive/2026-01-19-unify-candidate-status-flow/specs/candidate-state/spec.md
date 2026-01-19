# Candidate State Management

## MODIFIED Requirements

### Requirement: Reactive Status Updates
The system MUST update the candidate's status interface (stepper, card color, current stage label) immediately across all active components when a modification occurs in any part of the application.

#### Scenario: Modal Update Reflects in Drawer
-   **Given** a candidate is in "Received" stage and the Profile Drawer is open.
-   **When** the user clicks "Feedback" and selects "Advance to Screening".
-   **Then** the modal closes.
-   **And** the Drawer stepper immediately highlights "Screening" as the active step.
-   **And** the Kanban board background list updates the card to the "Screening" column.

#### Scenario: Drag and Drop Reflects in Drawer
-   **Given** a candidate is in "Screening" and its Drawer is open.
-   **When** the user (on a wide screen) drags the card from "Screening" to "Technical" in the background Kanban board.
-   **Then** the Drawer stepper updates to "Technical" instantly.
