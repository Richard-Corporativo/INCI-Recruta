# Proposal: Adopt INCI Design System v3.0.0

## Summary
The project currently employs inconsistent component usage and lacks a unified design language. This proposal aims to strictly adopt the **INCI Design System v3.0.0 (Extended Edition)** as the single source of truth for UI/UX. This involves installing necessary dependencies (TailwindCSS, shadcn/ui utilities) and refactoring core components to adhere to new tokens, typography, and accessibility standards.

## Motivation
- **Inconsistency:** Current UI uses mix of styles, hardcoded values, and potentially conflicting conventions.
- **Maintainability:** A centralized design system reduces technical debt and makes future updates easier (e.g. changing a primary color globally).
- **Accessibility:** The new system enforces A11y best practices (contrast, focus states).
- **Standardization:** "The document is the instruction ... code generated ... must follow strictly."

## Solution
1.  **Infrastructure:**
    - Install `tailwindcss`, `postcss`, `autoprefixer`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`.
    - Create `tailwind.config.ts` satisfying the V3.0 spec.
    - Create `lib/utils.ts` for the `cn` utility.
    - Update `index.css` with the official CSS variables.

2.  **Implementation:**
    - Audit existing code and replace hardcoded styles with tokens.
    - Ensure all text weights are <= 600 (`font-semibold`).
    - Standardize `components/ui` primitives (Button, Input, etc.).
