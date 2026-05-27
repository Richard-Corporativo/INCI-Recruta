-- Migração: 20260514_agenda_and_rls_hardening
-- Objetivo: Criar suporte para Agenda Centralizada e reforçar isolamento Multi-tenant.

BEGIN;

-- 1. TABELA DE ENTREVISTAS (AGENDA)
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    interviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    location TEXT, -- Link da reunião ou sala física
    type TEXT DEFAULT 'Entrevista', -- 'RH', 'Técnica', 'Gestor', etc.
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_interviews_company_id ON public.interviews(company_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_starts_at ON public.interviews(starts_at);

-- 2. POLÍTICAS RLS PARA ENTREVISTAS

-- Seleção: Membros da empresa ou o próprio candidato (se vinculado a um user_id)
CREATE POLICY interviews_select_policy ON public.interviews
    FOR SELECT TO authenticated
    USING (
        company_id = current_company_id() OR
        EXISTS (
            SELECT 1 FROM public.candidates c
            WHERE c.id = candidate_id AND c.user_id = auth.uid()
        )
    );

-- Gerenciamento (Insert/Update/Delete): Apenas membros da empresa com permissão
CREATE POLICY interviews_manage_policy ON public.interviews
    FOR ALL TO authenticated
    USING (company_id = current_company_id())
    WITH CHECK (company_id = current_company_id());


-- 3. REFORÇO DE SEGURANÇA EM TABELAS EXISTENTES

-- Tabela: candidates (Garantir que candidatos vejam apenas seu próprio registro e admins vejam apenas da sua empresa)
DROP POLICY IF EXISTS "candidates_select_restricted" ON public.candidates;
CREATE POLICY "candidates_select_multitenant" ON public.candidates
    FOR SELECT TO authenticated
    USING (
        company_id = current_company_id() OR 
        (user_id = auth.uid() AND job_id IS NULL) OR -- Perfil base do candidato
        is_super_admin()
    );

-- Tabela: jobs (Garantir que recrutadores vejam apenas de sua empresa)
DROP POLICY IF EXISTS "jobs_select_policy" ON public.jobs; -- Nome genérico, drop se existir
CREATE POLICY "jobs_select_multitenant" ON public.jobs
    FOR SELECT TO authenticated
    USING (
        company_id = current_company_id() OR 
        status = 'Ativa' OR -- Candidatos podem ver vagas ativas de qualquer empresa na landing
        is_super_admin()
    );

-- 4. TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_interviews_updated_at
    BEFORE UPDATE ON public.interviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMIT;
