-- ============================================
-- COMMUNICATION HUB - Email Templates & Logs
-- ============================================

-- 1. Email Templates Table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT, -- Fallback plain text
    variables JSONB DEFAULT '[]'::jsonb, -- Lista de placeholders obrigatórios
    version INTEGER DEFAULT 1,
    category TEXT NOT NULL CHECK (category IN ('interview', 'documents', 'rejection', 'confirmation', 'update')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Communication Logs Table
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    template_version INTEGER,
    
    type TEXT NOT NULL DEFAULT 'email', -- 'email', 'sms' (future)
    subject TEXT NOT NULL,
    content_html TEXT NOT NULL,
    content_text TEXT,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'failed')),
    message_id TEXT, -- ID do provider (SendGrid/SES/Resend)
    error_message TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb, -- Variáveis usadas, personalizações
    sent_at TIMESTAMPTZ DEFAULT now(),
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ
);

-- 3. Scheduled Emails Table (Fase 2)
CREATE TABLE IF NOT EXISTS public.scheduled_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    template_id UUID NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
    
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
    
    subject TEXT NOT NULL,
    content_html TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_comm_logs_candidate ON public.communication_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_job ON public.communication_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_user ON public.communication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_status ON public.communication_logs(status);
CREATE INDEX IF NOT EXISTS idx_comm_logs_sent_at ON public.communication_logs(sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_templates_category ON public.email_templates(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON public.email_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_scheduled_for ON public.scheduled_emails(scheduled_for) WHERE status = 'pending';

-- 5. Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for email_templates

-- Admin/Qualidade can see all templates
DROP POLICY IF EXISTS "Templates viewable by admin and qualidade" ON public.email_templates;
CREATE POLICY "Templates viewable by admin and qualidade" 
ON public.email_templates FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'recruiter', 'manager')
    )
);

-- Admin/Qualidade can create/update templates
DROP POLICY IF EXISTS "Templates manageable by admin and qualidade" ON public.email_templates;
CREATE POLICY "Templates manageable by admin and qualidade" 
ON public.email_templates FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'recruiter')
    )
);

-- 7. RLS Policies for communication_logs

-- Admin/Qualidade can see all logs
DROP POLICY IF EXISTS "Comm logs viewable by admin and qualidade" ON public.communication_logs;
CREATE POLICY "Comm logs viewable by admin and qualidade" 
ON public.communication_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'recruiter')
    )
);

-- Managers can see logs for their jobs
DROP POLICY IF EXISTS "Comm logs viewable by managers for their jobs" ON public.communication_logs;
CREATE POLICY "Comm logs viewable by managers for their jobs" 
ON public.communication_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'manager'
    )
    AND job_id IN (
        SELECT id FROM public.jobs WHERE created_by = auth.uid()
    )
);

-- Admin/Qualidade/Manager can insert logs
DROP POLICY IF EXISTS "Comm logs insertable by authorized users" ON public.communication_logs;
CREATE POLICY "Comm logs insertable by authorized users" 
ON public.communication_logs FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'recruiter', 'manager')
    )
);

-- 8. Seed: Initial Email Templates
INSERT INTO public.email_templates (name, subject, body_html, body_text, variables, category, is_active) VALUES

-- 1. Convite para Entrevista
(
    'Convite para Entrevista',
    'Convite para Entrevista - {{vaga}}',
    '<html><body>
        <p>Olá <strong>{{nome}}</strong>,</p>
        
        <p>É com grande satisfação que convidamos você para participar de uma entrevista para a vaga de <strong>{{vaga}}</strong>.</p>
        
        <p><strong>Detalhes da Entrevista:</strong></p>
        <ul>
            <li><strong>Data:</strong> {{data}}</li>
            <li><strong>Horário:</strong> {{hora}}</li>
            <li><strong>Local:</strong> {{local}}</li>
            <li><strong>Link:</strong> <a href="{{link}}">{{link}}</a></li>
        </ul>
        
        <p>Por favor, confirme sua presença respondendo a este e-mail.</p>
        
        <p>Atenciosamente,<br>{{assinatura}}</p>
    </body></html>',
    'Olá {{nome}}, é com grande satisfação que convidamos você para participar de uma entrevista para a vaga de {{vaga}}. Data: {{data}}, Horário: {{hora}}, Local: {{local}}, Link: {{link}}. Por favor, confirme sua presença. Atenciosamente, {{assinatura}}',
    '["nome", "vaga", "data", "hora", "local", "link", "assinatura"]'::jsonb,
    'interview',
    true
),

