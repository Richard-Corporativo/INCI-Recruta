-- Migration 039: Adiciona job_number sequencial às vagas
-- Propósito: Número legível no formato ID #0001 para exibição nos portais
-- job_number é global (não por empresa) e único

CREATE SEQUENCE IF NOT EXISTS jobs_job_number_seq START 1;

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_number INTEGER;

-- Preenche vagas existentes em ordem cronológica
WITH ordered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
    FROM jobs
    WHERE job_number IS NULL
)
UPDATE jobs
SET job_number = nextval('jobs_job_number_seq')
FROM ordered
WHERE jobs.id = ordered.id;

ALTER TABLE jobs ALTER COLUMN job_number SET DEFAULT nextval('jobs_job_number_seq');

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_job_number_unique;
ALTER TABLE jobs ADD CONSTRAINT jobs_job_number_unique UNIQUE (job_number);
