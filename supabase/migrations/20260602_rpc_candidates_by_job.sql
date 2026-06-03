-- RPC: get_candidates_by_job
-- Replaces the 2-query N+1 pattern in candidate.service.ts getCandidatesByJob.
-- Does a single LEFT JOIN between job applications and base profiles (job_id IS NULL),
-- coalescing skills/experience/education/summary/languages from the base profile
-- when the application row has empty values.
-- Feedbacks are aggregated via a single GROUP BY scan (not N correlated subqueries).

CREATE OR REPLACE FUNCTION get_candidates_by_job(p_job_id UUID)
RETURNS SETOF jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    to_jsonb(app)
    || jsonb_build_object(
      'summary',    CASE WHEN app.summary   IS NULL OR app.summary   = ''          THEN base.summary    ELSE app.summary    END,
      'skills',     CASE WHEN app.skills    IS NULL OR array_length(app.skills,    1) IS NULL THEN base.skills    ELSE app.skills    END,
      'languages',  CASE WHEN app.languages IS NULL OR array_length(app.languages, 1) IS NULL THEN base.languages ELSE app.languages END,
      'experience', CASE WHEN app.experience IS NULL OR app.experience = '[]'::jsonb THEN base.experience ELSE app.experience END,
      'education',  CASE WHEN app.education  IS NULL OR app.education  = '[]'::jsonb THEN base.education  ELSE app.education  END,
      'feedbacks',  COALESCE(fb.feedbacks_agg, '[]'::json)
    )
  FROM candidates app
  LEFT JOIN candidates base
    ON base.user_id = app.user_id AND base.job_id IS NULL
  LEFT JOIN (
    SELECT candidate_id, json_agg(f.*) AS feedbacks_agg
    FROM feedbacks f
    GROUP BY candidate_id
  ) fb ON fb.candidate_id = app.id
  WHERE app.job_id = p_job_id
    AND app.company_id = current_company_id()
  ORDER BY app.applied_at DESC;
$$;

-- Grant execute to authenticated users (RPC is SECURITY DEFINER, tenant-isolated via current_company_id())
GRANT EXECUTE ON FUNCTION get_candidates_by_job(UUID) TO authenticated;
