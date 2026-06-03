-- candidate_notifications: notificações in-app para candidatos
-- Disparadas pelo backend (admin/services) quando: entrevista agendada/cancelada/reagendada,
-- candidato movido de etapa no kanban.

CREATE TABLE IF NOT EXISTS public.candidate_notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL,
  job_id       uuid,
  company_id   uuid NOT NULL,
  type         text NOT NULL CHECK (type IN (
    'interview_scheduled',
    'interview_rescheduled',
    'interview_cancelled',
    'stage_changed'
  )),
  title        text NOT NULL,
  message      text NOT NULL,
  reference_id uuid,
  read         boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS candidate_notifications_user_read_idx
  ON public.candidate_notifications (user_id, read, created_at DESC);

CREATE INDEX IF NOT EXISTS candidate_notifications_candidate_job_idx
  ON public.candidate_notifications (candidate_id, job_id);

ALTER TABLE public.candidate_notifications ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION supabase_realtime ADD TABLE public.candidate_notifications;

-- Candidato lê apenas as próprias notificações
CREATE POLICY "candidate_notifications_select_own"
  ON public.candidate_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Membro ativo da empresa pode inserir notificações para candidatos dessa empresa
CREATE POLICY "candidate_notifications_insert_company_member"
  ON public.candidate_notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_members cm
      WHERE cm.user_id = auth.uid()
        AND cm.company_id = candidate_notifications.company_id
        AND cm.status = 'active'
    )
  );

-- Candidato pode marcar suas notificações como lidas
CREATE POLICY "candidate_notifications_update_own"
  ON public.candidate_notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
