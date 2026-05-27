-- Garante no banco que publicação/aprovação de vagas não dependa apenas da UI.
-- Rascunhos podem ser editados por staff, mas publicar exige owner/admin/quality.

CREATE OR REPLACE FUNCTION public.enforce_job_publication_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_can_publish boolean := false;
  v_is_publication_change boolean := false;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_is_publication_change := (
      COALESCE(NEW.workflow_status, 'draft') IN ('approved', 'published')
      OR NEW.status = 'Ativa'
      OR NEW.approval_status = 'Aprovado'
    );
  ELSE
    v_is_publication_change := (
      (NEW.workflow_status IS DISTINCT FROM OLD.workflow_status AND NEW.workflow_status IN ('approved', 'published'))
      OR (NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'Ativa')
      OR (NEW.approval_status IS DISTINCT FROM OLD.approval_status AND NEW.approval_status = 'Aprovado')
    );
  END IF;

  IF v_is_publication_change THEN
    SELECT
      public.is_super_admin()
      OR EXISTS (
        SELECT 1
        FROM public.company_members cm
        WHERE cm.user_id = (SELECT auth.uid())
          AND cm.company_id = NEW.company_id
          AND cm.role IN ('owner', 'admin', 'quality')
          AND cm.status = 'active'
      )
    INTO v_can_publish;

    IF NOT COALESCE(v_can_publish, false) THEN
      RAISE EXCEPTION 'Apenas Owner, Admin ou Qualidade podem aprovar e publicar vagas.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.workflow_status = 'published' THEN
      NEW.status := 'Ativa';
      NEW.approval_status := 'Aprovado';
    ELSIF NEW.workflow_status = 'approved' THEN
      NEW.approval_status := 'Aprovado';
    ELSIF NEW.workflow_status = 'pending_approval' THEN
      NEW.approval_status := 'Pendente';
    ELSIF NEW.workflow_status = 'draft' THEN
      NEW.status := 'Rascunho';
      NEW.approval_status := 'Rascunho';
    END IF;
  ELSIF NEW.workflow_status IS DISTINCT FROM OLD.workflow_status THEN
    IF NEW.workflow_status = 'published' THEN
      NEW.status := 'Ativa';
      NEW.approval_status := 'Aprovado';
    ELSIF NEW.workflow_status = 'approved' THEN
      NEW.approval_status := 'Aprovado';
    ELSIF NEW.workflow_status = 'pending_approval' THEN
      NEW.approval_status := 'Pendente';
    ELSIF NEW.workflow_status = 'draft' THEN
      NEW.status := 'Rascunho';
      NEW.approval_status := 'Rascunho';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_job_publication_workflow ON public.jobs;

CREATE TRIGGER trg_enforce_job_publication_workflow
BEFORE INSERT OR UPDATE OF status, workflow_status, approval_status
ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.enforce_job_publication_workflow();
