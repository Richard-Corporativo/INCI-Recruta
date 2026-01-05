# Tasks: Implement INCI Design System v3.0

- [x] **Install Dependencies** <!-- id: 0 -->
    - Install `tailwindcss postcss autoprefixer tailwindcss-animate class-variance-authority clsx tailwind-merge` via npm.
    - Initialize tailwind if not done (`npx tailwindcss init -p`).
    - *Note:* Downgraded to `tailwindcss@3` to match spec.

- [x] **Configure Infrastructure** <!-- id: 1 -->
    - Create/Overwrite `tailwind.config.ts` with the content from `design.md`.
    - Create/Overwrite `src/index.css` (or `globals.css`) with the CSS variables from `design.md`.
    - Ensure `postcss.config.js` is present.
    - Create `src/lib/utils.ts` (or `lib/utils.ts`) with the `cn` helper.

- [x] **Audit & Refactor Basics** <!-- id: 2 -->
    - Search for and replace `font-bold` (700) with `font-semibold` (600).
    - Search for and replace hardcoded hex colors with appropriate tokens (background, primary, etc.).
    - Verify Button usages and ensure `rounded-base` is the standard.

- [x] **Validate** <!-- id: 3 -->
    - Run the application and check for visual regressions.
    - Verify Dark Mode toggling works (if implemented).
    - *Note:* Build successful.
