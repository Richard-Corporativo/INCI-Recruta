-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'manager', 'recruiter', 'quality', 'dp')) DEFAULT 'recruiter',
    status TEXT CHECK (status IN ('active', 'suspended')) DEFAULT 'active',
    department TEXT,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    permissions JSONB DEFAULT '{}'::jsonb
);

-- RLS for USERS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- JOBS TABLE
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT CHECK (status IN ('Ativa', 'Pausada', 'Rascunho', 'Encerrada')) DEFAULT 'Rascunho',
    model TEXT CHECK (model IN ('Presencial', 'Híbrido', 'Remoto')),
    contract TEXT CHECK (contract IN ('CLT', 'PJ', 'Estágio', 'Temporário')),
    urgency TEXT CHECK (urgency IN ('Alta', 'Média', 'Baixa')),
    salary_min NUMERIC,
    salary_max NUMERIC,
    context TEXT,
    mission TEXT,
    responsibilities TEXT,
    seniority TEXT,
    manager_id UUID REFERENCES public.users(id),
    candidates_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- RLS for JOBS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for active jobs" ON public.jobs FOR SELECT USING (status = 'Ativa');
CREATE POLICY "Recruiters/Admins full access" ON public.jobs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'manager'))
);

-- CANDIDATES TABLE
CREATE TABLE public.candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    linkedin TEXT,
    portfolio TEXT,
    resume_url TEXT,
    column_id TEXT DEFAULT 'received',
    initials TEXT,
    avatar_color TEXT,
    text_color TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- RLS for CANDIDATES
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Candidates can view own application" ON public.candidates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Recruiters full access" ON public.candidates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'manager'))
);

-- FEEDBACKS TABLE
CREATE TABLE public.feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id),
    rating INTEGER,
    strengths TEXT,
    concerns TEXT,
    recommendation TEXT,
    stage TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- RLS for FEEDBACKS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recruiters can manage feedbacks" ON public.feedbacks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'recruiter', 'manager'))
);
