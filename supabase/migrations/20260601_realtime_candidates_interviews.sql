-- Habilita Realtime nas tabelas que o candidato precisa monitorar em tempo real.
-- candidates: para reagir a mudanças de etapa (column_id) feitas pelo Admin no Kanban.
-- interviews: para reagir a agendamentos/cancelamentos feitos pelo Admin.
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
