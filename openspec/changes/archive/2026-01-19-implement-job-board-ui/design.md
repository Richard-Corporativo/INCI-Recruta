# Design: Public Job Board UI

## Context
Candidates need a visually appealing and easy-to-use interface to find jobs. The provided HTML uses a specific design with a hero gradient, sidebar filters (collapsible on mobile), and detailed job cards.

## Blueprint
### 1. Components
- **`PublicLayout`**:
  - `Header`: Logo, Nav Links (Sobre, Trabalhe Conosco, Login), Mobile Menu.
  - `Footer`: Simplified links and copyright.
- **`HeroSection`**:
  - Gradient background from config.
  - Search Input (Keyword) + Select (Location).
  - Quick Filters (Tags).
- **`JobFilterSidebar`**:
  - Mobile: `<details>` accordion style.
  - Desktop: Sticky sidebar with checkboxes.
  - Categories: Area, Seniority, Model, Local.
- **`JobCardPublic`**:
  - Data: Title, Department, Tags (Local/Model/Type), Tech Badge Stack.
  - Actions: "Candidatar-se" (Primary), "Ver Detalhes" (Outline).

### 2. Layout Structure
```tsx
<PublicLayout>
  <HeroSection />
  <Container className="flex gap-8">
     <JobFilterSidebar className="w-64 hidden lg:block" />
     <main className="flex-1">
        <JobListHeader /> // Count + Pagination
        <Grid>
           {jobs.map(job => <JobCardPublic job={job} />)}
        </Grid>
     </main>
  </Container>
</PublicLayout>
```

## Decisions
- **Decision**: Use `react-router-dom` for structure but keep filters as local state (or URL params) initially for simplicity.
- **Decision**: Copy the exact Tailwind classes from the HTML provided to ensure fidelity to the requested design.
- **Decision**: Mock job data array locally in the page component to unblock UI development.

## Implementation Details
- **Icons**: Use `Material Symbols Outlined` (already in project).
- **Font**: Verify `Inter` and `Noto Sans` availability (or fallback to system sans).
