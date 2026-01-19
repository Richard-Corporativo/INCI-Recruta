# infrastructure Specification

## Purpose
TBD - created by archiving change apply-inci-design-system. Update Purpose after archive.
## Requirements
### Requirement: Core Dependencies
The project MUST have the following dependencies installed to support the V3.0 Design System: `tailwindcss`, `postcss`, `autoprefixer`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`.

#### Scenario: Verify installation
- **WHEN** `npm list` is run
- **THEN** `tailwindcss`, `postcss`, and `class-variance-authority` should be present in the output

### Requirement: Tailwind Configuration
The `tailwind.config.ts` file MUST strictly follow the configuration defined in `design.md`, including `darkMode: ["class"]`, `container` configuration, extended `colors` using `hsl(var(--token))`, and `borderRadius` mapping.

#### Scenario: Check config content
- **GIVEN** the `tailwind.config.ts` file
- **WHEN** inspected
- **THEN** it should contain `colors: { border: "hsl(var(--border))" }` and `radius: "var(--radius)"`

### Requirement: Global CSS Variables
The `index.css` (or equivalent global css) MUST define the `:root` and `.dark` variables exactly as specified in the "Tokens Oficiais" section of `design.md`.

#### Scenario: Check CSS Variables
- **GIVEN** the `index.css` file
- **WHEN** inspected
- **THEN** it should contain `--primary: 231 84% 30%;` and `--radius: 0.775rem;`

### Requirement: Utility Function
A `cn` utility function MUST be available that combines `clsx` and `tailwind-merge`.

#### Scenario: Verify Utility
- **GIVEN** the `lib/utils.ts` file
- **WHEN** the `cn` function is called with overlapping classes
- **THEN** it should return the merged class string correctly

