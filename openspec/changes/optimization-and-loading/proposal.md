# Proposal: Performance Optimization & Artificial Loading

## Objective
Implement a "False Loading Sensation" to improve perceived performance and UI feedback, and systematically apply code optimizations as requested.

## Scope
1.  **UX Improvement (Loading States)**:
    - Implement a `Skeleton` component (shadcn/ui style).
    - Introduce artificial network delay in data fetching hooks to visualize loading states.
    - Wrap major routes in `Suspense` with appropriate skeletons.

2.  **Performance Optimization (Systematic)**:
    - **Code Splitting**: Implement `React.lazy` and `Suspense` for all major page routes in `App.tsx`.
    - **Memoization**: Optimize expensive calculations in `Dashboard.tsx` and lists using `useMemo`.
    - **Event Optimization**: Audit and optimize event listeners.

## Guidelines
- Follow the user's specific comment pattern: `// --> otimizado: [motivo]`.
- Focus on "Fake Loading" as the primary feature request.
