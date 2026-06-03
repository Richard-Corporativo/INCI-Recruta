-- Migration: 20260602_fix_candidate_base_profile_rls.sql
-- Corrige recursão infinita na policy candidates_select_base_profile_for_staff.
-- O EXISTS original consultava candidates novamente, ativando a mesma policy em loop.
-- Solução: função SECURITY DEFINER que bypassa RLS para checar a existência da candidatura.

CREATE OR REPLACE FUNCTION public.candidate_has_application_in_company(p_user_id uuid, p_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.candidates
        WHERE user_id = p_user_id
          AND job_id IS NOT NULL
          AND company_id = p_company_id
    );
$$;

-- Recriar a policy usando a função para evitar recursão
DROP POLICY IF EXISTS "candidates_select_base_profile_for_staff" ON public.candidates;

CREATE POLICY "candidates_select_base_profile_for_staff"
ON public.candidates
FOR SELECT TO authenticated
USING (
    job_id IS NULL
    AND public.is_staff_member()
    AND public.candidate_has_application_in_company(candidates.user_id, public.current_company_id())
);
