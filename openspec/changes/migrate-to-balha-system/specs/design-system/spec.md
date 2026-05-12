## MODIFIED Requirements

### Requirement: Design System Implementation
**FROM**: INCI Design System v2.0.0
**TO**: Balha Design System v9.1.0

The system SHALL follow the Balha Design System v9.1.0 guidelines, which include:
- **Typography**: Rethink Sans for all text.
- **Icons**: Material Symbols via Iconify.
- **Atmosphere**: Flat, clean, data-dense bento grid.
- **Constraints**: Zero shadows, zero gradients, radical subtraction.
- **Tokens**: Strict use of `bg-background`, `bg-card`, `bg-primary`, etc.

#### Scenario: Visual Consistency
- **WHEN** any page is rendered
- **THEN** no `shadow-*` or `bg-gradient-*` classes are present
- **AND** all containers use `rounded-2xl`
- **AND** all numeric data uses `tabular-nums`
