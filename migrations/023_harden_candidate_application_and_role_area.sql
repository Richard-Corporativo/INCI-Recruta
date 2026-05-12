-- Migration 023: Harden candidate application flow and backfill role area

-- Candidaturas devem ser feitas apenas por usuários autenticados.
DROP POLICY IF EXISTS "candidates_insert_anon" ON public.candidates;
DROP POLICY IF EXISTS "candidates_insert_auth" ON public.candidates;

CREATE POLICY "candidates_insert_auth"
ON public.candidates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Mantém proteção contra candidatura duplicada por usuário e vaga.
ALTER TABLE public.candidates DROP CONSTRAINT IF EXISTS uq_candidate_user_job;
ALTER TABLE public.candidates ADD CONSTRAINT uq_candidate_user_job UNIQUE (user_id, job_id);

-- Corrige vagas já criadas com departamento vazio usando a área pública do cargo.
UPDATE public.jobs AS j
SET department = COALESCE(NULLIF(BTRIM(r.area), ''), NULLIF(BTRIM(r.department), ''), j.department)
FROM public.roles AS r
WHERE j.role_id = r.id
  AND (j.department IS NULL OR BTRIM(j.department) = '')
  AND (
    NULLIF(BTRIM(r.area), '') IS NOT NULL
    OR NULLIF(BTRIM(r.department), '') IS NOT NULL
  );
