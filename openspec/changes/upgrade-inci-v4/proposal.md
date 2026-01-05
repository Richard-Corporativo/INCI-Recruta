# Proposal: Upgrade to INCI Design System V4.0.0 and Fix Theming

## Objective
Adopt the new, stricter INCI V4.0.0 specifications, refactor the codebase to eliminate prohibited patterns (e.g., `font-bold`), and fix the "theme leaking" issue where admin dark mode settings incorrectly propagate to public/candidate pages.

## Proposed Changes
1.  **Strict Refactor**:
    - Remove all `font-bold`, `font-extrabold`, `font-black` usages; replace with `font-semibold` or `font-medium` per spec.
    - Audit and replace any remaining hex colors with Tailwind tokens.
    - Ensure all buttons use `rounded-base`.

2.  **Theme Isolation**:
    - Modify the Theme Management strategy. The `Sidebar.tsx` currently sets a global class on the `<html>` element.
    - Implement a `ThemeContext` or `Layout` separation such that Public Pages enforce a specific theme (Light) or maintain their own independent state, ignoring the Admin's `localStorage` preference if desired.

3.  **Component Architecture**:
    - Reorganize `components/` if necessary to match the `src/components/{ui,layout,features}` structure if not already compliant, although the spec allows flat if consistent. (We will focus on the UI tokens first).

## Validation
- Public pages must NOT change appearance when Admin sidebar theme is toggled.
- No `font-bold` classes should exist in the codebase.
- Application must build and look consistent.
