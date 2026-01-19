# Proposal: Integrate Supabase Backend

## Summary
Migrate the application's data persistence and authentication layer from browser-based `localStorage` to **Supabase**. This transition transforms the application from a client-side only prototype into a scalable, cloud-connected SaaS product.

## Motivation
The current "No external backend" constraint limits the application to a single device and offers no real security. The user has explicitly requested to prepare the project for Supabase to enable:
- **Real-time collaboration**: Multiple users (Recruiters, Managers) seeing updates instantly.
- **Secure Authentication**: replacing the mock simulation.
- **Data Persistence**: Data safety independent of browser cache.

## Proposed Changes
1.  **Database Integration**: Implement a generic `SupabaseService` to replace direct `localStorage` calls.
2.  **Authentication**: Swap the mock `AuthContext` for Supabase Auth (Email/Password).
3.  **Data Migration**: Adapt the `types.ts` models to SQL Tables (Jobs, Candidates, Users, Roles).
4.  **Security**: Implement Row Level Security (RLS) to ensure candidates only see their data and Recruiters see everything.

## Risks & Mitigation
-   **Offline Access**: The app will require internet access. *Mitigation*: We will implement basic error handling for network failures.
-   **Breaking Changes**: Existing `localStorage` data might be lost or need migration tools. *Mitigation*: We will treat this as a fresh start or provide a "Sync" button to push local data to the cloud once (Migration script).
-   **Complexity**: Async operations introduce loading states. *Mitigation*: We will use React Query or generic `useEffect` modifications to handle `loading` and `error` states gracefully.

## Alternatives Considered
-   **Firebase**: Supabase was chosen for its SQL capabilities which map well to our structured data types.
