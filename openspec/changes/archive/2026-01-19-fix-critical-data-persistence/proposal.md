# Proposal: Fix Critical Data Persistence Issues

## Why

The comprehensive audit (`AUDITORIA-COMPLETA.md`) revealed critical data persistence failures that prevent core business operations:

- **HR cannot manage role salaries** - The `roles` table lacks `salary_min` and `salary_max` columns, causing all salary data to be lost on save
- **Job postings show stale data** - Without a foreign key relationship between `roles` and `jobs`, changes to role salaries don't propagate to job listings
- **Candidates cannot apply** - Missing or misconfigured RLS policies block application submissions, breaking the entire recruitment funnel
- **Data inconsistency** - Duplicated fields between `roles` and `jobs` without synchronization lead to conflicting information across the platform

These issues directly impact:
- **Revenue**: Candidates can't apply → No hires → Business impact
- **User Trust**: Stale salary information → Candidate confusion → Brand damage  
- **Operational Efficiency**: Manual data sync required → HR overhead → Wasted time

This change fixes the root causes by completing the database schema, establishing proper relationships, and configuring security policies.

## Problem Statement

The audit (`AUDITORIA-COMPLETA.md`) identified critical data persistence failures affecting core business functionality:

1. **Role salary data not persisting** - Database schema missing `salary_min` and `salary_max` columns in `roles` table
2. **Role-to-Job synchronization broken** - No foreign key relationship between `roles` and `jobs` tables
3. **Candidate application submission potentially blocked** - Missing or misconfigured RLS policies
4. **Data redundancy and inconsistency** - Duplicated fields between `roles` and `jobs` without proper synchronization

These issues prevent:
- HR from managing salary ranges at the role level
- Automatic propagation of role changes to job postings
- Candidates from successfully submitting applications
- Maintaining data consistency across the platform

## Proposed Solution

### Phase 1: Database Schema Fixes (CRITICAL)
1. Add `salary_min` and `salary_max` columns to `roles` table
2. Add `role_id` foreign key to `jobs` table linking to `roles`
3. Backfill existing `jobs` with `role_id` based on title matching
4. Create database indexes for performance

### Phase 2: RLS Policy Configuration (CRITICAL)
1. Configure RLS policies for `candidates` table to allow:
   - Authenticated users to insert their own applications
   - Anonymous users to submit applications
   - Users to view only their own applications
2. Configure storage policies for `resumes` bucket

### Phase 3: Application Layer Updates (HIGH)
1. Update `CreateJob` to save `role_id` when creating jobs
2. Refactor `EditRole` synchronization to use `role_id` instead of title matching
3. Add error handling and user feedback for failed operations
4. Update TypeScript types to reflect schema changes

### Phase 4: Data Normalization (MEDIUM)
1. Remove redundant fields from `jobs` that should come from `roles`
2. Update queries to join with `roles` table when needed
3. Ensure backward compatibility during transition

## Impact Assessment

### User Impact
- **HR/Admin**: Can properly manage role salaries and see changes reflected in job postings
- **Candidates**: Can successfully submit applications without errors
- **Public**: See accurate, up-to-date job information

### Technical Impact
- **Database**: 2 new columns, 1 new foreign key, 2 new indexes
- **Breaking Changes**: None (additive schema changes only)
- **Performance**: Improved query performance with proper indexes
- **Data Integrity**: Enforced referential integrity via foreign keys

## Dependencies

- Supabase project access for running migrations
- No code dependencies (pure schema and policy changes for Phase 1-2)

## Success Criteria

1. ✅ Role salary fields save and persist correctly
2. ✅ Editing a role's salary updates all associated jobs
3. ✅ Job public pages display current role salary information
4. ✅ Candidates can submit applications successfully
5. ✅ No duplicate applications allowed
6. ✅ Resume uploads work correctly

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data migration fails | Low | High | Use `IF NOT EXISTS` and test on staging first |
| RLS policies too permissive | Medium | High | Follow principle of least privilege, audit policies |
| Performance degradation | Low | Medium | Add indexes, monitor query performance |
| Breaking existing functionality | Low | High | Additive changes only, comprehensive testing |

## Timeline Estimate

- Phase 1: 30 minutes (database migrations)
- Phase 2: 20 minutes (RLS policies)
- Phase 3: 2-3 hours (code updates)
- Phase 4: 4-6 hours (refactoring)

**Total: 1-2 days for complete implementation**

## Open Questions

1. Should we migrate existing jobs to use `role_id` immediately or allow gradual transition?
2. What should happen to jobs if their parent role is deleted? (CASCADE vs SET NULL)
3. Should anonymous candidates be allowed to apply, or require authentication?
4. Do we need audit logging for salary changes?

## Related Changes

- `enhance-platform-architecture` (0/13 tasks) - May overlap with data normalization work
- `implement-real-time-reactivity` (16/30 tasks) - Could benefit from proper foreign keys
