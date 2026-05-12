# Change: Refactor Vagas Hero Section

## Why
The current hero section of the `/vagas` page is suffering from critical layout compression issues. In high-resolution or ultra-wide screens, the text containers are shrinking to a single-word width, making the content unreadable. Additionally, the side-by-side layout (Text vs. Stats) is failing to maintain visual balance under different viewport sizes, violating the premium "wow" factor required by the Balha Design System v9.1.

## What Changes
- **MODIFIED**: Refactor the Hero section layout from a side-by-side (flex-row) to a robust Centered Hero (centered typography).
- **MODIFIED**: Standardize typography weights to strictly follow the "font-semibold (600)" limit, using italic and font-light for contrast instead of bold.
- **MODIFIED**: Implement explicit `w-full` and `max-w` constraints that work correctly across all breakpoints.
- **MODIFIED**: Enhance the visual texture using the Balha DS dots pattern but with refined opacity and scale.

## Impact
- **Affected specs**: `openspec/specs/candidate-portal/spec.md` (Public Job Listing UI).
- **Affected code**: `project/pages/public/JobsList.tsx`.
