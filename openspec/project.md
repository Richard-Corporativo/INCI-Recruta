# Project Context

## Purpose
A modern Internal Recruitment System (ATS) designed for managers and HR professionals. It manages jobs, candidate pipelines (Kanban), and interview auditing with a focus on data persistence in the browser.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- React Router 6
- **Supabase (Auth & Database)**
- **PostgreSQL** (Managed by Supabase)

## Project Conventions

### Code Style
- Component-based architecture with hooks for logic.
- Atomic styles using Tailwind.
- Lucid styling with Material Symbols for icons.

### Architecture Patterns
- **Services Layer**: Domain-specific services (`src/services/`) interacting with Supabase.
- **Data Hooks**: Direct access to entities via `useJobs`, `useCandidates`, etc. (Async).
- **Authentication**: Native Supabase Auth (`auth.users`).
- **Design System (INCI v2.0.0)**:
  - **Tokens**: Use exclusively CSS tokens (`bg-background`, `bg-card`, `bg-primary`, `bg-sidebar`, etc.).
  - **Radius**: Buttons (`rounded-base`), Inputs (`rounded-md`), Cards (`rounded-lg`).
  - **Standard**: HEX/RGB/HSL values and inline styles are strictly prohibited.
  - **Animations**: Mandatory `duration-200 ease-in-out` for all transitions.

## Important Constraints
- **Performance**: Prioritize async data fetching with loading states.
- **Security**: Rely on RLS (Row Level Security) for data access control.

## External Dependencies
- Google Fonts (Inter, Outfit)
- Material Symbols (Icons)
