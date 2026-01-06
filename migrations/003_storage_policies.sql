-- ============================================
-- STORAGE POLICIES CONFIGURATION
-- Execute no Supabase SQL Editor
-- ============================================

-- IMPORTANTE: Se este script falhar, configure via Dashboard:
-- Supabase Dashboard > Storage > Policies > resumes

-- ============================================
-- Limpar policies antigas
-- ============================================

DROP POLICY IF EXISTS "resumes_insert_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_update_own" ON storage.objects;
DROP POLICY IF EXISTS "resumes_delete_own" ON storage.objects;

-- ============================================
-- Criar novas policies
-- ============================================

-- Policy 1: Qualquer pessoa pode fazer upload de currículos
CREATE POLICY "resumes_insert_public"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

-- Policy 2: Qualquer pessoa pode visualizar currículos
CREATE POLICY "resumes_select_public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Policy 3: Usuários podem atualizar seus próprios currículos
CREATE POLICY "resumes_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy 4: Usuários podem deletar seus próprios currículos
CREATE POLICY "resumes_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- Verificação
-- ============================================

SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE 'resumes%'
ORDER BY policyname;

-- ============================================
-- ALTERNATIVA: Configuração via Dashboard
-- ============================================

-- Se o script SQL acima falhar, configure manualmente:
--
-- 1. Vá para: Storage > Policies
-- 2. Selecione o bucket "resumes"
-- 3. Clique em "New Policy"
--
-- POLICY 1: Upload Público
-- - Name: resumes_insert_public
-- - Allowed operation: INSERT
-- - Target roles: public
-- - Policy definition: bucket_id = 'resumes'
--
-- POLICY 2: Download Público
-- - Name: resumes_select_public
-- - Allowed operation: SELECT
-- - Target roles: public
-- - Policy definition: bucket_id = 'resumes'
--
-- POLICY 3: Update Próprio
-- - Name: resumes_update_own
-- - Allowed operation: UPDATE
-- - Target roles: authenticated
-- - USING expression: bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
-- - WITH CHECK expression: bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
--
-- POLICY 4: Delete Próprio
-- - Name: resumes_delete_own
-- - Allowed operation: DELETE
-- - Target roles: authenticated
-- - USING expression: bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
