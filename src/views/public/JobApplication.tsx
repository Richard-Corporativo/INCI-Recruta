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

const JobApplication: React.FC = () => {
    const { slug, id } = useParams() as { slug?: string; id?: string };
    const navigate = useNavigate();
    const { success, error, warning } = useToast();
    const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
    const [step, setStep] = useState(1);
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isTalentPool = !id;
    const applicationPath = id && slug ? `/vagas/${slug}/${id}/candidatar` : '/vagas';
    const loginPath = `/login?next=${encodeURIComponent(applicationPath)}`;
    const completeProfilePath = `/perfil/completar?next=${encodeURIComponent(applicationPath)}`;

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', city: '', linkedin: '', portfolio: '',
        experiences: [{ company: '', position: '', duration: '', description: '' }],
        resume: null as File | null,
        pretension_min: '', pretension_max: '', availability: '',
        gender: '', race: '', isPcd: false, pcdDetails: ''
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

        if (user.profile_status === 'incomplete') {
            warning('Você precisa completar seu perfil antes de se candidatar.');
            navigate(completeProfilePath);
        }
    }, [isAuthLoading, isAuthenticated, user, warning, navigate, loginPath, completeProfilePath]);

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

                setFormData(prev => ({
                    ...prev,
                    name: profile?.name || userProfile?.name || user.name || '',
                    email: profile?.email || userProfile?.email || user.email || '',
                    phone: profile?.phone || userProfile?.phone || user.phone || '',
                    city: profile?.location || userProfile?.location || user.location || '',
                    linkedin: profile?.linkedin || userProfile?.linkedin || user.linkedin || '',
                    portfolio: profile?.portfolio || userProfile?.portfolio || user.portfolio || '',
                    pretension_min: profile?.pretension_min?.toString() || '',
                    pretension_max: profile?.pretension_max?.toString() || '',
                    availability: profile?.availability || ''
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
            if (!formData.name.trim()) { warning('Por favor, informe seu nome completo.'); return; }
            if (!formData.email.trim()) { warning('Por favor, informe seu e-mail.'); return; }
            if (!formData.phone.trim()) { warning('Por favor, informe seu telefone.'); return; }
            if (!formData.city.trim()) { warning('Por favor, informe sua cidade.'); return; }
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
        try {
            if (!isAuthenticated || !user) {
                warning('Faça login como candidato para enviar sua candidatura.');
                navigate(loginPath);
                return;
            }

            if (user.role !== 'candidate') {
                warning('Candidaturas são permitidas apenas para contas de candidato.');
                navigate('/admin/dashboard');
                return;
            }

            const newCandidate: Omit<Candidate, 'id'> = {
                jobId: isTalentPool ? undefined : id,
                name: formData.name, email: formData.email, phone: formData.phone,
                location: formData.city,
                columnId: 'received', initials: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2),
                avatarColor: 'bg-foreground', textColor: 'text-background',
                linkedin: formData.linkedin, portfolio: formData.portfolio, user_id: user?.id,
                pretension_min: formData.pretension_min ? Number(formData.pretension_min) : undefined,
                pretension_max: formData.pretension_max ? Number(formData.pretension_max) : undefined,
                availability: formData.availability
            };

            const createdCandidate = await CandidateService.addCandidate(newCandidate, formData.resume || undefined);
            if (createdCandidate?.id && (formData.gender || formData.race || formData.isPcd)) {
                await CandidateService.saveDiversityData(createdCandidate.id, {
                    gender: formData.gender, race: formData.race, isPcd: formData.isPcd
                });
            }
            success('Sua candidatura foi enviada com sucesso!');
            analyticsService.trackEvent('application_completed', {
                job_id: id,
                is_talent_pool: isTalentPool
            }, id as string);
            navigate('/candidate/dashboard');
        } catch (err: any) {
            error('Erro ao enviar candidatura: ' + (err.message || 'Tente novamente.'));
        }
    };

    if (isAuthLoading || !isAuthenticated || user?.role !== 'candidate' || user?.profile_status === 'incomplete') {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FAFAFA] text-foreground font-semibold uppercase tracking-widest text-[10px]">
                Verificando acesso de candidato...
            </div>
        );
    }

    const renderStep1 = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight uppercase">Dados Pessoais</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Informações básicas para contato</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">Nome Completo</label>
                    <input className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40" placeholder="seu nome completo" type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">E-mail</label>
                    <input className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40" placeholder="seu@email.com" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">WhatsApp / Telefone</label>
                    <input className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40" placeholder="(00) 00000-0000" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">Cidade / UF</label>
                    <input className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40" placeholder="ex: Barbalha - CE" type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
            </div>
            <div className="pt-8 flex justify-end">
                <button onClick={nextStep} className="h-14 px-10 bg-primary text-white font-semibold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95">Próximo passo</button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight uppercase">Currículo e Links</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Suas experiências e portfólio</p>
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">Currículo em PDF (Máx 5MB) <span className="text-error">*</span></label>
                {!formData.resume ? (
                    <label className="flex flex-col items-center justify-center w-full h-52 border border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/10 hover:border-primary/50 transition-all group">
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        <div className="size-12 bg-muted/40 border border-border flex items-center justify-center rounded-xl mb-3 group-hover:scale-105 transition-transform">
                            <Icon icon="material-symbols:cloud-upload" className="size-6 text-primary" />
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Selecionar arquivo</span>
                        <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">PDF apenas</span>
                    </label>
                ) : (
                    <div className="flex items-center justify-between p-5 bg-muted/10 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                                <Icon icon="material-symbols:description" className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[var(--foreground)] truncate max-w-[200px]">{formData.resume.name}</span>
                                <span className="text-[8px] font-semibold text-success uppercase tracking-widest">Pronto para envio</span>
                            </div>
                        </div>
                        <button onClick={() => setFormData(prev => ({ ...prev, resume: null }))} className="size-8 flex items-center justify-center text-error hover:bg-error/10 rounded-full transition-colors">
                            <Icon icon="material-symbols:delete" className="size-5" />
                        </button>
                    </div>
                )}
            </div>
            <div className="pt-8 flex justify-between items-center">
                <button onClick={prevStep} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-[var(--foreground)] transition-colors">Voltar</button>
                <button onClick={nextStep} className="h-14 px-10 bg-primary text-white font-semibold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95">Próximo passo</button>
            </div>
        </div>
    );

    const renderStepDiversity = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight uppercase">Diversidade</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Inclusão e pertencimento (Opcional)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">Gênero</label>
                    <select className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none appearance-none cursor-pointer" name="gender" value={formData.gender} onChange={handleInputChange}>
                        <option value="">NÃO INFORMAR</option>
                        <option value="female">MULHER</option>
                        <option value="male">HOMEM</option>
                        <option value="non_binary">NÃO-BINÁRIO</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--foreground)] uppercase tracking-widest pl-1">Raça / Cor</label>
                    <select className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none appearance-none cursor-pointer" name="race" value={formData.race} onChange={handleInputChange}>
                        <option value="">NÃO INFORMAR</option>
                        <option value="branca">BRANCA</option>
                        <option value="preta">PRETA</option>
                        <option value="parda">PARDA</option>
                        <option value="amarela">AMARELA</option>
                        <option value="indigena">INDÍGENA</option>
                    </select>
                </div>
            </div>
            <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <input
                        type="checkbox"
                        name="isPcd"
                        checked={formData.isPcd}
                        onChange={handleInputChange}
                        className="size-5 rounded border-border accent-primary cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-foreground">Sou Pessoa com Deficiência (PCD)</span>
                </label>
                {formData.isPcd && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-[10px] font-semibold text-foreground uppercase tracking-widest pl-1">Descreva sua deficiência (opcional)</label>
                        <input
                            type="text"
                            name="pcdDetails"
                            value={formData.pcdDetails}
                            onChange={handleInputChange}
                            placeholder="Ex: Deficiência visual parcial, cadeirante..."
                            className="w-full h-14 px-5 bg-muted/20 border border-border rounded-xl text-sm font-semibold focus:border-primary outline-none"
                        />
                    </div>
                )}
            </div>
            <div className="pt-8 flex justify-between items-center">
                <button onClick={prevStep} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-[var(--foreground)] transition-colors">Voltar</button>
                <div className="flex gap-4">
                    <button onClick={nextStep} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-[var(--foreground)] transition-colors">Pular</button>
                    <button onClick={nextStep} className="h-14 px-10 bg-primary text-white font-semibold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95">Continuar</button>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-foreground tracking-tight uppercase">Finalização</h2>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Revise seus dados antes de enviar</p>
            </div>
            <div className="p-8 bg-muted/10 border-2 border-border rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b-2 border-border/50 pb-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Nome</span>
                    <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center border-b-2 border-border/50 pb-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">E-mail</span>
                    <span className="text-sm font-semibold text-foreground tracking-tight">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center border-b-2 border-border/50 pb-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Telefone</span>
                    <span className="text-sm font-semibold text-foreground tracking-tight">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center border-b-2 border-border/50 pb-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Cidade</span>
                    <span className="text-sm font-semibold text-foreground tracking-tight">{formData.city}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Currículo</span>
                    <span className={`text-sm font-semibold uppercase tracking-tight ${formData.resume ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                        {formData.resume ? 'Anexado' : 'Não anexado'}
                    </span>
                </div>
            </div>
            <div className="pt-8 flex justify-between items-center">
                <button onClick={prevStep} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">Voltar</button>
                <button onClick={handleSubmit} className="h-14 px-12 bg-primary text-white font-semibold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95 flex items-center gap-2">
                    Enviar Candidatura
                    <Icon icon="material-symbols:send" className="size-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#FAFAFA] text-foreground transition-all duration-300 antialiased min-h-screen pb-32 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                
                {/* Minimal Header */}
                <div className="mb-10 space-y-6">
                    <button onClick={() => navigate(isTalentPool ? '/vagas' : (slug ? `/vagas/${slug}/${id}` : '/vagas'))} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all">
                        <Icon icon="material-symbols:arrow-left" className="size-4" />
                        Voltar
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-border pb-8">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground uppercase">Candidatura</h1>
                            <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">{job?.title} • {job?.department}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Etapa</p>
                                <p className="text-xl font-semibold text-foreground tabular-nums">{step} <span className="text-muted-foreground/40 text-sm">/ 4</span></p>
                            </div>
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white border-2 border-border rounded-2xl p-8 md:p-14">
                    <div className="w-full">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStepDiversity()}
                        {step === 4 && renderStep4()}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground">
                    <Icon icon="material-symbols:lock" className="size-4 opacity-40" />
                    <p className="text-[9px] font-semibold uppercase tracking-widest">Protocolo em conformidade com a LGPD</p>
                </div>
            </div>
        </div>
    );
};

export default JobApplication;
