CREATE OR REPLACE FUNCTION delete_job_audit_logs(p_job_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_deleted INTEGER;
BEGIN
  SELECT cm.role INTO v_role
  FROM company_members cm
  WHERE cm.user_id = auth.uid()
    AND cm.company_id = (
      SELECT company_id FROM audit_logs WHERE job_id = p_job_id LIMIT 1
    )
  LIMIT 1;

  IF v_role IS NULL OR v_role NOT IN ('admin', 'owner', 'manager') THEN
    RAISE EXCEPTION 'Permissão negada: apenas admin, owner ou manager podem apagar logs de auditoria.';
  END IF;

  DELETE FROM audit_logs WHERE job_id = p_job_id;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;
