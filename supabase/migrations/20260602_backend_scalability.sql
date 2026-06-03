-- Backend scalability: indexes, dual-row constraint, RLS cleanup
-- Safe: all additive (IF NOT EXISTS / IF EXISTS guards)

-- Indexes: candidates
CREATE INDEX IF NOT EXISTS idx_candidates_column_id ON candidates(column_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status     ON candidates(status);

-- Partial index for base profile queries (WHERE job_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS uq_candidates_user_base_profile
  ON candidates(user_id) WHERE job_id IS NULL;

-- Composite index used by getCandidatesByJob + base profile merge
-- Already exists as idx_candidates_user_id_job_id from 20260601_performance_indexes
-- Adding partial variant for IS NULL lookups
CREATE INDEX IF NOT EXISTS idx_candidates_base_profile
  ON candidates(user_id) WHERE job_id IS NULL;

-- Indexes: jobs
CREATE INDEX IF NOT EXISTS idx_jobs_status          ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_workflow_status ON jobs(workflow_status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_status  ON jobs(company_id, status);

-- Indexes: users (used by is_staff_member() RLS checks)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RLS cleanup: remove duplicate policies on candidates
-- candidates_select_restricted is a subset of candidates_select_own
DROP POLICY IF EXISTS "candidates_select_restricted" ON candidates;

-- candidates_select_multitenant duplicates candidates_select_tenant
DROP POLICY IF EXISTS "candidates_select_multitenant" ON candidates;
