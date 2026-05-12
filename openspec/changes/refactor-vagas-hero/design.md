# Design: Centered Premium Hero

## Context
The "side-by-side" layout in `JobsList.tsx` is unstable. The `flex-1` property on the text container, when combined with large typography and `max-w` constraints, is triggering a "min-content" collapse in certain browser rendering engines or specific viewport widths. To achieve a premium, bulletproof design, we will migrate to a Centered Hero layout.

## Goals
- Eliminate lateral text compression.
- Ensure the Hero section "wow" factor through scale and contrast.
- Maintain Balha DS 9.1 compliance (no shadows, max 600 weight).

## Decisions

### 1. Centered Layout
- **Decision**: All content (Badge, H1, Paragraph, Stats) will be centered using `flex flex-col items-center text-center`.
- **Rationale**: Center-aligned layouts are more stable across all breakpoints and provide a stronger visual focal point for public landing pages.

### 2. Typographic Scale
- **Decision**: H1 font size will be increased to `text-6xl` (mobile) and `text-8xl` (desktop).
- **Rationale**: High-density typography creates a premium feel without needing gradients or shadows.

### 3. Container Stability
- **Decision**: Use `w-full` on all nested containers and set explicit `max-w-4xl` for the main content block.
- **Rationale**: Prevents elements from shrinking to their minimum word width.

### 4. Visual Texture
- **Decision**: Use `radial-gradient` dots with `opacity-10` and `32px` spacing.
- **Rationale**: Adds depth without violating the "Radical Subtraction" rule.

## Migration Plan
1. Update `JobsList.tsx` to remove the `lg:flex-row` structure.
2. Apply `flex-col items-center` to the main hero container.
3. Reposition stats cards below the main text.
4. Verify responsiveness on mobile and desktop.
