-- Migration: Implement Talent Pool and Move Salary from Roles to Jobs
-- Description: Allows candidates without job_id and moves salary definitions to the Job level for more flexibility.

-- Ensure candidates.job_id is nullable
ALTER TABLE public.candidates ALTER COLUMN job_id DROP NOT NULL;

-- 1. Ensure salary columns exist on jobs with correct comments (idempotent)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_min') THEN
        ALTER TABLE public.jobs ADD COLUMN salary_min integer DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_max') THEN
        ALTER TABLE public.jobs ADD COLUMN salary_max integer DEFAULT 0;
    END IF;
END $$;

COMMENT ON COLUMN public.jobs.salary_min IS 'Minimum monthly salary for this job in BRL';
COMMENT ON COLUMN public.jobs.salary_max IS 'Maximum monthly salary for this job in BRL';

-- 2. Move data from roles to jobs (if jobs has 0 and role has > 0)
UPDATE public.jobs j
SET 
  salary_min = r.salary_min,
  salary_max = r.salary_max
FROM public.roles r
WHERE j.role_id = r.id AND j.salary_min = 0 AND r.salary_min > 0;

-- 3. Remove salary columns from roles
ALTER TABLE public.roles 
DROP COLUMN IF EXISTS salary_min,
DROP COLUMN IF EXISTS salary_max;

