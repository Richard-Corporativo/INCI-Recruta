# Design: Structured Job Requirements

## Schema Design
We will add a new column to the `jobs` table:
- `requirements`: `text` (nullable)

Both `responsibilities` (existing) and `requirements` (new) will store data as newline-separated strings. This maintains consistency with the current `responsibilities` field and simplifies database interactions without requiring a migration to JSONB at this stage.

## Component Design
A new React component `StringListEditor` will be created to manage these lists.
**Props:**
- `items`: string[]
- `onChange`: (items: string[]) => void
- `placeholder`: string
- `icon`: string (optional, for bullet/check)

**Behavior:**
- Displays list of items.
- "Add" button allows adding a new text line.
- Each item has a "Remove" button.
- Items are editable inputs.

## UI/UX
- **Admin**: In `CreateJob` / `EditJob` (Step 2), replace the `textarea` for responsibilities with `StringListEditor`. Add a new section for Expectations (`requirements`) using the same component.
- **Public**: In `JobDetailPublic`, parse the newline-separated strings into arrays and render them using the design system (bullets for responsibilities, checks for requirements).
