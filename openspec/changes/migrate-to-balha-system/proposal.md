# Change: Migrate to Balha Design System v9.1.0

## Why
The project needs a more modern, data-dense, and corporate-focused aesthetic. The current INCI Design System is outdated compared to the new Balha System (v9.1.0), which provides a cleaner, bento-grid based layout optimized for professional SaaS dashboards.

## What Changes
- **BREAKING**: Radical subtraction of all shadows and gradients across the entire UI.
- **BREAKING**: Migration from Inter/Outfit to Rethink Sans as the sole typeface.
- **BREAKING**: Transition from various icon sets to Material Symbols (Iconify).
- Implementation of bento grid layout density.
- Standardization of spacing and border radius (`rounded-2xl` for cards, `rounded-lg` for inputs/buttons).
- Mandatory `tabular-nums` for all data displays.

## Impact
- **Affected specs**: `openspec/project.md`, `openspec/design-system/ux-ui-guidelines.md`, and all UI-related component specs.
- **Affected code**: All `.tsx` and `.ts` files in the `project/` directory, `globals.css`, and root layout.
