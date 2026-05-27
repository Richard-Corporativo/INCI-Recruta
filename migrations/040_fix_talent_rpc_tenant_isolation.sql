-- Migration 040: Corrige isolamento multitenant nas RPCs do Banco de Talentos
-- Problema: get_all_skills, get_all_locations e search_candidates retornavam dados
-- de todos os tenants — qualquer empresa via via skills/localizações de outra empresa.
-- Correção: Filtrar por current_company_id() em todas as funções.

-- DROP prévio necessário quando o tipo de retorno mudou
-- (CREATE OR REPLACE não permite alterar RETURNS)
DROP FUNCTION IF EXISTS public.get_all_skills();
DROP FUNCTION IF EXISTS public.get_all_locations();
DROP FUNCTION IF EXISTS public.search_candidates(text, text[], text[], numeric, numeric, text, text, text);

-- ============================================================
-- get_all_skills: retorna skills distintas da empresa do usuário
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_all_skills()
RETURNS TABLE(skill text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    v_company_id := public.current_company_id();
    IF v_company_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT DISTINCT unnest(c.skills)
    FROM public.candidates c
    WHERE c.company_id = v_company_id
      AND c.skills IS NOT NULL
    ORDER BY 1;
END;
$$;

-- ============================================================
-- get_all_locations: retorna localizações distintas da empresa
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_all_locations()
RETURNS TABLE(location text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    v_company_id := public.current_company_id();
    IF v_company_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT DISTINCT c.location
    FROM public.candidates c
    WHERE c.company_id = v_company_id
      AND c.location IS NOT NULL
      AND c.location <> ''
    ORDER BY 1;
END;
$$;

-- ============================================================
-- search_candidates: busca avançada restrita ao tenant atual
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_candidates(
    p_search_query   text    DEFAULT NULL,
    p_skills         text[]  DEFAULT NULL,
    p_competencies   text[]  DEFAULT NULL,
    p_min_salary     numeric DEFAULT NULL,
    p_max_salary     numeric DEFAULT NULL,
    p_location       text    DEFAULT NULL,
    p_availability   text    DEFAULT NULL,
    p_search_status  text    DEFAULT NULL
)
RETURNS SETOF public.candidates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    v_company_id := public.current_company_id();
    IF v_company_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT c.*
    FROM public.candidates c
    WHERE c.company_id = v_company_id
      AND (
        p_search_query IS NULL
        OR c.name ILIKE '%' || p_search_query || '%'
        OR c.email ILIKE '%' || p_search_query || '%'
        OR c.location ILIKE '%' || p_search_query || '%'
      )
      AND (p_skills IS NULL       OR c.skills && p_skills)
      AND (p_competencies IS NULL OR c.competencies && p_competencies)
      AND (p_min_salary IS NULL   OR c.pretension_max >= p_min_salary OR c.pretension_min >= p_min_salary)
      AND (p_max_salary IS NULL   OR c.pretension_min <= p_max_salary OR c.pretension_max <= p_max_salary)
      AND (p_location IS NULL     OR c.location ILIKE '%' || p_location || '%')
      AND (p_availability IS NULL OR c.availability = p_availability)
      AND (p_search_status IS NULL OR c.column_id = p_search_status)
    ORDER BY c.applied_at DESC
    LIMIT 500;
END;
$$;

-- Garantir que anon não tem acesso (reforço da migration 20260514)
REVOKE EXECUTE ON FUNCTION public.get_all_skills() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_all_locations() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.search_candidates(text, text[], text[], numeric, numeric, text, text, text) FROM anon, PUBLIC;

-- Conceder apenas para authenticated
GRANT EXECUTE ON FUNCTION public.get_all_skills() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_locations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_candidates(text, text[], text[], numeric, numeric, text, text, text) TO authenticated;
