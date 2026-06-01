-- supabase/migrations/20260601_fix_recommended_jobs_company_filter.sql
-- Correção: filtrar vagas recomendadas pela empresa do candidato
-- Problema: a função retornava vagas de TODAS as empresas para qualquer candidato

CREATE OR REPLACE FUNCTION public.get_recommended_jobs_for_candidate(p_user_id UUID)
RETURNS TABLE (
    job_id                TEXT,
    title                 TEXT,
    department            TEXT,
    location              TEXT,
    model                 TEXT,
    contract              TEXT,
    seniority             TEXT,
    salary_min            NUMERIC,
    salary_max            NUMERIC,
    urgency               TEXT,
    created_at            TIMESTAMPTZ,
    registration_deadline TEXT,
    match_score           INT,
    match_reasons         TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_candidate         RECORD;
    v_candidate_company_id UUID;
    v_skills_score      INT;
    v_location_score    INT;
    v_seniority_score   INT;
    v_avail_score       INT;
    v_model_score       INT;
    v_cand_skills       TEXT[];
    v_job_skills        TEXT[];
    v_matched_skills    INT;
    v_skill             TEXT;
    v_jskill            TEXT;
    v_cand_loc_norm     TEXT;
    v_job_loc_norm      TEXT;
    v_cand_state        TEXT;
    v_job_state         TEXT;
    v_seniority_map     TEXT[] := ARRAY['estagio','junior','pleno','senior','especialista','lideranca'];
    v_cand_sen          TEXT;
    v_job_sen           TEXT;
    v_cand_sen_idx      INT;
    v_job_sen_idx       INT;
    v_idx               INT;
    v_desired_model     TEXT;
    v_job_model_norm    TEXT;
    v_cand_avail        TEXT;
    v_total             INT;
    v_reasons           TEXT[];
    v_job               RECORD;
BEGIN
    -- Perfil canônico + company_id do candidato
    SELECT c.id, c.skills, c.location, c.availability,
           c.pretension_min, c.pretension_max, c.search_status, c.desired_work_model,
           c.company_id
    INTO v_candidate
    FROM candidates c
    WHERE c.user_id = p_user_id
    ORDER BY (c.job_id IS NULL) DESC, c.applied_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    v_candidate_company_id := v_candidate.company_id;

    -- Se company_id não resolvível, não expor vagas de outros tenants
    IF v_candidate_company_id IS NULL THEN
        RETURN;
    END IF;

    IF v_candidate.skills IS NOT NULL AND array_length(v_candidate.skills, 1) > 0 THEN
        SELECT ARRAY(SELECT lower(trim(s)) FROM unnest(v_candidate.skills) AS s WHERE trim(s) <> '')
        INTO v_cand_skills;
    ELSE
        v_cand_skills := ARRAY[]::TEXT[];
    END IF;
    v_cand_loc_norm := lower(trim(coalesce(v_candidate.location, '')));
    v_cand_state    := trim(split_part(v_cand_loc_norm, ',', 2));
    v_cand_avail    := lower(trim(coalesce(v_candidate.availability, '')));
    v_desired_model := lower(trim(coalesce(v_candidate.desired_work_model, '')));
    v_cand_sen      := lower(trim(coalesce(v_candidate.search_status, '')));
    v_cand_sen      := replace(replace(replace(replace(v_cand_sen, 'ú', 'u'), 'ã', 'a'), 'é', 'e'), 'ê', 'e');
    v_cand_sen_idx  := NULL;
    FOR v_idx IN 1..array_length(v_seniority_map, 1) LOOP
        IF v_cand_sen ILIKE '%' || v_seniority_map[v_idx] || '%' THEN
            v_cand_sen_idx := v_idx; EXIT;
        END IF;
    END LOOP;

    -- CORREÇÃO PRINCIPAL: filtrar por company_id da empresa do candidato
    FOR v_job IN
        SELECT j.id::TEXT AS job_id, j.title, j.department, j.location, j.model,
               j.contract, j.seniority, j.salary_min, j.salary_max, j.urgency,
               j.created_at, j.registration_deadline::TEXT AS registration_deadline, j.requirements
        FROM jobs j
        WHERE j.status = 'Ativa'
          AND j.workflow_status = 'published'
          AND j.company_id = v_candidate_company_id
          AND j.id::TEXT NOT IN (
              SELECT c2.job_id::TEXT FROM candidates c2
              WHERE c2.user_id = p_user_id AND c2.job_id IS NOT NULL
          )
        ORDER BY j.created_at DESC
    LOOP
        v_skills_score := 0; v_location_score := 0; v_seniority_score := 0;
        v_avail_score := 0; v_model_score := 0; v_reasons := ARRAY[]::TEXT[]; v_matched_skills := 0;

        -- Skills (45pts)
        IF array_length(v_cand_skills, 1) > 0 AND coalesce(v_job.requirements, '') <> '' THEN
            SELECT ARRAY(SELECT lower(trim(r)) FROM regexp_split_to_table(v_job.requirements, E'[,;\n\r]+') AS r WHERE trim(r) <> '') INTO v_job_skills;
            IF v_job_skills IS NOT NULL AND array_length(v_job_skills, 1) > 0 THEN
                FOREACH v_skill IN ARRAY v_cand_skills LOOP
                    FOREACH v_jskill IN ARRAY v_job_skills LOOP
                        IF v_jskill ILIKE '%' || v_skill || '%' OR v_skill ILIKE '%' || v_jskill || '%' THEN
                            v_matched_skills := v_matched_skills + 1; EXIT;
                        END IF;
                    END LOOP;
                END LOOP;
            END IF;
            v_skills_score := LEAST(45, ROUND((v_matched_skills::NUMERIC / GREATEST(array_length(v_cand_skills, 1), 1)) * 45));
            IF v_matched_skills > 0 THEN v_reasons := v_reasons || (v_matched_skills::TEXT || ' habilidade(s) compatível(is)'); END IF;
        ELSE
            v_skills_score := 10;
        END IF;

        -- Localização (20pts)
        v_job_loc_norm := lower(trim(coalesce(v_job.location, ''))); v_job_state := trim(split_part(v_job_loc_norm, ',', 2));
        IF v_job.model ILIKE '%remoto%' THEN v_location_score := 20; v_reasons := v_reasons || 'vaga remota';
        ELSIF v_cand_loc_norm <> '' AND v_job_loc_norm <> '' THEN
            IF v_job_loc_norm = v_cand_loc_norm THEN v_location_score := 20; v_reasons := v_reasons || 'mesma cidade';
            ELSIF v_job_state <> '' AND v_cand_state <> '' AND v_job_state = v_cand_state THEN v_location_score := 10; v_reasons := v_reasons || 'mesmo estado';
            END IF;
        END IF;

        -- Senioridade (15pts)
        v_job_sen := lower(trim(coalesce(v_job.seniority, '')));
        v_job_sen := replace(replace(replace(replace(v_job_sen, 'ú', 'u'), 'ã', 'a'), 'é', 'e'), 'ê', 'e');
        v_job_sen_idx := NULL;
        FOR v_idx IN 1..array_length(v_seniority_map, 1) LOOP
            IF v_job_sen ILIKE '%' || v_seniority_map[v_idx] || '%' THEN v_job_sen_idx := v_idx; EXIT; END IF;
        END LOOP;
        IF v_cand_sen_idx IS NOT NULL AND v_job_sen_idx IS NOT NULL THEN
            IF v_cand_sen_idx = v_job_sen_idx THEN v_seniority_score := 15; v_reasons := v_reasons || 'senioridade compatível';
            ELSIF abs(v_cand_sen_idx - v_job_sen_idx) = 1 THEN v_seniority_score := 8; v_reasons := v_reasons || 'senioridade próxima';
            END IF;
        ELSIF v_job_sen = '' OR v_cand_sen = '' THEN v_seniority_score := 7;
        END IF;

        -- Disponibilidade (10pts)
        IF v_cand_avail ILIKE '%imed%' OR v_cand_avail = '' THEN
            v_avail_score := 10;
            IF v_job.urgency = 'Alta' THEN v_reasons := v_reasons || 'disponível para vaga urgente'; END IF;
        ELSIF v_job.urgency = 'Alta' AND v_cand_avail ILIKE '%15%' THEN v_avail_score := 7;
        ELSIF v_job.urgency = 'Média' THEN v_avail_score := 7;
        ELSE v_avail_score := 5;
        END IF;

        -- Modalidade (10pts)
        v_job_model_norm := lower(trim(coalesce(v_job.model, '')));
        IF v_desired_model = '' THEN v_model_score := 5;
        ELSIF v_desired_model = v_job_model_norm THEN v_model_score := 10; v_reasons := v_reasons || ('modalidade ' || v_job.model || ' compatível');
        ELSIF (v_desired_model ILIKE '%hibrido%') AND (v_job_model_norm ILIKE '%hibrido%') THEN v_model_score := 10; v_reasons := v_reasons || ('modalidade ' || v_job.model || ' compatível');
        ELSIF v_desired_model ILIKE '%remoto%' AND v_job_model_norm ILIKE '%remoto%' THEN v_model_score := 10; v_reasons := v_reasons || 'trabalho remoto';
        ELSIF v_desired_model ILIKE '%hibrido%' THEN v_model_score := 5;
        ELSE v_model_score := 2;
        END IF;

        v_total := LEAST(100, GREATEST(0, v_skills_score + v_location_score + v_seniority_score + v_avail_score + v_model_score));
        job_id := v_job.job_id; title := v_job.title; department := v_job.department; location := v_job.location;
        model := v_job.model; contract := v_job.contract; seniority := v_job.seniority;
        salary_min := v_job.salary_min; salary_max := v_job.salary_max; urgency := v_job.urgency;
        created_at := v_job.created_at; registration_deadline := v_job.registration_deadline;
        match_score := v_total; match_reasons := v_reasons;
        RETURN NEXT;
    END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_recommended_jobs_for_candidate(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_recommended_jobs_for_candidate(UUID) FROM PUBLIC;
