# Capability: INCI Design System v2.0.0

## Requirement: Design Tokens
The system MUST use the official INCI design tokens for all colors, spacing, and radius.

### Requirement: Color Tokens
- **Background**: `--background`
- **Foreground**: `--foreground`
- **Primary**: `--primary`
- **Card**: `--card`
- **Sidebar**: `--sidebar`
- etc.

## Requirement: Radius Standards
- **Buttons**: `rounded-base` (0.775rem)
- **Inputs**: `rounded-md` (base - 2px)
- **Cards**: `rounded-lg` (base)
- **Badges**: `rounded-full`

## Requirement: Interactive Feedback
- All buttons and inputs MUST have hover and focus states using `border-ring` or `bg-primary/90`.
- Transitions MUST have `duration-200 ease-in-out`.
