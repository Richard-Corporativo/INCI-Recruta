'use client';

// @page JobApplication | @tipo page-component | @versao 1.0.0
// > Formulário de candidatura — dados, CV, submit para vaga
// @calls JobService — apply, useParams — job id

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@src/lib/router-compat';
import { JobService } from '@src/services/job.service';
import { CandidateService } from '@src/services/candidate.service';
import { Job, Candidate } from '@src/types';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { useAuth } from '@src/hooks/useAuth';
import { Icon } from "@iconify/react";
import { analyticsService } from '@src/services/analytics.service';
import { isExpiredDate } from '@src/lib/formatters';
import { useCandidateData } from '@src/hooks/useCandidateData';

const JobApplication: React.FC = () => {
    const { slug, id } = useParams() as { slug?: string; id?: string };
    const navigate = useNavigate();
    const { success, error, warning } = useToast();
    const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
    const { currentCandidate, completeness, isLoading: isDataLoading } = useCandidateData();
    const [step, setStep] = useState(1);
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDuplicateCheckPending, setIsDuplicateCheckPending] = useState(true);
    const [hasDuplicateApplication, setHasDuplicateApplication] = useState(false);
    const isTalentPool = !id || id === 'talentos';
    const applicationPath = id && slug ? `/vagas/${slug}/${id}/candidatar` : '/vagas';
    const loginPath = `/login?next=${encodeURIComponent(applicationPath)}`;
    const completeProfilePath = `/perfil/completar?next=${encodeURIComponent(applicationPath)}`;

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', city: '',
        linkedin: '', github: '', portfolio: '', // Novos campos de link
        experiences: [{ company: '', position: '', duration: '', description: '' }],
        resume: null as File | null,
        pretension_min: '', pretension_max: '', availability: '',
        gender: '', race: '', isPcd: false
    });

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
            warning('Faça login como candidato para se candidatar.');
            navigate(loginPath);
            return;
        }

        if (user?.role !== 'candidate') {
            warning('Candidaturas são permitidas apenas para contas de candidato.');
            navigate('/admin/dashboard');
            return;
        }
    }, [isAuthLoading, isAuthenticated, user, warning, navigate, loginPath]);

    useEffect(() => {
        const loadJob = async () => {
            setIsLoading(true);
            let fetchedJob: Job | null = null;
            if (id && slug) {
                fetchedJob = await JobService.getPublicJobByIdInCompany(slug, id);
                setJob(fetchedJob);
                if (isExpiredDate(fetchedJob?.registration_deadline)) {
                    warning('O prazo para candidatura nesta vaga expirou.');
                    navigate(`/vagas/${slug}/${id}`);
                }
            } else {
                setJob({
                    id: 'talentos', title: 'Banco de Talentos', department: 'Talentos INCI',
                    location: 'Brasil', model: 'Remoto/Híbrido/Presencial', contract: 'A combinar',
                    urgency: 'Média', status: 'Ativa', salary_min: 0, salary_max: 0,
                    context: 'Candidatura espontânea para futuras oportunidades em nossa base de dados.',
                    candidates_count: 0, created_at: ''
                } as Job);
            }
            setIsLoading(false);

            if (isTalentPool) {
                analyticsService.trackEvent('talent_bank_click', {
                    job_id: id,
                    job_title: fetchedJob?.title
                }, id as string);
            }
        };
        loadJob();
    }, [id, navigate, warning]);

    useEffect(() => {
        const checkDuplicateApplication = async () => {
            setIsDuplicateCheckPending(true);
            setHasDuplicateApplication(false);

            if (!user?.id || !id || isTalentPool) {
                setIsDuplicateCheckPending(false);
                return;
            }

            try {
                const alreadyApplied = await CandidateService.hasApplied(user.id, id);
                if (alreadyApplied) {
                    setHasDuplicateApplication(true);
                    warning('Você já se candidatou a esta vaga.');
                    setTimeout(() => navigate(`/vagas/${slug}/${id}`), 500);
                }
            } catch (err) {
                console.error('[JobApplication] Error checking application status:', err);
            } finally {
                setIsDuplicateCheckPending(false);
            }
        };
        checkDuplicateApplication();
    }, [user?.id, id, isTalentPool, slug, navigate, warning]);

    useEffect(() => {
        const autofillForm = async () => {
            if (isAuthenticated && user) {
                const [{ data: profile }, { data: userProfile }] = await Promise.all([
                    supabase
                    .from('candidates')
                    .select('*')
                    .eq('user_id', user.id)
                    .is('job_id', null)
                    .order('applied_at', { ascending: false })
                    .limit(1)
                    .maybeSingle(),
                    supabase
                        .from('users')
                        .select('name, email, phone, location, linkedin, portfolio, resume_name')
                        .eq('id', user.id)
                        .maybeSingle()
                ]);

                const diversityData = profile?.id ? await CandidateService.getDiversityData(profile.id) : null;

                setFormData(prev => ({
                    ...prev,
                    name: profile?.name || userProfile?.name || user.name || '',
                    email: profile?.email || userProfile?.email || user.email || '',
                    phone: profile?.phone || userProfile?.phone || user.phone || '',
                    city: profile?.location || userProfile?.location || user.location || '',
                    linkedin: profile?.linkedin || userProfile?.linkedin || user.linkedin || '',
                    github: profile?.github || userProfile?.github || '',
                    portfolio: profile?.portfolio || userProfile?.portfolio || '',
                    pretension_min: profile?.pretension_min?.toString() || '',
                    pretension_max: profile?.pretension_max?.toString() || '',
                    availability: profile?.availability || '',
                    gender: diversityData?.gender || '',
                    race: diversityData?.race || '',
                    isPcd: diversityData?.isPcd || false
                }));
            }
        };
        autofillForm();
    }, [isAuthenticated, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                warning('Por favor, envie apenas arquivos PDF.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                warning('O arquivo deve ter no máximo 5MB.');
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name.trim() || formData.name.trim().split(' ').length < 2) { 
                warning('Por favor, informe seu nome completo (Nome e Sobrenome).'); 
                return; 
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) { 
                warning('Por favor, informe um e-mail válido.'); 
                return; 
            }
            if (formData.phone.replace(/\D/g, '').length < 10) { 
                warning('Por favor, informe um telefone válido com DDD.'); 
                return; 
            }
            if (!formData.city.trim()) { 
                warning('Por favor, informe sua cidade.'); 
                return; 
            }
        }
        if (step === 2 && !formData.resume && !isAuthenticated) {
            warning('Por favor, anexe seu currículo em PDF.');
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev + 1);
    };
    const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => prev - 1); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || isDuplicateCheckPending || hasDuplicateApplication) return;
        setIsSubmitting(true);
        try {
            if (!isAuthenticated || !user) {
                warning('Faça login como candidato para enviar sua candidatura.');
                navigate(loginPath);
                setIsSubmitting(false);
                return;
            }

            if (user.role !== 'candidate') {
                warning('Candidaturas são permitidas apenas para contas de candidato.');
                navigate('/admin/dashboard');
                setIsSubmitting(false);
                return;
            }

            // Double-check antes de submeter
            if (!isTalentPool && user.id && id) {
                const alreadyApplied = await CandidateService.hasApplied(user.id, id);
                if (alreadyApplied) {
                    error('Você já se candidatou a esta vaga. Redirecionando...');
                    setTimeout(() => navigate(`/vagas/${slug}/${id}`), 1000);
                    setIsSubmitting(false);
                    return;
                }
            }

            const newCandidate: Omit<Candidate, 'id'> = {
                jobId: isTalentPool ? undefined : id,
                name: formData.name, email: formData.email, phone: formData.phone,
                location: formData.city,
                columnId: 'received',
                initials: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2),
                avatarColor: 'bg-foreground', textColor: 'text-background',
                linkedin: formData.linkedin, 
                github: formData.github,
                portfolio: formData.portfolio, 
                pretension_min: formData.pretension_min ? Number(formData.pretension_min) : undefined,
                pretension_max: formData.pretension_max ? Number(formData.pretension_max) : undefined,
                availability: formData.availability,
                user_id: user.id
            };

            console.log('[JobApplication] Chamando CandidateService.addCandidate com slug:', slug);
            const createdCandidate = await CandidateService.addCandidate(newCandidate, formData.resume || undefined, slug);
            
            console.log('[JobApplication] Candidato criado com sucesso:', createdCandidate?.id);

            if (createdCandidate?.id && (formData.gender || formData.race || formData.isPcd)) {
                console.log('[JobApplication] Salvando dados de diversidade...');
                await CandidateService.saveDiversityData(createdCandidate.id, {
                    gender: formData.gender,
                    race: formData.race,
                    isPcd: formData.isPcd
                });
            }

            console.log('[JobApplication] Candidatura finalizada, redirecionando...');
            success('Sua candidatura foi enviada com sucesso!');
            
            analyticsService.trackEvent('application_completed', {
                job_id: isTalentPool ? null : id,
                job_title: isTalentPool ? 'Banco de Talentos' : job?.title,
                is_talent_pool: isTalentPool
            }, isTalentPool ? undefined : id);

            navigate('/candidate/dashboard');
        } catch (err: any) {
            console.error('[JobApplication] Erro no envio:', err);
            error('Erro ao enviar candidatura: ' + (err.message || 'Tente novamente.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading || !isAuthenticated || user?.role !== 'candidate') {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FAFAFA] text-foreground font-semibold uppercase tracking-widest text-[10px]">
                Verificando acesso de candidato...
            </div>
        );
    }

    if (hasDuplicateApplication) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <Icon icon="material-symbols:warning-outline" className="size-8" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Candidatura Duplicada</h2>
                    <p className="text-muted-foreground">Você já se candidatou a esta vaga. Redirecionando...</p>
                </div>
            </div>
        );
    }

    const renderStep1 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight uppercase">Dados Pessoais</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Informações básicas para contato</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">Nome Completo</label>
                    <input className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" placeholder="seu nome completo" type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">E-mail</label>
                    <input className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" placeholder="seu@email.com" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">WhatsApp / Telefone</label>
                    <input className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" placeholder="(00) 00000-0000" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">Cidade / UF</label>
                    <input className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" placeholder="ex: Barbalha - CE" type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
            </div>
            <div className="pt-8 flex justify-end border-t border-border">
                <button
                    onClick={nextStep}
                    disabled={isDuplicateCheckPending || hasDuplicateApplication}
                    className="h-14 px-10 bg-primary text-white font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDuplicateCheckPending ? 'Verificando...' : 'Próximo passo'}
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight uppercase">Currículo e Links</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Documentação e presença digital</p>
            </div>

            {/* Upload de Currículo */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">Currículo (PDF) <span className="text-primary">*</span></label>
                <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                        formData.resume ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/10'
                    }`}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                >
                    <input 
                        id="resume-upload" 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 ${formData.resume ? 'bg-primary border-primary text-white' : 'bg-white text-primary border-border'}`}>
                        <Icon icon={formData.resume ? "material-symbols:check" : "material-symbols:cloud-upload"} className="size-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-[var(--foreground)]">
                            {formData.resume ? formData.resume.name : 'Clique ou arraste o arquivo'}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">Apenas PDF (máx. 5MB)</p>
                    </div>
                </div>
            </div>

            {/* Links Sociais */}
            <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1 flex items-center gap-2">
                        <Icon icon="mdi:linkedin" className="size-4 text-[#0A66C2]" />
                        LinkedIn
                    </label>
                    <input 
                        className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" 
                        placeholder="linkedin.com/in/seu-perfil" 
                        type="url" 
                        name="linkedin" 
                        value={formData.linkedin} 
                        onChange={handleInputChange} 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Icon icon="mdi:github" className="size-4 text-foreground" />
                            GitHub
                        </label>
                        <input 
                            className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" 
                            placeholder="github.com/usuario" 
                            type="url" 
                            name="github" 
                            value={formData.github} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1 flex items-center gap-2">
                            <Icon icon="material-symbols:link" className="size-4 text-primary" />
                            Portfólio / Outros
                        </label>
                        <input 
                            className="w-full h-12 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" 
                            placeholder="instagram.com/seu-perfil" 
                            type="url" 
                            name="portfolio" 
                            value={formData.portfolio} 
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8 flex justify-between border-t border-border">
                <button onClick={prevStep} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-[var(--foreground)] transition-colors">Voltar</button>
                <button onClick={nextStep} className="h-14 px-10 bg-primary text-white font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">Próximo passo</button>
            </div>
        </div>
    );

    const renderStepDiversity = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight uppercase">Diversidade</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Inclusão e pertencimento (Opcional)</p>
            </div>

            {/* Gênero */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">Identidade de Gênero</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                        { id: 'female', label: 'Feminino', icon: 'material-symbols:woman' },
                        { id: 'male', label: 'Masculino', icon: 'material-symbols:man' },
                        { id: 'non_binary', label: 'Não Binário', icon: 'material-symbols:transgender' },
                        { id: 'other', label: 'Outro', icon: 'material-symbols:person-outline' },
                        { id: 'prefer_not_to_say', label: 'Não Informar', icon: 'material-symbols:block' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, gender: opt.id }))}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${
                                formData.gender === opt.id 
                                ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                : 'bg-muted/5 border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                            }`}
                        >
                            <Icon icon={opt.icon} className="size-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Raça */}
            <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest pl-1">Raça / Cor</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                        { id: 'white', label: 'Branca' },
                        { id: 'black', label: 'Preta' },
                        { id: 'brown', label: 'Parda' },
                        { id: 'yellow', label: 'Amarela' },
                        { id: 'indigenous', label: 'Indígena' },
                        { id: 'prefer_not_to_say', label: 'Não Informar' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, race: opt.id }))}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                                formData.race === opt.id 
                                ? 'bg-primary/5 border-primary text-primary shadow-sm scale-[1.02]' 
                                : 'bg-muted/5 border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                            }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* PCD */}
            <div className="pt-4">
                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-muted/5 cursor-pointer group hover:border-primary/30 transition-all">
                    <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        formData.isPcd ? 'bg-primary border-primary text-white' : 'border-border bg-white group-hover:border-primary/50'
                    }`}>
                        {formData.isPcd && <Icon icon="material-symbols:check" className="size-4" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.isPcd} onChange={() => setFormData(prev => ({ ...prev, isPcd: !prev.isPcd }))} />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground uppercase tracking-widest">Pessoa com Deficiência (PCD)</span>
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Ações afirmativas e acessibilidade</span>
                    </div>
                </label>
            </div>

            <div className="pt-8 flex justify-between items-center border-t border-border">
                <button onClick={prevStep} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-[var(--foreground)] transition-colors">Voltar</button>
                <button onClick={nextStep} className="h-14 px-10 bg-primary text-white font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">Finalizar</button>
            </div>
        </div>
    );

    const renderStep4 = () => {
        const genderMap: Record<string, string> = {
            'male': 'Masculino',
            'female': 'Feminino',
            'non_binary': 'Não Binário',
            'other': 'Outro',
            'prefer_not_to_say': 'Não Informar'
        };

        const raceMap: Record<string, string> = {
            'white': 'Branca',
            'black': 'Preta',
            'brown': 'Parda',
            'yellow': 'Amarela',
            'indigenous': 'Indígena',
            'prefer_not_to_say': 'Não Informar'
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2 text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Icon icon="material-symbols:check-circle" className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight uppercase">Revise sua Candidatura</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Confirme suas informações para finalizar</p>
            </div>
            
            <div className="bg-muted/5 border-2 border-border rounded-2xl overflow-hidden divide-y divide-border/50">
                {/* Dados Básicos */}
                <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Candidato</span>
                        <div className="text-right">
                            <p className="text-sm font-bold text-foreground uppercase tracking-tight">{formData.name}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">{formData.email}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WhatsApp</span>
                        <p className="text-sm font-bold text-foreground tracking-tight">{formData.phone}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Localização</span>
                        <p className="text-sm font-bold text-foreground tracking-tight uppercase">{formData.city}</p>
                    </div>
                </div>

                {/* Links e Social */}
                {(formData.linkedin || formData.github || formData.portfolio) && (
                    <div className="p-5 space-y-4 bg-muted/2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Links e Social</span>
                            <div className="flex gap-2">
                                {formData.linkedin && (
                                    <div className="size-8 bg-white border border-border rounded-lg flex items-center justify-center text-[#0A66C2] shadow-sm" title="LinkedIn">
                                        <Icon icon="mdi:linkedin" className="size-5" />
                                    </div>
                                )}
                                {formData.github && (
                                    <div className="size-8 bg-white border border-border rounded-lg flex items-center justify-center text-[#181717] shadow-sm" title="GitHub">
                                        <Icon icon="mdi:github" className="size-5" />
                                    </div>
                                )}
                                {formData.portfolio && (
                                    <div className="size-8 bg-white border border-border rounded-lg flex items-center justify-center text-primary shadow-sm" title="Portfólio">
                                        <Icon icon="material-symbols:link" className="size-5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Diversidade */}
                <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Diversidade</span>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">
                                {formData.gender ? (genderMap[formData.gender] || 'Outro') : 'Não informado'} 
                                {formData.race && ` • ${raceMap[formData.race] || formData.race}`}
                            </p>
                            {formData.isPcd && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">PCD Ativo</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Documentação */}
                <div className="p-5 bg-primary/[0.02]">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Documentação</span>
                        <div className="flex items-center gap-2">
                            {formData.resume && <Icon icon="material-symbols:check-circle" className="size-4 text-success" />}
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.resume ? 'text-success' : 'text-muted-foreground'}`}>
                                {formData.resume ? 'Currículo Anexado' : 'Sem Currículo'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist de completude do perfil */}
            {!isDataLoading && (() => {
                const checks = [
                    { label: 'Resumo Profissional', ok: !!currentCandidate?.summary },
                    { label: 'Formação Acadêmica', ok: (currentCandidate?.education?.length ?? 0) > 0 },
                    { label: 'Experiência Profissional', ok: (currentCandidate?.experience?.length ?? 0) > 0 },
                    { label: 'Habilidades ou Idiomas', ok: (currentCandidate?.skills?.length ?? 0) > 0 || (currentCandidate?.languages?.length ?? 0) > 0 },
                    { label: 'LinkedIn ou Currículo', ok: !!(formData.linkedin || formData.resume) },
                ];
                const missing = checks.filter(c => !c.ok);
                if (missing.length === 0) return null;
                return (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:info-outline" className="size-4 text-amber-500 shrink-0" />
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Perfil incompleto</span>
                        </div>
                        <ul className="space-y-1.5">
                            {missing.map(item => (
                                <li key={item.label} className="flex items-center gap-2 text-[11px] font-semibold text-amber-700">
                                    <Icon icon="material-symbols:warning-outline" className="size-3.5 text-amber-500 shrink-0" />
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-amber-600 font-medium">Você pode candidatar-se assim mesmo, mas perfis completos têm mais visibilidade.</p>
                    </div>
                );
            })()}

            <div className="pt-8 flex justify-between items-center border-t border-border">
                <button
                    onClick={prevStep}
                    disabled={isSubmitting || isDuplicateCheckPending}
                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Voltar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isDuplicateCheckPending || hasDuplicateApplication}
                    className="h-16 px-12 bg-primary text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enviando...' : 'Confirmar Candidatura'}
                    {!isSubmitting && <Icon icon="material-symbols:send" className="size-5" />}
                </button>
            </div>
        </div>
    );
};

    return (
        <div className="bg-[#FAFAFA] text-foreground transition-all duration-300 antialiased min-h-screen pb-32 font-sans">
            <div className="max-w-2xl mx-auto px-6 py-10 md:py-16">
                
                {/* Minimal Header */}
                <div className="mb-8 space-y-6">
                    <button onClick={() => navigate(isTalentPool ? '/vagas' : (slug ? `/vagas/${slug}/${id}` : '/vagas'))} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all">
                        <Icon icon="material-symbols:arrow-left" className="size-4" />
                        Voltar para a vaga
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border pb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">Candidatura</h1>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest truncate max-w-[300px]">{job?.title} • {job?.company_name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Etapa</p>
                                <p className="text-lg font-bold text-foreground tabular-nums">{step} <span className="text-muted-foreground/40 text-xs">/ 4</span></p>
                            </div>
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" style={{ width: `${(step / 4) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white border border-border shadow-2xl shadow-black/[0.03] rounded-[32px] overflow-hidden">
                    <div className="p-8 md:p-12">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStepDiversity()}
                        {step === 4 && renderStep4()}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex flex-col items-center gap-4 text-muted-foreground/40">
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:lock" className="size-3" />
                        <p className="text-[9px] font-bold uppercase tracking-widest">Dados protegidos por criptografia de ponta a ponta</p>
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]">INCI RECRUTA • 2026</p>
                </div>
            </div>
        </div>
    );
};

export default JobApplication;
