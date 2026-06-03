-- Migration: 20260601_fix_candidate_base_profile_rls.sql
-- Contexto: perfis base (job_id IS NULL) têm company_id = NULL e são bloqueados
-- pela policy candidates_select_tenant para admins. Esta policy adicional permite
-- que staff leia perfis base de candidatos que têm candidatura na empresa deles.

CREATE POLICY "candidates_select_base_profile_for_staff"
ON public.candidates
FOR SELECT TO authenticated
USING (
    job_id IS NULL
    AND public.is_staff_member()
    AND EXISTS (
        SELECT 1
        FROM public.candidates apps
        WHERE apps.user_id = candidates.user_id
          AND apps.job_id IS NOT NULL
          AND apps.company_id = public.current_company_id()
    )
);
