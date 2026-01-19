# Proposal: Apply UX/UI Guidelines

## Objective
Apply the principles defined in `openspec/design-system/ux-ui-guidelines.md` to the codebase. This focuses on visual hierarchy, spacing "breathing room", typography rhythm, and interaction feedback.

## Scope
1.  **Typography Rhythm**:
    - Ensure Body text uses `leading-relaxed` and Titles use `leading-tight`.
    - Enforce `max-w-prose` or similar constraints on text-heavy pages to improve readability (60-75 chars/line).
2.  **Spacing & Layout**:
    - Audit page containers to ensure `p-6` or `p-8` padding (avoiding the "Brick Wall" effect).
    - Ensure consistent gap between sections (`gap-8` or `py-8`).
3.  **Micro-interactions**:
    - Verify that all interactive elements (buttons, heavy cards) have `hover` and `active` states (e.g., `active:scale-95`).
4.  **Forms (Quick Audit)**:
    - Ensure Labels are `block` and above inputs.

## Reference
- `openspec/design-system/ux-ui-guidelines.md`
