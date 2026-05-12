---
name: creative-ui
description: Generate creative, premium UI designs and implementations following the Balha System (v5.0.0). Focuses on UX, accessibility, and architectural alignment (Atomic Design + FSD). Use this skill whenever the user wants to create a new UI, build a component, or improve an existing interface with a "wow" factor while maintaining technical rigor.
---

# Creative UI for Balha System

This skill enables Claude to generate visually stunning, highly interactive, and professionally engineered User Interfaces that strictly follow the **Balha Frontend Specification (v5.0.0)**.

## Aesthetic Moods & Visual Direction

The skill now supports three primary "Moods" inspired by top-tier modern web design:

1.  **Blueprint / Technical (Jasper style)**:
    - **Backgrounds**: Subtle grid patterns or dots.
    - **Palette**: Pastel accents (soft green, pink, yellow) on high-white or very light gray backgrounds.
    - **Typography**: Mix of elegant Serif headers with clean Sans-serif body.
    - **Elements**: Thin borders (border-border), clean cards with subtle shadows.

2.  **High-Contrast Vibrant (Slay/Creative style)**:
    - **Colors**: Bold block colors (e.g., `bg-yellow-400`, `bg-pink-500`) for specific sections.
    - **Typography**: Extra large, bold headers (`text-6xl+`).
    - **Layout**: Offset grids, overlapping text/images, and stark transitions.

3.  **Sleek Premium Dark (Dashboard/Revolut style)**:
    - **Base**: `bg-background` (dark) with `bg-card` for elevated elements.
    - **Accents**: Neon or vibrant accents (Lime, Purple, Cyan) for indicators and CTAs.
    - **Depth**: Soft elevation via OKLCH shadows and subtle glows (`shadow-[0_0_15px_rgba(...)]`).

## Micro-Aesthetics & Details

To achieve the "premium" feel, integrate these details:
- **Decorations**: Subtle use of stars/sparkles (`✦`, `★`), grid overlays, and floating geometric shapes.
- **Image Treatment**: Use high-quality photography with `rounded-2xl` or `rounded-3xl` corners.
- **Transitions**: Smooth scale effects on hover (`hover:scale-[1.02]`) and soft color shifts.
- **Gradients**: Use mesh gradients or soft linear fades for backgrounds and primary buttons.

## Layout Intelligence

- **Organic Grids**: Break the standard vertical flow with masonry layouts or horizontally scrolling card sections.
- **Layering**: Use `z-index` and negative margins to overlap elements (text over images, cards over background patterns).
- **Responsive Stacking**: Ensure bold layouts gracefully collapse into clean mobile stacks without losing personality.

## Technical Standards & Alignment

Every UI component must adhere to the **Balha Frontend Specification (v5.0.0)** to ensure maintainability:

### 1. Absolute Styling Rules
- **ZERO Hardcoding of Colors**: Must use tokens only (e.g., `bg-background`, `text-primary`, `border-border`).
- **Limited Font Weights**: restricted to `font-normal (400)`, `font-medium (500)`, and `font-semibold (600)`.
- **TypeScript**: Strictly typed; `any` is strictly prohibited.
- **Tailwind 4+**: Use native Tailwind 4 variables and CSS imports.

### 2. Architecture: Atomic Design + FSD
Organize all generated code according to:
- **Shared Layer (`shared/ui`)**: Pure, domain-less atoms (Buttons, Inputs).
- **Entities Layer**: Components with domain knowledge (e.g., `UserAvatar`).
- **Features Layer**: User actions/logic (e.g., `AddToCartButton`).
- **Widgets Layer**: Complex organisms and standalone sections (e.g., `HeroSection`, `DashboardGrid`).
- **Pages**: Top-level route composition.

## Execution Workflow

### Phase 1: Context Analysis
Before generating ANY code, analyze the following sources in the project:
1. `Balha System.md`: For the latest design tokens and architectural rules.
2. `Componentes.md`: For structural examples (Atoms/Molecules/Organisms).
3. `opencode.json`: To understand the project's broader scope.

### Phase 2: UX and Creative Design
Draft the UI thinking about:
- **Accessibility (A11Y)**: Semantic HTML, focus states (`focus-visible:ring-2`), and `aria-labels`.
- **States**: Mandatory handling of `Loading` (Skeletons), `Error` (Alerts), and `Empty` (EmptyState components).
- **Responsiveness**: Mobile-first design using standard breakpoints (`sm` to `2xl`).
- **Interactivity**: Smooth transitions (150ms-500ms) for hover and active states.

### Phase 3: Implementation
- Use standard shadcn/ui patterns (`forwardRef`, `cn()` utility, `displayName`).
- Ensure all input files and project context are respected.
- Output clean, maintainable, and well-documented TypeScript/React code.

## Critical Design Checklist
- [ ] Are colors using standard tokens? (No Hex/RGB/HSL)
- [ ] Are font weights restricted to 400, 500, or 600?
- [ ] Is the FSD directory structure followed?
- [ ] Is accessibility (ARIA, focus) addressed?
- [ ] Are all UI states (Loading/Error/Empty) covered?
- [ ] Does it have a "premium" visual feel?
