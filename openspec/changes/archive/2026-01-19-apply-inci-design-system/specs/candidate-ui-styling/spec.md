# Candidate UI Styling Specification

## Purpose
Define strict styling requirements for all candidate portal components to ensure 100% compliance with INCI Design System v2.0.0.

---

## ADDED Requirements

### Requirement: Token-Based Color System
All candidate portal components MUST use CSS custom properties via Tailwind utility classes for colors. Direct color values (HEX, RGB, HSL) are strictly prohibited.

#### Scenario: Developer adds a new button
- **GIVEN** a developer is creating a new button component
- **WHEN** they apply styling classes
- **THEN** they MUST use `bg-primary text-primary-foreground` instead of `bg-[#197fe6]`
- **AND** validation script MUST detect any hardcoded color values
- **AND** the button MUST render correctly in both light and dark modes

#### Scenario: Developer styles a card background
- **GIVEN** a developer is styling a card component
- **WHEN** they set the background color
- **THEN** they MUST use `bg-card` token
- **AND** they MUST use `text-card-foreground` for text color
- **AND** they MUST use `border-border` for borders
- **AND** the card MUST adapt automatically to theme changes

#### Scenario: Developer needs a muted background
- **GIVEN** a developer needs a subtle background color
- **WHEN** they apply background styling
- **THEN** they MUST use `bg-muted` token
- **AND** they MUST use `text-muted-foreground` for text
- **AND** NOT use custom slate colors like `bg-slate-50`

---

### Requirement: No Inline Styles
Candidate portal components MUST NOT use inline `style={{}}` attributes except for dynamic background images with runtime URLs.

#### Scenario: Developer needs to position an element
- **GIVEN** a developer needs to position an element
- **WHEN** they apply positioning
- **THEN** they MUST use Tailwind utility classes like `absolute`, `top-0`, `left-0`
- **AND** they MUST NOT use `style={{ position: 'absolute', top: 0 }}`

#### Scenario: Developer needs a static background image
- **GIVEN** a developer needs to add a decorative background image
- **WHEN** the image URL is static/known at build time
- **THEN** they MUST use an `<img>` element with Tailwind classes
- **AND** they MUST NOT use `style={{ backgroundImage: 'url(...)' }}`

#### Scenario: Developer needs a dynamic background image
- **GIVEN** a developer needs to display a user's profile picture
- **WHEN** the image URL comes from user data
- **THEN** they MAY use `style={{ backgroundImage: \`url(${userPhoto})\` }}`
- **AND** this is the ONLY acceptable use of inline styles

---

### Requirement: Standardized Border Radius
All interactive elements MUST use the correct border radius according to their type.

#### Scenario: Developer creates a button
- **GIVEN** a developer is styling a button element
- **WHEN** they apply border radius
- **THEN** they MUST use `rounded-base` (0.775rem)
- **AND** they MUST NOT use `rounded-xl`, `rounded-2xl`, or `rounded-lg`

#### Scenario: Developer creates an input field
- **GIVEN** a developer is styling an input or textarea
- **WHEN** they apply border radius
- **THEN** they MUST use `rounded-md` (calc(var(--radius) - 2px))
- **AND** they MUST NOT use `rounded-base` or `rounded-lg`

#### Scenario: Developer creates a card
- **GIVEN** a developer is styling a card container
- **WHEN** they apply border radius
- **THEN** they MUST use `rounded-lg` (var(--radius))
- **AND** they MUST NOT use `rounded-xl` or `rounded-2xl`

#### Scenario: Developer creates a badge or pill
- **GIVEN** a developer is styling a status badge
- **WHEN** they apply border radius
- **THEN** they MUST use `rounded-full` (9999px)
- **AND** this is the only case where `rounded-full` is appropriate

---

### Requirement: Complete Interaction States
All interactive elements MUST implement hover, focus, and active states with proper transitions.

#### Scenario: User hovers over a button
- **GIVEN** a user moves their cursor over a primary button
- **WHEN** the hover state activates
- **THEN** the button MUST show `hover:bg-primary/90` effect
- **AND** the transition MUST use `duration-200 ease-in-out`
- **AND** the change MUST be visually smooth

#### Scenario: User focuses a button with keyboard
- **GIVEN** a user tabs to a button using keyboard navigation
- **WHEN** the button receives focus
- **THEN** it MUST show a visible focus ring with `focus-visible:ring-2 focus-visible:ring-ring`
- **AND** it MUST have `focus-visible:ring-offset-2` for spacing
- **AND** the ring MUST be visible in both light and dark modes

