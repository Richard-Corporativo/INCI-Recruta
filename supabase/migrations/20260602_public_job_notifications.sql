-- Migration: public_job_notifications
-- Sino de notificações público na landing para vagas publicadas.
-- Separado de candidate_notifications (privado).

-- Tabela
CREATE TABLE IF NOT EXISTS public.public_job_notifications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid        NOT NULL UNIQUE,
  company_id  uuid        NOT NULL,
  title       text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS public_job_notifications_created_idx
  ON public.public_job_notifications (created_at DESC);

-- RLS
ALTER TABLE public.public_job_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_job_notifications_select_all"
  ON public.public_job_notifications
  FOR SELECT USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_job_notifications;

-- Trigger: insere notificação quando vaga é publicada
CREATE OR REPLACE FUNCTION public.notify_job_published()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.workflow_status = 'published'
     AND (OLD.workflow_status IS DISTINCT FROM 'published') THEN
    INSERT INTO public.public_job_notifications (job_id, company_id, title)
    VALUES (NEW.id, NEW.company_id, NEW.title)
    ON CONFLICT (job_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_job_published
  AFTER UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.notify_job_published();
