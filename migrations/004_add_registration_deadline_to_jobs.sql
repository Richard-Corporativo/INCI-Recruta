-- Migration 004: Add registration_deadline to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS registration_deadline DATE;

COMMENT ON COLUMN jobs.registration_deadline IS 'The deadline for candidate applications for this job';
