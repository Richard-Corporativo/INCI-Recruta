# Design: Loading & Skeletons

## Components

### Skeleton
Based on shadcn/ui.
```tsx
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
```

## Artificial Delay Strategy
To satisfy "Falsa sensação de carregamento", we will introduce a utility `sleep` or modifying the existing hooks (`useJobs`, `useCandidates`) to simulate network latency (e.g., 800ms).

## Route Splitting
All pages imported in `App.tsx` should be converted to:
```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```
Wrapped in `<Suspense fallback={<DashboardSkeleton />}>`.
