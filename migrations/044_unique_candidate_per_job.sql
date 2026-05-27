-- Prevent duplicate job applications from the same candidate
-- Creates a UNIQUE index on (user_id, job_id) where both are NOT NULL
-- This covers authenticated users applying to specific jobs
-- Does not affect: espontaneous applications (job_id IS NULL) or anonymous applications (user_id IS NULL)

CREATE UNIQUE INDEX IF NOT EXISTS idx_candidates_unique_user_job
  ON candidates(user_id, job_id)
  WHERE user_id IS NOT NULL AND job_id IS NOT NULL;