-- 2. Solicitação de Documentos
(
    'Solicitação de Documentos',
    'Solicitação de Documentos - {{vaga}}',
    '<html><body>
        <p>Olá <strong>{{nome}}</strong>,</p>
        
        <p>Para darmos continuidade ao processo seletivo da vaga de <strong>{{vaga}}</strong>, solicitamos o envio dos seguintes documentos:</p>
        
        <p>{{lista_documentos}}</p>
        
        <p><strong>Prazo:</strong> {{prazo}}</p>
        
        <p>Por favor, envie os documentos respondendo a este e-mail.</p>
        
        <p>Atenciosamente,<br>{{assinatura}}</p>
    </body></html>',
    'Olá {{nome}}, para darmos continuidade ao processo seletivo da vaga de {{vaga}}, solicitamos o envio dos documentos: {{lista_documentos}}. Prazo: {{prazo}}. Atenciosamente, {{assinatura}}',
    '["nome", "vaga", "lista_documentos", "prazo", "assinatura"]'::jsonb,
    'documents',
    true
),

-- 3. Retorno / Reprovação
(
    'Retorno / Reprovação',
    'Retorno sobre sua candidatura - {{vaga}}',
    '<html><body>
        <p>Olá <strong>{{nome}}</strong>,</p>
        
        <p>Agradecemos seu interesse e participação no processo seletivo para a vaga de <strong>{{vaga}}</strong>.</p>
        
        <p>Após cuidadosa avaliação, informamos que optamos por seguir com outros candidatos cujos perfis se adequaram de forma mais próxima aos requisitos da posição neste momento.</p>
        
        <p>{{feedback}}</p>
        
        <p>Seu currículo permanecerá em nosso banco de talentos para futuras oportunidades que se encaixem melhor ao seu perfil.</p>
        
        <p>Desejamos muito sucesso em sua jornada profissional.</p>
        
        <p>Atenciosamente,<br>{{assinatura}}</p>
    </body></html>',
    'Olá {{nome}}, agradecemos sua participação no processo seletivo para {{vaga}}. Optamos por seguir com outros candidatos. {{feedback}}. Seu currículo permanecerá em nosso banco de talentos. Atenciosamente, {{assinatura}}',
    '["nome", "vaga", "feedback", "assinatura"]'::jsonb,
    'rejection',
    true
),

-- 4. Confirmação de Candidatura
(
    'Confirmação de Candidatura',
    'Candidatura Recebida - {{vaga}}',
    '<html><body>
        <p>Olá <strong>{{nome}}</strong>,</p>
        
        <p>Recebemos sua candidatura para a vaga de <strong>{{vaga}}</strong> na área de <strong>{{area}}</strong>.</p>
        
        <p><strong>Próximos passos:</strong></p>
        <p>{{proximos_passos}}</p>
        
        <p>Você pode acompanhar o status da sua candidatura através do nosso portal.</p>
        
        <p>Agradecemos seu interesse em fazer parte da nossa equipe!</p>
        
        <p>Atenciosamente,<br>{{assinatura}}</p>
    </body></html>',
    'Olá {{nome}}, recebemos sua candidatura para {{vaga}} na área de {{area}}. Próximos passos: {{proximos_passos}}. Você pode acompanhar o status através do portal. Atenciosamente, {{assinatura}}',
    '["nome", "vaga", "area", "proximos_passos", "assinatura"]'::jsonb,
    'confirmation',
    true
),

