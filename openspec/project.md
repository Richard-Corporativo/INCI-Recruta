# Project Context

## Purpose
A modern Internal Recruitment System (ATS) designed for managers and HR professionals. It manages jobs, candidate pipelines (Kanban), and interview auditing with a focus on data persistence in the browser.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- React Router 6
- LocalStorage for persistence

## Project Conventions

### Code Style
- Component-based architecture with hooks for logic.
- Atomic styles using Tailwind.
- Lucid styling with Material Symbols for icons.

### Architecture Patterns
- **Simplified Storage**: All data is managed via `StorageService` (`lib/storage.ts`).
- **Data Hooks**: Direct access to entities via `useJobs`, `useCandidates`, etc.
- **Client-Side Auth**: Simulated sessions based on stored user entities.

## Important Constraints
- No external backend or database. Everything must run in the browser.
- No third-party AI dependencies in the final build.

## External Dependencies
- Google Fonts (Inter, Outfit)
- Material Symbols (Icons)
