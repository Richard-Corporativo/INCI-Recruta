-- Corrige o ON CONFLICT da função transition_candidate_stage.
-- ON CONFLICT ON CONSTRAINT requer um constraint criado via ADD CONSTRAINT.
-- uq_candidate_stage_open é um índice parcial (CREATE UNIQUE INDEX), não um
-- constraint nomeado em pg_constraint — a sintaxe correta é a forma de inferência.
CREATE OR REPLACE FUNCTION public.transition_candidate_stage(
  p_candidate_id  uuid,
  p_old_stage_id  text,
  p_new_stage_id  text,
  p_company_id    uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_open_row  candidate_stage_history%ROWTYPE;
  v_new_id    uuid;
BEGIN
  SELECT * INTO v_open_row
  FROM candidate_stage_history
  WHERE candidate_id = p_candidate_id
    AND stage_id     = p_old_stage_id
    AND exit_time    IS NULL
  ORDER BY entry_time DESC
  LIMIT 1
  FOR UPDATE;

  IF v_open_row.id IS NOT NULL THEN
    UPDATE candidate_stage_history
    SET
      exit_time        = NOW(),
      duration_seconds = EXTRACT(EPOCH FROM (NOW() - v_open_row.entry_time))::INTEGER
    WHERE id = v_open_row.id;
  END IF;

  INSERT INTO candidate_stage_history (candidate_id, company_id, stage_id, entry_time)
  VALUES (p_candidate_id, p_company_id, p_new_stage_id, NOW())
  ON CONFLICT (candidate_id, stage_id) WHERE exit_time IS NULL
  DO NOTHING
  RETURNING id INTO v_new_id;

  IF v_new_id IS NULL THEN
    SELECT id INTO v_new_id
    FROM candidate_stage_history
    WHERE candidate_id = p_candidate_id
      AND stage_id     = p_new_stage_id
      AND exit_time    IS NULL
    LIMIT 1;
  END IF;

  RETURN v_new_id;
END;
$$;
