-- Índices compostos para queries multi-coluna frequentes
-- Os índices simples (user_id, job_id) já existem em 20260513.
-- Índices compostos são necessários para WHERE user_id = X AND job_id IS NULL / IS NOT NULL.

-- candidates: baseProfile query (user_id + job_id IS NULL) e applications query (user_id + job_id IS NOT NULL)
CREATE INDEX IF NOT EXISTS idx_candidates_user_id_job_id
    ON public.candidates(user_id, job_id);

-- company_members: usado no middleware, AuthContext e tenant.ts (3× por navegação)
CREATE INDEX IF NOT EXISTS idx_company_members_user_id_status
    ON public.company_members(user_id, status);

-- interviews: useCandidateData busca por candidate_id após ter appIds
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id
    ON public.interviews(candidate_id);
