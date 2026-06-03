-- Torna audit_logs completamente imutáveis no nível do banco.
-- Nenhuma policy RLS, service_role ou superuser pode deletar/atualizar registros.
-- Incidente 2026-05-28: 26 logs perdidos permanentemente por ausência de proteção.

CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RAISE EXCEPTION
        'audit_logs são imutáveis. DELETE e UPDATE não são permitidos. (operation=%, id=%)',
        TG_OP, COALESCE(OLD.id::text, 'unknown');
END;
$$;

-- Impede DELETE
CREATE TRIGGER audit_logs_no_delete
    BEFORE DELETE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- Impede UPDATE
CREATE TRIGGER audit_logs_no_update
    BEFORE UPDATE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- Remove a RPC que permitia deleção via service_role
DROP FUNCTION IF EXISTS public.delete_job_audit_logs(uuid);
