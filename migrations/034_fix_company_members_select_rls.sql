-- Migration 034: Fix RLS policies para company_members e companies
-- Problema: company_members tinha SELECT bloqueado para usuários comuns (já corrigido via dashboard).
-- Problema 2: companies só permite SELECT onde status='active', mas empresas em trial ficam invisíveis
-- para seus próprios membros — loadCompany() retorna null e company fica null no AuthContext.

-- Policy que já foi criada via dashboard (idempotente):
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'company_members' AND policyname = 'company_members_select_own'
    ) THEN
        CREATE POLICY "company_members_select_own"
            ON public.company_members
            FOR SELECT
            TO authenticated
            USING (user_id = auth.uid());
    END IF;
END $$;

-- Permite que membros ativos vejam sua própria empresa independente do status dela:
CREATE POLICY "companies_select_own_member"
    ON public.companies
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.company_members
            WHERE company_id = companies.id
              AND user_id = auth.uid()
              AND status = 'active'
        )
    );
