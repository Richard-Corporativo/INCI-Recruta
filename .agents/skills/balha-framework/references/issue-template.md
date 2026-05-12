# Issue Template

Use this template when breaking the spec into issues in Phase 2.

---

# ISSUE-[number]: [Descriptive Title]

## Context
[Why this issue exists. What was done before it.]

## Objective
[What must be working when this issue is done.]

## Scope — DO:
- [ ] Create/modify file X
- [ ] Create/modify file Y
- [ ] Implement function Z

## Scope — DO NOT:
- Do not touch [file/feature out of scope]
- Do not refactor [thing that isn't part of this]

## Files involved
- `src/components/ComponentName.tsx` — create
- `src/actions/actionName.ts` — create
- `src/app/route/page.tsx` — modify

## Acceptance criteria
- [ ] User can [specific action]
- [ ] Error X shows message Y
- [ ] Data is saved to table Z
- [ ] Doesn't break existing feature W

## Dependencies
- Depends on: ISSUE-[previous number]
- Blocks: ISSUE-[next number]

## References
- Spec: Section [X]
- Documentation: [link]

---

## Layer Assignment

When creating issues, assign each to one of these layers:

### Layer 1: FOUNDATION
- Project setup (stack, folder structure, configs)
- Database schema (complete schema + migrations)
- Authentication system
- Base layout (navbar, sidebar, footer)

### Layer 2: VISUAL PROTOTYPES
- Page prototypes with mock data (frontend only, no logic)
- One issue per page

### Layer 3: FEATURES
- Business logic + integrations
- One issue per user flow/behavior

### Layer 4: POLISH
- Responsive design and mobile
- Loading states and error boundaries
- SEO and meta tags
- E2E tests for critical flows
- Performance (lazy loading, optimizations)
