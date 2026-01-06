# Proposal: Optimize Performance and UX Standardization

## Goal
To implement a robust data fetching strategy that eliminates the need for manual refreshes (F5) by introducing caching, optimistic updates, and offline persistence (LocalStore). Additionally, to perform a systematic performance optimization pass and standardize the UX/UI according to the new "Guia de UX/UI" to ensure a fast, "invisible", and reliable user experience.

## Scope
- **Data Management**: Migrate existing `use*` hooks to a robust state management solution (e.g., TanStack Query or a custom SWR wrapper) to handle caching, background updates, and optimistic UI.
- **Frontend Performance**: Implement code splitting (lazy loading), asset optimization, and virtualization for large lists as per the "Instrução de Otimização de Performance".
- **UX/UI Standardization**: Audit and align key screens (Dashboard, Roles, Candidates, Jobs) with the new Visual Principles (Hierarchy, Spacing, Micro-interactions).
- **Resilience**: Implement local storage persistence for critical data to ensure continuity and offline awareness.

## Why
The user has reported a critical issue where data updates require a page refresh (F5) to be visible. This indicates a lack of reactive state management and cache invalidation. Furthermore, a comprehensive UX/UI guide and performance checklist have been provided to elevate the application's quality standard.

## Tech Stack Impact
- Introduction of **TanStack Query** (or equivalent pattern) for state management.
- Potential refactoring of `App.tsx` routes for lazy loading (`React.lazy`).
- Enhancements to the `Supabase` client usage for better performance.
