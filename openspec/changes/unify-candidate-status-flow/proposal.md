# Unify Candidate Status Flow

## Problem
Currently, the application manages candidate state via the `useCandidates` hook, which reads from `localStorage` on mount. However, there is no synchronization mechanism between different instances of this hook. For example, when a candidate is moved in the Kanban board (updating storage), the open Candidate Profile Drawer does not automatically reflect this change unless a manual `refresh()` callback is successfully propagated. This leads to UI inconsistencies, such as the stepper showing "Received" while the candidate is actually in "Screening", or errors when "going back" if the state is stale.

## Solution
Implement a **Reactive Storage Pattern**.
1.  **Event Bus in StorageService**: Modify `StorageService` to dispatch a custom browser event `recruitsys_storage_update` whenever `set()` is called.
2.  **Reactive Hooks**: Update `useCandidates` (and potentially other hooks) to subscribe to this event. When the event fires for the relevant key (`recruitsys_candidates`), the hook should automatically re-fetch data from storage and update its internal state.
3.  **Removal of Prop Drilling**: Remove the need for manual `refresh` prop passing in many cases, making the UI robust and self-correcting.

## Scope
-   `lib/storage.ts`: Add event dispatching.
-   `hooks/useCandidates.ts`: Add event subscription.
-   `pages/Kanban.tsx`, `components/CandidateProfileDrawer.tsx`: Simplify logic by removing explicit refresh chains where possible (though keeping them as fallback won't hurt).

## Risks
-   **Performance**: Excessive re-renders if the update event is too broad. We will mitigate this by checking the `key` in the event payload.
-   **Infinite Loops**: Care must be taken to ensure the hook's state update doesn't trigger a storage write that triggers another event (read-only on event).

## Verification
-   Moving a card in Kanban should instantly update `CandidateProfileDrawer` if open.
-   Changing status in `CandidateProfileDrawer` (via Feedback or Move Modal) should instantly update the underlying Kanban list.
