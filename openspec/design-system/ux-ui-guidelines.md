# Balha UX/UI Guidelines v9.1.0

## 1. Visual Theme: Radical Subtraction
Zero shadows, zero gradients, zero backdrop-blurs. Hierarchy is established purely through color contrast (bg tokens) and typographic weight.

## 2. Typography: Rethink Sans
- Sole typeface allowed.
- Max weight: `font-semibold` (600).
- `tabular-nums` is OBLIGATORY for all numeric data and KPIs.

## 3. Spacing & Density
- Bento grid layout (compact).
- High density: lots of info, minimal gaps (`gap-4` between cards, `p-6` inside cards).

## 4. Components
- **Cards**: `rounded-2xl`, `bg-card`. No borders.
- **Buttons/Dropdowns**: `rounded-xl`, `min-h-[40px]`, `font-medium`.
- **Inputs**: `rounded-lg`, `bg-input`, `border-input`.
- **Badges**: Pill-shaped (`rounded-full`), indicator dot (`h-1.5 w-1.5`).

## 5. Icons: Material Symbols
- Use `<Icon icon="material-symbols:..." />` exclusively.
- Sizes: `h-4 w-4` (inline), `h-5 w-5` (nav), `h-6 w-6` (highlight).
- Prohibited: Lucide, Heroicons, FontAwesome, inline SVGs.

## 6. Color Roles (60-30-10)
- 60% `bg-background` (page)
- 30% `bg-muted`/`bg-card` (containers)
- 10% `bg-primary` (CTAs/Active items)
