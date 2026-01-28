-- Adicionar campos em ROLES
ALTER TABLE public.roles 
ADD COLUMN IF NOT EXISTS experience_min TEXT,
ADD COLUMN IF NOT EXISTS reports_to TEXT;

-- Adicionar campos de workflow em JOBS
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS positions_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS work_schedule TEXT,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'Rascunho' 
  CHECK (approval_status IN ('Rascunho', 'Pendente', 'Aprovado')),
ADD COLUMN IF NOT EXISTS experience_min TEXT,
ADD COLUMN IF NOT EXISTS reports_to TEXT;

-- Tabela de Auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem para evitar erros em re-execução
DROP POLICY IF EXISTS "Allow admin read audit" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow authenticated insert audit" ON public.audit_logs;

-- Criar políticas
CREATE POLICY "Allow admin read audit" ON public.audit_logs FOR SELECT USING (get_my_role() IN ('admin', 'quality'));
CREATE POLICY "Allow authenticated insert audit" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
