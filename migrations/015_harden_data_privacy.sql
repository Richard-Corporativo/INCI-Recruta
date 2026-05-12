-- ============================================================
-- Migration: 015_harden_data_privacy.sql (v3 — FINAL)
-- Tarefa 3: Segurança de dados pessoais
-- Tarefa 4: Backend e dados (índices + prevenção duplicata)
-- ============================================================

-- ============================================================
-- PHASE 1: REMOVER POLÍTICAS PÚBLICAS (pelos nomes exatos)
-- ============================================================

-- Políticas públicas na tabela candidate_avatars
DROP POLICY IF EXISTS "Public can view avatars"  ON public.candidate_avatars;
DROP POLICY IF EXISTS "Anyone can view avatars"  ON public.candidate_avatars;

-- Políticas públicas no storage.objects (nomes exatos conforme dashboard)
DROP POLICY IF EXISTS "Public can view avatars"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_select_public"    ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_public"    ON storage.objects;

-- ============================================================
-- PHASE 2: HABILITAR RLS NAS TABELAS DE METADADOS
-- ============================================================

ALTER TABLE public.candidate_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_resumes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PHASE 3: POLÍTICAS RLS PARA AVATARES
-- NOTA: candidate_avatars NÃO tem user_id diretamente.
-- Relação: candidate_avatars.candidate_id → candidates.id → candidates.user_id
-- ============================================================

-- Candidato vê apenas o próprio avatar
DROP POLICY IF EXISTS "avatars_select_own" ON public.candidate_avatars;
CREATE POLICY "avatars_select_own"
ON public.candidate_avatars
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.candidates c
    WHERE c.id = public.candidate_avatars.candidate_id
      AND c.user_id = auth.uid()
  )
);

-- Admin, recrutador, gestor, quality e dp podem ver todos os avatares
DROP POLICY IF EXISTS "avatars_select_admin" ON public.candidate_avatars;
CREATE POLICY "avatars_select_admin"
ON public.candidate_avatars
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
  )
);

-- ============================================================
-- PHASE 4: TORNAR BUCKETS PRIVADOS NO STORAGE
-- ============================================================

UPDATE storage.buckets
SET public = false
WHERE id IN ('avatars', 'resumes');

-- ============================================================
-- PHASE 5: ÍNDICES DE PERFORMANCE
-- ============================================================

-- Índices seguros: verifica se a coluna existe antes de criar
DO $$
BEGIN
    -- candidates.user_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='candidates' AND column_name='user_id') THEN
        CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);
    END IF;

    -- candidates.job_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='candidates' AND column_name='job_id') THEN
        CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON public.candidates(job_id);
    END IF;

    -- candidates.email
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='candidates' AND column_name='email') THEN
        CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
    END IF;

    -- candidates.created_at
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='candidates' AND column_name='created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON public.candidates(created_at);
    END IF;

    -- jobs.status
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='jobs' AND column_name='status') THEN
        CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
    END IF;

    -- jobs.department
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='jobs' AND column_name='department') THEN
        CREATE INDEX IF NOT EXISTS idx_jobs_department ON public.jobs(department);
    END IF;
END $$;

-- Tabela audit_logs (SEGURO: verifica se as colunas existem antes de indexar)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'entity_type'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.audit_logs(entity_type, entity_id);
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'user_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'created_at'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at DESC);
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'timestamp'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp DESC);
    END IF;
END $$;

-- ============================================================
-- PHASE 6: PREVENIR CANDIDATURA DUPLICADA
-- ============================================================

ALTER TABLE public.candidates DROP CONSTRAINT IF EXISTS uq_candidate_user_job;
ALTER TABLE public.candidates ADD CONSTRAINT uq_candidate_user_job UNIQUE (user_id, job_id);

-- ============================================================
-- VERIFICAÇÃO FINAL
-- ============================================================
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('candidate_avatars', 'candidate_resumes')
ORDER BY tablename, policyname;