BEGIN;

-- Safety: close duplicate open entries before creating the unique index.
-- Keeps the most recent entry_time per candidate+stage, closes the rest.
UPDATE public.candidate_stage_history
SET exit_time = NOW(), duration_seconds = 0
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY candidate_id, stage_id
             ORDER BY entry_time DESC
           ) AS rn
    FROM public.candidate_stage_history
    WHERE exit_time IS NULL
  ) ranked
  WHERE rn > 1
);

-- Partial unique index: only one open row per candidate+stage at a time.
CREATE UNIQUE INDEX IF NOT EXISTS uq_candidate_stage_open
  ON public.candidate_stage_history(candidate_id, stage_id)
  WHERE exit_time IS NULL;

-- Atomic RPC replacing the 3-query client-side sequence.
-- SECURITY INVOKER: runs as the authenticated caller — RLS applies normally.
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
  -- Lock the open row for the old stage.
  -- FOR UPDATE (no SKIP LOCKED): concurrent callers block here, then find
  -- exit_time already set and skip the UPDATE — preventing double-update.
  SELECT * INTO v_open_row
  FROM candidate_stage_history
  WHERE candidate_id = p_candidate_id
    AND stage_id     = p_old_stage_id
    AND exit_time    IS NULL
  ORDER BY entry_time DESC
  LIMIT 1
  FOR UPDATE;

  -- Close the old entry using server-side duration (DB clock, not client clock).
  IF v_open_row.id IS NOT NULL THEN
    UPDATE candidate_stage_history
    SET
      exit_time        = NOW(),
      duration_seconds = EXTRACT(EPOCH FROM (NOW() - v_open_row.entry_time))::INTEGER
    WHERE id = v_open_row.id;
  END IF;

  -- Open a new entry for the new stage. ON CONFLICT handles concurrent inserts.
  INSERT INTO candidate_stage_history (candidate_id, company_id, stage_id, entry_time)
  VALUES (p_candidate_id, p_company_id, p_new_stage_id, NOW())
  ON CONFLICT ON CONSTRAINT uq_candidate_stage_open
  DO NOTHING
  RETURNING id INTO v_new_id;

  -- If ON CONFLICT suppressed the insert, fetch the pre-existing open row's id.
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

REVOKE ALL ON FUNCTION public.transition_candidate_stage(uuid, text, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transition_candidate_stage(uuid, text, text, uuid) TO authenticated;

COMMIT;
