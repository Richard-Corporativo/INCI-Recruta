## MODIFIED Requirements

### Requirement: Admin Authentication
The system SHALL provide an administrative login interface for authorized users to access the admin panel. The login page SHALL follow Balha v10 design tokens.

#### Scenario: Admin login flow
- **WHEN** an administrator navigates to `/admin/login`
- **THEN** the login form SHALL render with Balha v10 tokens (bg-background page, bg-card form card, Rethink Sans, zero shadow)
- **AND** SHALL accept email and password credentials

## ADDED Requirements

### Requirement: Balha v10 UI Compliance — Admin
All admin screens under `/(admin)/` route group SHALL comply with Balha Design System v10.0.0.

#### Scenario: Sidebar is collapsible
- **WHEN** an admin is on any `/(admin)/` page on desktop
- **THEN** the sidebar SHALL be 64px wide by default (icon-only)
- **AND** SHALL expand to 256px (icon + label) on hover
- **AND** SHALL use Balha sidebar tokens (`bg-sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-border`)

#### Scenario: Dashboard uses card grid
- **WHEN** an admin navigates to `/admin/dashboard`
- **THEN** KPI metrics SHALL render as metric-cards in a 3-column grid
- **AND** filters SHALL be horizontal scroll pills
- **AND** conversion funnel SHALL be a single card
- **AND** recent items SHALL be cards (not tables)
- **AND** a sticky CTA "Criar Vaga" SHALL be fixed at bottom-right

#### Scenario: Jobs listing uses card grid
- **WHEN** an admin navigates to `/jobs`
- **THEN** jobs SHALL render as interactive cards in a 2-3 column grid
- **AND** each card SHALL show title, department, location, urgency badge, status, deadline, candidate count
- **AND** filters SHALL be horizontal scroll pills
- **AND** empty state SHALL use dashed border card

#### Scenario: Job forms use stepper cards
- **WHEN** an admin creates or edits a job
- **THEN** the form SHALL be a stepper with cards (Dados Gerais, Requisitos, Configurações)
- **AND** each step SHALL be one self-contained card
- **AND** progress bar SHALL use Balha tokens (bg-muted track, bg-primary fill)

#### Scenario: Data tables preserved for Audit
- **WHEN** an admin views `/audit`
- **THEN** the audit log table SHALL be preserved (tabular data exception)
- **AND** filter controls SHALL be horizontal scroll pills + cards for date range

### Requirement: Scroll Zero — Admin
All admin screens SHALL present actionable content without vertical scroll beyond two viewports. Navigation SHALL use tabs, accordions, steppers, or grids.

#### Scenario: Settings uses tabs + cards
- **WHEN** an admin navigates to `/settings`
- **THEN** the settings SHALL use tabs for top-level segmentation
- **AND** each tab content SHALL render as Balha cards
- **AND** user management table SHALL be preserved (tabular exception)

### Requirement: Balha Visual Tokens — Admin
All admin screens SHALL exclusively use Balha v10 CSS custom properties.

#### Scenario: No shadows or gradients in admin
- **WHEN** inspecting any admin page
- **THEN** no `shadow-*`, `bg-gradient-*`, or `drop-shadow-*` classes SHALL be used
- **AND** surface elevation SHALL use bg-background vs bg-card contrast

#### Scenario: Typography constraints in admin
- **WHEN** rendering any admin text
- **THEN** font-family SHALL be Rethink Sans
- **AND** font-weight SHALL NOT exceed 600
- **AND** numeric data SHALL use `font-variant-numeric: tabular-nums`

### Requirement: Admin Sidebar
The admin sidebar SHALL provide navigation to all admin sections with Balha v10 sidebar tokens and collapsible behavior.

#### Scenario: Navigation items
- **WHEN** the sidebar is rendered
- **THEN** it SHALL contain nav items: Dashboard, Vagas, Cargos, Banco de Talentos, Auditoria, Configurações
- **AND** the active item SHALL show `bg-sidebar-primary` solid pill
- **AND** inactive items SHALL show `hover:bg-sidebar-accent`
