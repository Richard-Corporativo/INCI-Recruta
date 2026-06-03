-- Permite que staff (admin/recruiter/manager/owner) atualize candidatos da empresa.
-- Necessário para mover candidatos no kanban e agendamento de entrevistas.

DROP POLICY IF EXISTS "candidates_update_staff" ON public.candidates;

CREATE POLICY "candidates_update_staff" ON public.candidates
  FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.is_staff_member()
  )
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.is_staff_member()
  );
