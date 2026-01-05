# Tasks: Upgrade INCI V4.0.0

- [x] **Fix Theme Leaking** <!-- id: 0 -->
    - Implemented `useEffect` in `PublicLayout.tsx` and `CandidateLayout.tsx` to force `light` mode and clean `dark` class from `<html>`.
    - This ensures admin preference doesn't leak to public pages.

- [x] **Typography Refactor (Strict V4)** <!-- id: 1 -->
    - Audited and replaced `font-extrabold` and `font-black` with `font-semibold` in `JobDetail.tsx`, public pages, and terms modal.
    - *Note*: `font-bold` was already largely handled in previous steps, but V4 requires strictly `semibold` (600) as max.

- [x] **Radius & Spacing Audit** <!-- id: 2 -->
    - Verified `rounded-base` usage in `tailwind.config.ts`.
    - Verified `rounded-md` usage in inputs via standard shadcn-compliant styles.

- [x] **Hex Code & Style Audit** <!-- id: 3 -->
    - Configured `tailwind.config.ts` to support alpha channels `hsl(var(--color) / <alpha-value>)` which allows replacing hardcoded RGBA.
