-- A FK ON DELETE SET NULL em audit_logs.job_id conflita com o trigger
-- de imutabilidade (audit_logs_no_update): ao deletar um job, o Postgres
-- tenta SET NULL internamente via UPDATE, que é bloqueado pelo trigger.
-- Audit logs são registros históricos — devem preservar o job_id original.
ALTER TABLE public.audit_logs
  DROP CONSTRAINT IF EXISTS audit_logs_job_id_fkey;
