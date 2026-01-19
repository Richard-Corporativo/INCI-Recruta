# Design: Entity Deletion & Candidate Profile UI

## Architectural Changes

### 1. Data Access Layer (Hooks)
*   **`useUsers`**: Add `deleteUser(id: string)` method.
    *   Should remove from `StorageService`.
    *   Should handle edge case: Prevent deleting own user (if applicable, though client-side auth is loose).
*   **`useCandidates`**: Add `deleteCandidate(id: string)` method.
    *   Should remove from `StorageService`.
*   **`useJobs`**: Already has `deleteJob`, verify exposure.

### 2. UI Components

#### `Settings.tsx`
*   Add a "Delete" button (Trash icon) to the User table actions column.
*   Integrate `ConfirmationModal` (reused) to confirm deletion.
    *   Message: "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."

#### `Jobs.tsx` / `JobDetail.tsx`
*   Ensure "Excluir Vaga" is visible in the actions menu (e.g., in the "More" dropdown of the Job Header or List row).
*   Use `ConfirmationModal`.

#### `CandidateProfileDrawer.tsx` (Major Refactor)
*   **Layout Strategy**:
    *   **Header**: Fixed. Avatar, Name, Email/Phone/Loc, "Top Candidate" badge (mock logic or derived from match/stars).
    *   **Body**: Scrollable.
        *   **Section 1: Job Info**: Cards grid (Role, Dept, Loc, Manager, Date).
        *   **Section 2: Timeline**: Vertical step progress bar matching the stages defined in `KANBAN_COLUMNS`.
        *   **Section 3: Tabs & Content**: "Entrevistas" vs "Auditoria".
            *   **Entrevistas Tab**: List of cards showing interview status (reusing logic from `InterviewFeedbackModal` context, or mocking if data is simple).
    *   **Footer**: Fixed. Action buttons.
        *   **Reprovar**: Semantic "Delete/Archive" action. This will trigger the `deleteCandidate` flow (or archive if status exists, but user asked for "Excluir").
        *   **Agendar**: Triggers existing `ScheduleInterviewModal`.
        *   **Mover Etapa**: Triggers existing `MoveStageModal` or direct update if simple.
        *   **Aprovar**: Shortcut to move to "Finalista" or "Contratado".

## Data Mapping (HTML to React)
*   The HTML has "Entrevista Gestor" badge. We can map `candidate.columnId` to these labels.
*   The HTML has "Top Candidate". We can map this to `candidate.match > 90%` or specific flag.
*   The HTML has "Status no Processo" timeline. We will iterate `KANBAN_COLUMNS` and mark current stage as active, previous as done.

## Dependencies
*   `ConfirmationModal`: Existing component, will be used heavily.
*   `useUsers`, `useCandidates`, `useJobs`: Hooks interacting with `localStorage`.
