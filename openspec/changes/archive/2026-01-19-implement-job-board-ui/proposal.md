# Change: Implement Public Job Board UI

## Why
The candidate portal needs a public-facing entry point. Based on the HTML mockup provided, we aim to build a high-conversion Job Listing page (`/vagas`) that allows candidates to search, filter, and view open positions with a modern, responsive design.

## What Changes
- Adds `PublicLayout` with Candidate-specific Header and Footer.
- Adds `JobListingPage` featuring a Hero section, Search/Filter interface (Desktop Sidebar + Mobile Accordion), and Job Cards grid.
- Modifies `routes.tsx` to include the public `/vagas` routes.
- **Breaking**: None. This is additive UI on new routes.

## Impact
- Affected specs: `candidate-portal`
- Affected code: `src/layouts/`, `src/pages/public/`, `src/components/candidate/`
