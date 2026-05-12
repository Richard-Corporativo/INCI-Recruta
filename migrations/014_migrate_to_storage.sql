-- Migration: 014_migrate_to_storage.sql
-- Description: Migra currículos e avatares de BYTEA (banco) para Supabase Storage Privado.
-- Autor: Antigravity
-- Data: 2026-05-05

-- 1. Buckets de Storage Privados
-- Garantir que os buckets existem e são PRIVADOS (public = false)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('resumes', 'resumes', false, 5242880, '{application/pdf}'),
    ('avatars', 'avatars', false, 2097152, '{image/*}')
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Atualizar tabelas de metadados
-- Adicionar coluna para o path do storage
ALTER TABLE candidate_resumes ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE candidate_avatars ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Tornar file_data opcional (para novos registros via Storage)
ALTER TABLE candidate_resumes ALTER COLUMN file_data DROP NOT NULL;
ALTER TABLE candidate_avatars ALTER COLUMN file_data DROP NOT NULL;

-- 3. Políticas de RLS para Buckets (Acesso Privado)
-- Bucket: Resumes
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_insert_auth" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_auth" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_owner_admin" ON storage.objects;
DROP POLICY IF EXISTS "resumes_insert_owner" ON storage.objects;

-- Somente o dono ou admin/recrutador pode ler o currículo
CREATE POLICY "resumes_select_owner_admin"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'resumes' AND (
        (storage.foldername(name))[1] = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    )
);

CREATE POLICY "resumes_insert_owner"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Bucket: Avatars
DROP POLICY IF EXISTS "avatars_select_public" ON storage.objects;
DROP POLICY IF EXISTS "avatars_select_owner_admin" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert_owner" ON storage.objects;

CREATE POLICY "avatars_select_owner_admin"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'avatars' AND (
        (storage.foldername(name))[1] = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    )
);

CREATE POLICY "avatars_insert_owner"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Remover leitura pública direta nas tabelas
DROP POLICY IF EXISTS "Public can view avatars" ON public.candidate_avatars;
