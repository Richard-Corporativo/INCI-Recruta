# Spec: Candidate Profile UI Refresh

## ADDED Requirements

### Candidate Profile Drawer UI
The profile drawer must be redesigned to match the provided HTML reference for a premium look.

#### Scenario: Visual Match
- **Given** I open a candidate profile
- **Then** the layout should match the "Premium Sunset" aesthetic defined in the HTML reference.
- **And** it should display a Sidebar/Drawer with:
    - Header: Initial, Name, Contact Info, Match Score.
    - Body: 
        - "Identificação da Vaga" Grid.
        - "Status no Processo" Vertical Timeline.
        - "Entrevistas" List (simulated or real).
    - Footer: Fixed action bar ("Reprovar" / "Agendar" / "Mover" / "Aprovar").

#### Scenario: Timeline Status
- **Given** a candidate is in column "Entrevista Gestor"
- **Then** the timeline should show previous steps (Recebido, Triagem...) as "Completed" (Green check).
- **And** the current step "Entrevista Gestor" as "Active" (Pulse).
- **And** future steps as "Pending" (Gray).
