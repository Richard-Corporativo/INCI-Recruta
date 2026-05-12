## Context
The project contains a standalone `admin/` directory which was used for developing and stabilizing administrative modules. We are now integrating these modules into the main project's App Router structure (`src/app/(admin)`).

## Decisions
- **Alias Mapping**: Ported files from `admin/src` will be updated to use the root project's aliases.
    - `admin/src/components` -> `@src/components`
    - `admin/src/services` -> `@src/services`
    - `admin/src/hooks` -> `@src/hooks`
- **Authentication**: We will preserve the root project's authentication middleware but ensure that the ported pages correctly utilize the shared `AuthContext` if applicable.
- **Layout Unification**: The `admin/src/app/(admin)/layout.tsx` will be merged with the root `src/app/(admin)/layout.tsx` to maintain sidebar consistency while adding any missing admin-specific UI elements.

## Risks / Trade-offs
- **Import Conflicts**: Porting large chunks of code might reveal missing dependencies in the root project.
    - *Mitigation*: Run type checks after each porting step.
- **Path Resolution**: Next.js App Router might require route adjustments for nested admin pages (e.g., `/admin/dashboard` vs `/dashboard`).

## Migration Plan
1. Copy files sequentially module by module.
2. Fix lint/type errors immediately after copying.
3. Validate each route in the browser.
