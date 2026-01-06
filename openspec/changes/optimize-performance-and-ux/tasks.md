# Tasks: Optimize Performance and UX

## Initialization
- [x] Install `metrics-tooling` (e.g., `web-vitals`) or setup simple performance observer to baseline current LCP, CLS, INP. <!-- id: 0 -->
- [x] Install `@tanstack/react-query` and `@tanstack/react-query-persist-client`. <!-- id: 1 -->
- [x] Configure `QueryClient` in `App.tsx` with persistence to `localStorage`. <!-- id: 2 -->

## Data Layer Refactoring (F5 Killer)
- [x] Refactor `useRoles` to use `useQuery` and `useMutation`. <!-- id: 3 -->
- [x] Implement optimistic updates for `addRole`, `updateRole`, `deleteRole`. <!-- id: 4 -->
- [x] Refactor `useJobs` to use `useQuery` and `useMutation`. <!-- id: 5 -->
- [x] Refactor `useCandidates` to use `useQuery` and `useMutation` (Critical for Kanban). <!-- id: 6 -->
- [x] Refactor `useAudit` logs fetching to use `useInfiniteQuery` (Performance optimization for large logs). <!-- id: 7 -->

## Performance Optimization (Checklist)
- [x] **Code Splitting**: Wrap all page imports in `App.tsx` with `React.lazy` and `Suspense`. <!-- id: 8 -->
- [x] **Dead Code**: Audit and remove unused imports/exports using `ts-prune` or manual check. <!-- id: 9 -->
- [x] **Components**: Audit `CandidateKanban` and `LogTable` for re-renders; memoize heavy sub-components. <!-- id: 10 -->
- [x] **Assets**: Check all `img` tags for `width/height` attributes to fix CLS. <!-- id: 11 -->
- [x] **Virtualization**: Implement virtualization (windowing) for the Audit Log table if > 50 items. <!-- id: 12 -->

## UX/UI Standardization (Quality Audit)
- [x] **Roles Page**: Apply "Hierarchy & Spacing" rules (h1, gap-6, p-8). <!-- id: 13 -->
- [x] **Create/Edit Forms**: Ensure "Real-time Validation" (onBlur) and correct label placement. <!-- id: 14 -->
- [x] **General**: Verify "Interactive States" (hover/active) for all primary buttons. <!-- id: 15 -->
- [x] **Feedback**: Replace any remaining full-screen spinners with Skeleton Screens. <!-- id: 16 -->

## Validation
- [x] Verify that adding a Role updates the list immediately without refresh. <!-- id: 17 -->
- [x] Verify that Kanban moves update immediately and persist after reload (via local cache + sync). <!-- id: 18 -->
- [x] Check console for no "F5" needed warnings or errors. <!-- id: 19 -->
