-- Migration 025: Limpeza de dados ("começar do zero" para SaaS)
-- ⚠️ DESTRUTIVO: apaga todas as vagas, cargos, candidatos, audit logs e settings existentes.
-- ⚠️ NÃO apaga usuários do auth.users — esses devem ser gerenciados via dashboard Supabase.
-- Execute SOMENTE depois da 024 e somente se quiser realmente começar do zero.

BEGIN;

-- Tabelas auxiliares primeiro (filhas)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_stage_history') THEN
    EXECUTE 'TRUNCATE TABLE public.candidate_stage_history CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_resumes') THEN
    EXECUTE 'TRUNCATE TABLE public.candidate_resumes CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_avatars') THEN
    EXECUTE 'TRUNCATE TABLE public.candidate_avatars CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_demographics') THEN
    EXECUTE 'TRUNCATE TABLE public.candidate_demographics CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='communication_logs') THEN
    EXECUTE 'TRUNCATE TABLE public.communication_logs CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='scheduled_emails') THEN
    EXECUTE 'TRUNCATE TABLE public.scheduled_emails CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='email_templates') THEN
    EXECUTE 'TRUNCATE TABLE public.email_templates CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='feedbacks') THEN
    EXECUTE 'TRUNCATE TABLE public.feedbacks CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='analytics_events') THEN
    EXECUTE 'TRUNCATE TABLE public.analytics_events CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='system_settings') THEN
    EXECUTE 'TRUNCATE TABLE public.system_settings CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='audit_logs') THEN
    EXECUTE 'TRUNCATE TABLE public.audit_logs CASCADE';
  END IF;
END $$;

-- Domínio principal
TRUNCATE TABLE public.candidates CASCADE;
TRUNCATE TABLE public.jobs CASCADE;
TRUNCATE TABLE public.roles CASCADE;

-- ⚠️ Não apaga public.users — usuários staff existentes serão vinculados a empresas via company_members.
-- Se quiser apagar usuários também, faça manualmente pelo painel Auth do Supabase.

COMMIT;
