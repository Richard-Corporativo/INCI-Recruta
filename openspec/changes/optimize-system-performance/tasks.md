# Tasks: optimize-system-performance

## Phase 1: Analysis & Quick Wins
- [x] Audit application using Chrome DevTools (Lighthouse) to establish baselines.
- [x] Remove dead code and unused imports found via static analysis.
- [x] Optimize images (if any) and enforce strict dimensions.
- [x] Eliminate `console.log` in production builds.

## Phase 2: React & Bundle Optimization
- [x] Implement `React.lazy` for main routes definitions in `App.tsx` or `Router`.
- [x] Extract heavy modals/drawers to lazy-loaded chunks.
- [x] Apply `React.memo` to `KanbanColumn` and `CandidateCard` components to minimize re-renders on drag-and-drop.
- [x] Memoize expensive calculations in `useJobs` (filtering/sorting).

## Phase 3: Interaction & Feedback (INP)
- [x] Add debounce to Search/Filter inputs in `Jobs.tsx`.
- [x] Audit event listeners for memory leaks (ensure cleanup in `useEffect`).

## Phase 4: Verification
- [x] Verify no visual regressions during loading states (proper Skeletons/Suspense).
- [x] Re-run Lighthouse to confirm metric improvements (LCP, INP).
