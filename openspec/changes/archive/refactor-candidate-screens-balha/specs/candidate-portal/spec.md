## MODIFIED Requirements

### Requirement: Public Job Listing
The system MUST provide a publicly accessible list of all open positions synchronized with the Admin panel. The listing MUST follow Balha Design System v10.0.0 layout: card grid layout, scroll-zero navigation, and Balha visual tokens (Rethink Sans, bg-background/bg-card, no shadows).

#### Scenario: User browses real jobs
- **WHEN** a recruiter creates a job in the Admin panel
- **AND** a user navigates to `/vagas`
- **THEN** the system displays the newly created job
- **AND** allows filtering by category or model (Remote/Hybrid)

### Requirement: Status Tracking
The system MUST provide a real-time progress indicator for candidates based on Admin Kanban stages. Progress indicators MUST use Balha v10 card-based layout with horizontal scroll-snap for stage visualization.

#### Scenario: Stage change reflection
- **WHEN** a recruiter moves a candidate's card in the Admin Kanban
- **THEN** the candidate's dashboard reflects the new stage immediately upon refresh or navigation
- **AND** the timeline renders stages as horizontal scrollable cards (min-width 320px) with snap points

## ADDED Requirements

### Requirement: Balha v10 UI Compliance
All candidate-facing screens (`/candidate/dashboard`, `/candidate/applications`, `/candidate/applications/[id]`, `/candidate/settings`, `/perfil/completar`) MUST comply with Balha Design System v10.0.0.

#### Scenario: Dashboard uses card grid
- **WHEN** a candidate navigates to `/candidate/dashboard`
- **THEN** the page displays a 2-column card grid (Identity, Metrics, Summary, Links)
- **AND** a horizontal scroll strip of action cards is visible below
- **AND** a sticky CTA button is fixed at bottom-right
- **AND** no essential content requires vertical scroll to access

#### Scenario: Applications uses horizontal metrics
- **WHEN** a candidate navigates to `/candidate/applications`
- **THEN** the page displays a horizontal scroll strip of metric cards (Total/Active/Closed)
- **AND** a responsive grid (2-3 columns) of application cards
- **AND** each card has interactive hover state (bg-muted)

#### Scenario: Application detail uses horizontal stage cards
- **WHEN** a candidate views `/candidate/applications/[id]`
- **THEN** stage timeline renders as horizontal scrollable cards with snap points
- **AND** action buttons (FAQ/Withdraw) are inside an accordion in the footer

#### Scenario: Settings uses independent cards per section
- **WHEN** a candidate opens `/candidate/settings` tab "Perfil Profissional"
- **THEN** the profile form is split into 6 independent cards in a 2-column grid
- **AND** each card has its own Save action
- **AND** no card contains more than one accordion section

#### Scenario: Wizard uses Balha tokens
- **WHEN** a candidate accesses `/perfil/completar`
- **THEN** the stepper uses bg-background for page, bg-card for stepper card, bg-primary for progress
- **AND** zero shadow/gradient tokens are used
- **AND** typography follows Rethink Sans at max weight 600

### Requirement: Scroll Zero Principle
All candidate screens MUST present 100% of actionable content without vertical scrolling beyond two viewports. Navigation MUST use horizontal scroll (cards), tabs, accordions, or steppers instead.

#### Scenario: Horizontal scroll with snap
- **WHEN** a section uses horizontal scroll for cards
- **THEN** CSS `scroll-snap-type: x mandatory` is applied to the container
- **AND** each card has `scroll-snap-align: start`
- **AND** the next card is partially visible to indicate scroll affordance

#### Scenario: Tabs for content segmentation
- **WHEN** content requires more than 1 viewport height
- **THEN** tabs MUST be used to segment content
- **AND** the active tab has `border-b-2 border-primary` with `text-primary`
- **AND** inactive tabs use `text-muted-foreground`

### Requirement: Balha Visual Tokens
All candidate screens MUST exclusively use Balha v10 CSS custom properties for colors, typography, and spacing. No hardcoded hex/rgb values.

#### Scenario: No shadows or gradients
- **WHEN** inspecting any candidate screen
- **THEN** no `shadow-*` or `bg-gradient-*` or `drop-shadow-*` classes are used
- **AND** surface elevation is achieved via bg-background (#F9FAFB) vs bg-card (#FFFFFF) contrast

#### Scenario: Typography constraints
- **WHEN** rendering any text on candidate screens
- **THEN** font-family MUST be Rethink Sans
- **AND** font-weight MUST NOT exceed 600 (font-semibold)
- **AND** numeric data MUST use `font-variant-numeric: tabular-nums`
