-- Remove políticas de acesso público (anon) no bucket resumes.
-- "Currículos são visíveis publicamente" permitia SELECT sem autenticação.
-- "resumes_insert_public" permitia INSERT sem autenticação.
-- Ambas foram substituídas pelas políticas authenticated já existentes:
--   resumes_secure_select (SELECT authenticated) e
--   "Candidatos podem enviar currículos" (INSERT authenticated).

DROP POLICY IF EXISTS "Currículos são visíveis publicamente" ON storage.objects;
DROP POLICY IF EXISTS "resumes_insert_public" ON storage.objects;
