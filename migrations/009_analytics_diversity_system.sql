-- 1. Create candidate_demographics (Segregated Table)
CREATE TABLE IF NOT EXISTS public.candidate_demographics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    gender TEXT CHECK (gender IN ('male', 'female', 'non_binary', 'other', 'prefer_not_to_say')),
    race TEXT CHECK (race IN ('white', 'black', 'brown', 'yellow', 'indigenous', 'prefer_not_to_say')),
    is_pcd BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(candidate_id)
);

-- 2. Enable RLS
ALTER TABLE public.candidate_demographics ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Completely block SELECT for standard users (Privacy by Design)
-- Only Service Role or Security Definer functions can read.
DROP POLICY IF EXISTS "Deny direct read access" ON public.candidate_demographics;
CREATE POLICY "Deny direct read access" ON public.candidate_demographics FOR SELECT USING (false);

-- Allow Insert for all (must match candidate creation flow)
DROP POLICY IF EXISTS "Allow insert for all" ON public.candidate_demographics;
CREATE POLICY "Allow insert for all" ON public.candidate_demographics FOR INSERT WITH CHECK (true);

-- Allow Update if user owns the candidate (using users table link)
DROP POLICY IF EXISTS "Allow update own" ON public.candidate_demographics;
CREATE POLICY "Allow update own" ON public.candidate_demographics FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.candidates c 
    WHERE c.id = candidate_demographics.candidate_id 
    AND c.user_id = auth.uid()
  )
);

-- 4. Secure RPC for Dashboard (Aggregated Data Only)
CREATE OR REPLACE FUNCTION public.get_funnel_diversity_metrics(
    p_job_id UUID DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    stage text,
    category text,
    bucket text,
    count_safe text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    min_threshold INT := 10;
BEGIN
    -- Permission Check: Only Admin/RH/Manager
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'recruiter', 'manager')
    ) THEN 
        RAISE EXCEPTION 'Access Denied';
    END IF;

    -- Audit Log
    INSERT INTO public.audit_logs (user_id, action, entity_type, new_values)
    VALUES (auth.uid(), 'VIEW_DIVERSITY_METRICS', 'analytics', jsonb_build_object('job_id', p_job_id, 'start', p_start_date));

    RETURN QUERY
    WITH raw_data AS (
        SELECT 
            c.column_id as stage_id,
            d.gender,
            d.race,
            d.is_pcd
        FROM public.candidate_demographics d
        JOIN public.candidates c ON c.id = d.candidate_id
        WHERE 
            (p_job_id IS NULL OR c.job_id = p_job_id)
            AND (p_start_date IS NULL OR c.applied_at >= p_start_date)
            AND (p_end_date IS NULL OR c.applied_at <= p_end_date)
    ),
    gender_counts AS (
        SELECT stage_id, 'gender'::text as cat, COALESCE(gender, 'unknown') as buck, count(*) as total FROM raw_data GROUP BY 1, 3
    ),
    race_counts AS (
        SELECT stage_id, 'race'::text as cat, COALESCE(race, 'unknown') as buck, count(*) as total FROM raw_data GROUP BY 1, 3
    ),
    pcd_counts AS (
        SELECT stage_id, 'pcd'::text as cat, CASE WHEN is_pcd THEN 'Sim' ELSE 'Não' END as buck, count(*) as total FROM raw_data GROUP BY 1, 3
    ),
    all_counts AS (
        SELECT * FROM gender_counts
        UNION ALL
        SELECT * FROM race_counts
        UNION ALL
        SELECT * FROM pcd_counts
    )
    SELECT 
        stage_id,
        cat,
        buck,
        CASE 
            WHEN total < min_threshold THEN 'Dados Insuficientes' 
            ELSE total::text 
        END
    FROM all_counts;
END;
$$;