-- 5. Próximos Passos / Atualização
(
    'Atualização de Status',
    'Atualização sobre sua candidatura - {{vaga}}',
    '<html><body>
        <p>Olá <strong>{{nome}}</strong>,</p>
        
        <p>Gostaríamos de atualizar você sobre o andamento do processo seletivo para a vaga de <strong>{{vaga}}</strong>.</p>
        
        <p><strong>Status atual:</strong> {{status_atual}}</p>
        
        <p><strong>Próxima ação:</strong> {{acao_esperada}}</p>
        
        <p>Caso tenha alguma dúvida, fique à vontade para responder este e-mail.</p>
        
        <p>Atenciosamente,<br>{{assinatura}}</p>
    </body></html>',
    'Olá {{nome}}, atualização sobre {{vaga}}. Status atual: {{status_atual}}. Próxima ação: {{acao_esperada}}. Atenciosamente, {{assinatura}}',
    '["nome", "vaga", "status_atual", "acao_esperada", "assinatura"]'::jsonb,
    'update',
    true
) ON CONFLICT DO NOTHING;

-- 9. RPC Function: Get Candidate Communications
CREATE OR REPLACE FUNCTION public.get_candidate_communications(p_candidate_id UUID)
RETURNS TABLE (
    id UUID,
    job_id UUID,
    job_title TEXT,
    user_name TEXT,
    user_role TEXT,
    template_name TEXT,
    template_category TEXT,
    subject TEXT,
    content_html TEXT,
    status TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cl.id,
        cl.job_id,
        j.title as job_title,
        u.name as user_name,
        u.role as user_role,
        et.name as template_name,
        et.category as template_category,
        cl.subject,
        cl.content_html,
        cl.status,
        cl.sent_at,
        cl.delivered_at,
        cl.metadata
    FROM public.communication_logs cl
    LEFT JOIN public.jobs j ON j.id = cl.job_id
    LEFT JOIN public.users u ON u.id = cl.user_id
    LEFT JOIN public.email_templates et ON et.id = cl.template_id
    WHERE cl.candidate_id = p_candidate_id
    ORDER BY cl.sent_at DESC;
END;
$$;

-- 10. RPC Function: Get Communication Metrics
CREATE OR REPLACE FUNCTION public.get_communication_metrics(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    total_sent BIGINT,
    total_delivered BIGINT,
    total_failed BIGINT,
    delivery_rate NUMERIC,
    avg_response_time_hours NUMERIC,
    top_templates JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start TIMESTAMPTZ;
    v_end TIMESTAMPTZ;
BEGIN
    -- Default to current month if no dates provided
    v_start := COALESCE(p_start_date, date_trunc('month', now()));
    v_end := COALESCE(p_end_date, now());
    
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
            COUNT(*) FILTER (WHERE status = 'failed') as failed
        FROM public.communication_logs
        WHERE sent_at BETWEEN v_start AND v_end
    ),
    templates AS (
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'template', et.name,
                    'count', COUNT(*)
                )
                ORDER BY COUNT(*) DESC
                LIMIT 5
            ) as top_5
        FROM public.communication_logs cl
        JOIN public.email_templates et ON et.id = cl.template_id
        WHERE cl.sent_at BETWEEN v_start AND v_end
        GROUP BY et.id, et.name
    )
    SELECT 
        s.total::BIGINT,
        s.delivered::BIGINT,
        s.failed::BIGINT,
        CASE 
            WHEN s.total > 0 THEN ROUND((s.delivered::NUMERIC / s.total::NUMERIC) * 100, 2)
            ELSE 0
        END as delivery_rate,
        24.0::NUMERIC as avg_hours, -- Placeholder for MVP
        t.top_5
    FROM stats s, templates t;
END;
$$;
