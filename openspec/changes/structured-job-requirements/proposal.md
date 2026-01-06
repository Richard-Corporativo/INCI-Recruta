# Change: Structured Job Requirements

## Why
Currently, job details like responsibilities are entered as unstructured text, and there is no dedicated field for "What we expect (requirements)". This change introduces structured list editors for both sections to match the new design and improve candidate clarity.

## What Changes
- Add `requirements` column to `jobs` table (stored as text).
- Add `StringListEditor` component for dynamic list management.
- Update Admin "Create/Edit Job" page to use list editors for Responsibilities and Requirements.
- Update Public Job Detail page to render these sections as styled lists (bullets/checks).

## Impact
- Affected specs: job-management
- Affected code: `CreateJob.tsx`, `EditJob.tsx`, `JobDetailPublic.tsx`, `JobService.ts`, `types`
