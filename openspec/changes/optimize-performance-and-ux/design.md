# Design: Performance Architecture & UX Standards

## 1. Data Fetching & State Management (Solving the "F5" Problem)
The current implementation uses dispersed `useEffect` calls that do not share state or handle invalidation.

### Solution: React Query (TanStack Query)
We will refactor custom hooks (`useRoles`, `useJobs`, `useCandidates`) to wrap React Query's `useQuery` and `useMutation`.

**Benefits:**
- **Automatic Background Refetching**: Data stays fresh.
- **Cache Invalidation**: On `mutation.success`, we invalidate relevant queries, triggering immediate UI updates.
- **Optimistic Updates**: We can manually update the cache from local storage before the server responds.
- **Offline Persistence**: React Query supports persisting the cache to `localStorage` (via `persistQueryClient`), fulfilling the user's specific request.

### Implementation Pattern
```typescript
// hooks/useRoles.ts (Proposed)
export const useRoles = () => {
  const queryClient = useQueryClient();

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const addRole = useMutation({
    mutationFn: apiAddRole,
    onMutate: async (newRole) => {
       // Optimistic Update Logic
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
  
  return { roles, addRole };
}
```

## 2. Frontend Performance Optimizations

### Code Splitting
- **Current**: Likely a monolithic bundle.
- **Proposed**: Use `React.lazy` and `Suspense` for route-level splitting.
  - `const Roles = lazy(() => import('./pages/Roles'));`
  - This drastically reduces Initial Load (LCP).

### Asset Management
- **Images**: Enforce `width/height` to prevent Layout Shift (CLS). Use WebP where possible.
- **Icons**: Ensure tree-shaking of icon libraries.

### List Virtualization
- For lists like "Candidates Kanban" or "Audit Logs" that can grow indefinitely, we will implement `react-window` to render only visible items.

## 3. UX/UI Standardization Strategy

### "The Invisible Design"
- **Hierarchy Audit**: Review `h1`, `h2`, `h3` usage across pages. Ensure `h1` is unique and prominent.
- **Spacing (Whitespace)**: Enforce the 4px grid (`gap-2`, `p-4`, `p-6`, `gap-8`) strictly. Remove ad-hoc pixel values.
- **Feedback Loop**: ensure every button has `hover`, `active`, and `disabled` states defined in `index.css` or the button component.
- **Skeleton Screens**: Replace specialized spinners with generic data-shape skeletons during `isLoading` states.

## 4. Security & Resilience
- **Input Sanitization**: Ensure all form inputs are trimmed and validated before submission.
- **Error Boundaries**: Wrap major route sections in Error Boundaries to prevent full app crashes.
