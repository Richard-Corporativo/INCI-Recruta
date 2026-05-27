-- Permite que candidatos atualizem seus próprios dados demográficos
-- (simetria com candidate_demographics_insert_auth que já existe para INSERT)
DROP POLICY IF EXISTS "candidate_demographics_update_auth" ON public.candidate_demographics;
CREATE POLICY "candidate_demographics_update_auth"
  ON public.candidate_demographics
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM candidates c
    WHERE c.id = candidate_demographics.candidate_id
      AND c.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM candidates c
    WHERE c.id = candidate_demographics.candidate_id
      AND c.user_id = auth.uid()
  ));
