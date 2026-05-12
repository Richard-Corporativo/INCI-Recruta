# Tasks: Implementation of Vagas Layout Refactor

## Phase 1: Component Preparation
- [x] **Create `JobFilterConsole.tsx`**:
    - Port logic from `JobFilterSidebar.tsx`.
    - Implement dropdown-based filters instead of checkboxes.
    - Style according to Balha 9.1 (rounded-2xl, p-3).
- [x] **Create `JobCardCompact.tsx`**:
    - Compact version of `JobCardPublic` for sidebar use.
    - Focus on Title, Location, and Urgency tag.
- [x] **Create `JobDetailView.tsx`**:
    - Component to render full job information.
    - Include breadcrumbs and sticky application footer for mobile.

## Phase 2: Page Integration
- [x] **Refactor `JobsList.tsx` Layout**:
    - Remove `JobFilterSidebar`.
    - Integrate `JobFilterConsole` at the top.
    - Set up the 2-column grid: Sidebar (300px) and Main (flexible).
- [x] **Implement Selection Logic**:
    - Add `selectedJobId` state.
    - Auto-select the first job on initial load.
    - Handle empty states when no jobs match filters.
- [x] **Synchronize Filters**:
    - Ensure `JobFilterConsole` correctly updates the `filteredJobs` state in the parent.

## Phase 3: Mobile & UX Polish
- [x] **Implement Mobile View**:
    - Switch to a list-first view.
    - Use a drawer or navigation for job details.
- [x] **Add Transitions**:
    - Smooth opacity/slide transitions when switching jobs.
- [x] **Skeleton States**:
    - Update skeletons for both the list and the detail view.

## Phase 4: Validation
- [x] **Test Filter Combinations**: Verify all filters work in the new horizontal console.
- [x] **Responsive Audit**: Check layout stability from 320px to 2560px.
- [x] **Build Verification**: Run `npm run build` to ensure no regressions.

