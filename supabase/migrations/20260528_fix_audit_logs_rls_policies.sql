-- Migration: 20260528_fix_audit_logs_rls_policies.sql
-- Description: Fix critical audit_logs RLS policies - add missing INSERT policy and correct broken SELECT policy
-- Impact: Enables audit logging functionality and fixes company-based filtering

-- Drop broken SELECT policy (was comparing UUID to text: audit_logs.company_id::text = users.company_name)
DROP POLICY IF EXISTS "Allow admins to read their company audit logs" ON public.audit_logs;

-- Create corrected SELECT policy using company_members table for accurate company isolation
CREATE POLICY "audit_logs_select_company" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.user_id = auth.uid()
        AND cm.company_id = audit_logs.company_id
        AND cm.role IN ('admin', 'manager', 'recruiter', 'owner')
    )
  );

-- Create INSERT policy: authenticated users can insert audit logs recording their own actions
-- This was the root cause of audit logs being silently blocked (no INSERT policy with RLS enabled)
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
