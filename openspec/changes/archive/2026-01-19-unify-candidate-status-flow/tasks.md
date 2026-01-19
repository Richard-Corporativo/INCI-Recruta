# Tasks: Unify Candidate Status Flow

- [x] **Step 1: Implement Storage Events**
  - Modify `lib/storage.ts` to dispatch a `CustomEvent` named `recruitsys_storage_change` in the `set` method.
  - The event detail should include `{ key: string, data: any }`.

- [x] **Step 2: Make useCandidates Reactive**
  - Update `hooks/useCandidates.ts` to add a `window.addEventListener('recruitsys_storage_change', ...)` inside the `useEffect`.
  - Ensure the listener only triggers a state update (`load()`) if `event.detail.key` matches `KEYS.CANDIDATES`.
  - Verify that `addCandidate`, `moveCandidate`, etc., still work correctly (they trigger the event via `set`, which triggers the listener).

- [x] **Step 3: Verification**
  - Open Kanban and Profile Drawer side-by-side (or open Drawer).
  - Move card in background or via another mechanism.
  - Verify Drawer updates immediately without manual interaction.
  - Verify consistent behavior for "Back" and "Forward" transitions.
