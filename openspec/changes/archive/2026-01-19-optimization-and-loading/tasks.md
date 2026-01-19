# Tasks: Optimization & Loading

- [x] **Infrastructure: Skeleton Component** <!-- id: 0 -->
    - Created `src/components/ui/Skeleton.tsx`.
    - Fixed imports (`@/lib/utils` -> `../../lib/utils` and added `React`).

- [x] **Performance: Route Code Splitting** <!-- id: 1 -->
    - `App.tsx` already uses `React.lazy` for all routes. Checked.

- [x] **UX: Implement Loading Fallbacks** <!-- id: 2 -->
    - Updated `LoadingFallback` in `App.tsx` to use the new `Skeleton` component instead of a simple spinner.
    - This provides the "content shape" feedback requested.

- [x] **Feature: Artificial Delay (The "Fake Sensation")** <!-- id: 3 -->
    - Added `await new Promise(r => setTimeout(r, 800))` to `useJobs.ts`.
    - This forces the Skeleton state to be visible for 800ms, satisfying the "Fake Loading Sensation" request.

- [x] **Optimization: Dashboard** <!-- id: 4 -->
    - `Dashboard.tsx` already uses `useMemo` for filtering.
    - `App.tsx` fallback is optimized.
