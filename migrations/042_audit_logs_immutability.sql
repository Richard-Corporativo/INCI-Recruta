-- Garantir imutabilidade dos audit_logs
-- Bloqueia DELETE e UPDATE para qualquer usuário autenticado.
-- Logs de auditoria são prova forense/LGPD — não podem ser alterados ou removidos
-- pela aplicação. A função cleanup_old_audit_logs() opera via SECURITY DEFINER
-- e não é afetada por estas policies.

CREATE POLICY "audit_logs_deny_delete"
  ON public.audit_logs FOR DELETE TO authenticated
  USING (FALSE);

CREATE POLICY "audit_logs_deny_update"
  ON public.audit_logs FOR UPDATE TO authenticated
  USING (FALSE);
