-- ============================================================
-- Migration 019 — Busca de candidatos e skills agregadas
-- ============================================================

-- 1. Adiciona coluna skills em jobs para associar hard skills estruturadas
ALTER TABLE public.jobs
    ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_jobs_skills ON public.jobs USING GIN (skills);

COMMENT ON COLUMN public.jobs.skills IS 'Hard skills requeridas pela vaga (TEXT[])';

-- ============================================================
-- 2. Função principal de busca de candidatos
--    Chamada via: supabase.rpc('search_candidates', {...})
-- ============================================================

-- Remove todas as versões anteriores da função (evita erro 42725)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT oid::regprocedure AS sig
        FROM pg_proc
        WHERE proname = 'search_candidates'
          AND pronamespace = 'public'::regnamespace
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || r.sig || ' CASCADE';
    END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.search_candidates(
    p_search_query  TEXT    DEFAULT NULL,   -- nome ou e-mail (ILIKE)
    p_skills        TEXT[]  DEFAULT NULL,   -- intersecção com candidates.skills
    p_competencies  TEXT[]  DEFAULT NULL,   -- intersecção com candidates.competencies
    p_min_salary    NUMERIC DEFAULT NULL,
    p_max_salary    NUMERIC DEFAULT NULL,
    p_location      TEXT    DEFAULT NULL,   -- cidade (ILIKE)
    p_availability  TEXT    DEFAULT NULL,   -- valor exato de candidates.availability
    p_search_status TEXT    DEFAULT NULL    -- 'Ativo' | 'Arquivado'
)
RETURNS SETOF public.candidates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT c.*
    FROM candidates c
    WHERE
        -- Texto livre: nome ou e-mail
        (
            p_search_query IS NULL
            OR c.name  ILIKE '%' || p_search_query || '%'
            OR c.email ILIKE '%' || p_search_query || '%'
        )

        -- Hard skills: candidato deve ter ao menos 1 skill da lista
        AND (
            p_skills IS NULL
            OR cardinality(p_skills) = 0
            OR c.skills && p_skills
        )

        -- Competências
        AND (
            p_competencies IS NULL
            OR cardinality(p_competencies) = 0
            OR c.competencies && p_competencies
        )

        -- Pretensão salarial
        AND (p_min_salary IS NULL OR c.pretension_max IS NULL OR c.pretension_max >= p_min_salary)
        AND (p_max_salary IS NULL OR c.pretension_min IS NULL OR c.pretension_min <= p_max_salary)

        -- Localização: busca parcial por cidade
        AND (
            p_location IS NULL
            OR p_location = ''
            OR c.location ILIKE '%' || p_location || '%'
        )

        -- Disponibilidade: valor exato (ex: 'Imediata', '15 dias', '30 dias')
        AND (
            p_availability IS NULL
            OR p_availability = ''
            OR c.availability = p_availability
        )

        -- Status: 'Ativo' = não finalizado; 'Arquivado' = rejeitado/contratado
        AND (
            p_search_status IS NULL
            OR p_search_status = ''
            OR (
                p_search_status = 'Ativo'
                AND c.column_id NOT IN ('rejected', 'hired')
            )
            OR (
                p_search_status = 'Arquivado'
                AND c.column_id IN ('rejected', 'hired')
            )
        )

    ORDER BY c.applied_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_candidates TO authenticated, anon;

-- ============================================================
-- 3. Agrega todas as skills únicas (candidatos + vagas)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_all_skills()
RETURNS TEXT[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        ARRAY_AGG(DISTINCT skill ORDER BY skill),
        '{}'::TEXT[]
    )
    FROM (
        SELECT UNNEST(skills) AS skill
        FROM candidates
        WHERE skills IS NOT NULL AND array_length(skills, 1) > 0

        UNION ALL

        SELECT UNNEST(skills) AS skill
        FROM jobs
        WHERE skills IS NOT NULL AND array_length(skills, 1) > 0
    ) s
    WHERE skill IS NOT NULL AND TRIM(skill) <> '';
$$;

GRANT EXECUTE ON FUNCTION public.get_all_skills TO authenticated, anon;

-- ============================================================
-- 4. Agrega todas as cidades únicas dos candidatos
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_all_locations()
RETURNS TEXT[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        ARRAY_AGG(DISTINCT location ORDER BY location),
        '{}'::TEXT[]
    )
    FROM candidates
    WHERE location IS NOT NULL AND TRIM(location) <> '';
$$;

GRANT EXECUTE ON FUNCTION public.get_all_locations TO authenticated, anon;

-- Confirmação
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 019 aplicada: search_candidates, get_all_skills, get_all_locations';
END $$;
