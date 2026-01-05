# Design: Reactive Storage Pattern

## Context
The current application suffers from state desynchronization between components reading the same data from LocalStorage. React's state is local to each hook instance, and LocalStorage does not natively trigger re-renders in React components within the same window context (the `storage` event only works across tabs).

## Architecture

### The Event Bus
We will use the browser's native `CustomEvent` API to create a lightweight event bus.

1.  **Publisher**: `StorageService.set(key, data)`
    ```typescript
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('recruitsys_storage_change', { 
        detail: { key, data } 
    }));
    ```

2.  **Subscriber**: `useCandidates` (and future hooks)
    ```typescript
    useEffect(() => {
        const handleStorageChange = (e: CustomEvent) => {
            if (e.detail.key === KEYS.CANDIDATES) {
                // Logic to re-filter and setCandidates
                refresh();
            }
        };
        window.addEventListener('recruitsys_storage_change', handleStorageChange as EventListener);
        return () => window.removeEventListener('recruitsys_storage_change', handleStorageChange as EventListener);
    }, []);
    ```

## Trade-offs
-   **Pros**: Decoupled, simple, works with the existing "no backend" constraint, fixes the "stale state" bug permanently.
-   **Cons**: Relies on window global events (acceptable for a client-side SPA).

## Alternatives Considered
-   **React Context**: Would require wrapping the entire app in providers (`CandidateProvider`, `JobProvider`). While idiomatic, it requires a larger refactor of `App.tsx` and migration of all hook usages. The Event Bus approach is less invasive and equally effective for this specific requirement.