#### Scenario: User focuses an input field
- **GIVEN** a user clicks or tabs into an input field
- **WHEN** the input receives focus
- **THEN** the border MUST change to `focus-visible:border-ring`
- **AND** a ring MUST appear with `focus-visible:ring-2 focus-visible:ring-ring`
- **AND** the transition MUST use `duration-200 ease-in-out`

#### Scenario: User clicks a button
- **GIVEN** a user clicks a button
- **WHEN** the active state triggers
- **THEN** the button SHOULD show `active:scale-95` for tactile feedback
- **AND** the transition MUST use `transition-all duration-200 ease-in-out`

---

### Requirement: Mandatory Transitions
All state changes MUST use consistent transition timing.

#### Scenario: Any interactive element changes state
- **GIVEN** any interactive element (button, input, card, link)
- **WHEN** it transitions between states (hover, focus, active)
- **THEN** it MUST use `duration-200` for timing
- **AND** it MUST use `ease-in-out` for easing
- **AND** it MUST specify `transition-colors`, `transition-all`, or `transition-shadow` as appropriate

#### Scenario: Card shadow changes on hover
- **GIVEN** a card with hover effects
- **WHEN** user hovers over the card
- **THEN** shadow MUST transition with `transition-shadow duration-200 ease-in-out`
- **AND** NOT use `transition-all` if only shadow changes (performance)

---

### Requirement: Dark Mode Compatibility
All candidate portal components MUST render correctly in both light and dark modes without additional configuration.

#### Scenario: User switches to dark mode
- **GIVEN** a user viewing the candidate portal in light mode
- **WHEN** they toggle to dark mode
- **THEN** all components MUST automatically adapt using CSS variables
- **AND** text MUST remain readable with proper contrast
- **AND** borders MUST remain visible
- **AND** interactive states MUST work correctly

#### Scenario: Developer tests a new component
- **GIVEN** a developer has created a new component
- **WHEN** they test it in dark mode
- **THEN** they MUST verify text readability
- **AND** they MUST verify border visibility
- **AND** they MUST verify focus ring visibility
- **AND** they MUST verify all hover states work

---

### Requirement: Semantic Token Usage
Components MUST use tokens according to their semantic meaning, not visual appearance.

#### Scenario: Developer needs a primary action button
- **GIVEN** a developer is creating a primary call-to-action
- **WHEN** they style the button
- **THEN** they MUST use `bg-primary text-primary-foreground`
- **AND** NOT choose colors based on visual preference

#### Scenario: Developer needs a secondary action button
- **GIVEN** a developer is creating a secondary or cancel button
- **WHEN** they style the button
- **THEN** they MUST use `bg-secondary text-secondary-foreground` OR `variant="outline"`
- **AND** they MUST use `border-border` for outline variant

#### Scenario: Developer needs to show destructive action
- **GIVEN** a developer is creating a delete or remove button
- **WHEN** they style the button
- **THEN** they MUST use `bg-destructive text-destructive-foreground`
- **AND** NOT use red color classes directly

---

### Requirement: Validation Enforcement
The project MUST include automated validation to detect design system violations.

#### Scenario: Developer runs validation script
- **GIVEN** the validation script is executed
- **WHEN** it scans candidate portal files
- **THEN** it MUST detect any hardcoded color values (HEX, RGB, HSL)
- **AND** it MUST detect inline `style={{}}` usage (except backgroundImage)
- **AND** it MUST report file paths and line numbers
- **AND** it MUST exit with error code if violations found

#### Scenario: CI/CD pipeline runs
- **GIVEN** code is pushed to the repository
- **WHEN** the CI/CD pipeline executes
- **THEN** it SHOULD run the validation script
- **AND** it SHOULD fail the build if violations are detected
- **AND** it SHOULD provide clear error messages

---

## Cross-References

**Related Capabilities**:
- `candidate-portal`: This spec defines the UI styling requirements for all candidate portal features
- `ui-fixes`: This spec supersedes previous ad-hoc UI fixes with systematic standards

**Implementation Notes**:
- See `design.md` for detailed pattern library and migration strategies
- See `tasks.md` for component-by-component refactoring plan
- Validation script should be created in Phase 1, Task 1.1
