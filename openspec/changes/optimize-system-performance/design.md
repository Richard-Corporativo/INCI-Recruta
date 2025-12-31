# Design: System Performance Optimization

## Architectural Strategy

### 1. Code Splitting & Lazy Loading
- **Route-based Splitting**: Implement `React.lazy` and `Suspense` for top-level routes (`Jobs`, `Settings`, `JobDetail`) to reduce the initial bundle size (FCP/LCP optimization).
- **Component Splitting**: Lazy load heavy components like the `CandidateProfileDrawer` which is not immediately visible.

### 2. Rendering Optimization (INP Focus)
- **Memoization**: Apply `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders in the Kanban board and large lists.
- **List Virtualization**: Evaluate if candidate lists exceed 50 items; if so, introduce virtualization (though currently, lists might be small enough).
- **Event Handling**: Ensure inputs have `debounce` to avoid freezing the UI during typing.

### 3. Data & State Management
- **Efficient Storage Access**: The `StorageService` reads from LocalStorage. We must ensure we aren't re-parsing the entire JSON on every small component render. We will leverage centralized hooks (`useJobs`, `useCandidates`) to cache the parsed data in React state and only sync to storage on writes.
- **Search Optimization**: Use simple indexing (Maps) instead of repeated array `find`/`filter` scans where O(N^2) complexity is detected.

### 4. Asset Optimization
- **Images**: Enforce explicit `width` and `height` to prevent CLS.
- **Icons**: Confirm usage of SVG symbols (Material Symbols) is efficient.

### 5. Monitoring
- **Web Vitals**: Integrate the `web-vitals` library to log LCP, CLS, and INP to the console (or a local log buffer) for debugging.
