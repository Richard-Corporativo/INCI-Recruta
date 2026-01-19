# DESIGN: Standardize UI Patterns

## Component Hierarchy

### 1. `BaseModal.tsx`
A wrapper component that provides:
- Fixed overlay with `backdrop-blur`.
- Centered container with responsive width.
- Standard entrance animations.
- Close on backdrop click (optional) and Escape key.
- A "header" area with a close button.

### 2. `ConfirmationModal.tsx`
Extends `BaseModal` or utilizes its pattern to provide:
- A title and message.
- A "Confirm" button (primary/danger).
- A "Cancel" button.
- Replaces: `if (window.confirm("..."))`.

### 3. Feedback System
We will implement a lightweight `FeedbackOverlay` or simple auto-closing message at the top/bottom of the screen to replace `alert()`.

## Refactoring Strategy

- **Step A**: Extract the repetitive overlay logic from existing modals into `BaseModal`.
- **Step B**: Search and Replace `window.confirm` in:
    - `pages/Roles.tsx` (Role deletion).
    - `pages/Jobs.tsx` (Job deletion).
    - `components/Sidebar.tsx` (Logout confirmation if added).
- **Step C**: Search and Replace `alert()` in:
    - `components/UserModal.tsx`.
    - `pages/EditJob.tsx`.

## Visual Standards
- **Shadows**: Large, soft shadows (`shadow-xl`).
- **Borders**: Subtle borders (`border-slate-200/dark:border-slate-800`).
- **Colors**: Use the project's primary blue and standard slate palette.
- **Top Accent**: A thin colored bar (gradient) at the top of modals for brand consistency.
