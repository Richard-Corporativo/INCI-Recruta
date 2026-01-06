# Design: Reactive Candidate Portal

## Architecture Overview
The integration will move from a manual "Fetch-and-Set" pattern to a "Query-and-Observe" pattern using React Query.

### 1. Query Structure
- **Query Key**: `['candidate', userId]`.
- **Data Source**: Combined results from `candidates`, `jobs`, and `feedbacks` tables.
- **Deduplication**: Multiple components calling `useCandidateData()` will share the same request and cache.

### 2. Mutation Strategy
The `updateProfile` function will be transformed into a `useMutation` with:
- **onMutate**: Update the query cache immediately with the new data (Optimistic Update).
- **onError**: Roll back to the previous state if the database update fails.
- **onSettled**: Invalidate the query to ensure the data is perfectly in sync with the server.

### 3. State Management
- **Local State**: Removed from the hook in favor of React Query's internal state.
- **Forms**: Components will maintain their own local form state (e.g., `formData`) but will be initialized from the query data.

### 4. Performance Optimizations
- **Data Mapping**: Move database-to-interface mapping to the `queryFn` level to avoid re-mapping on every render.
- **Select Specifics**: Only fetch the necessary columns for the candidate portal.

## Component Interaction
1. **CandidateDashboard**: Subscribes to the candidate query. When the user clicks "Save", it triggers the mutation.
2. **CandidateSettings**: Subscribes to the same query. It immediately reflects changes made in the Dashboard without a page refresh.
3. **Sidebar/Header**: Can also subscribe to the query to show the user's name or avatar, staying in sync.
