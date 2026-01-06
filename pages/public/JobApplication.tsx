import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { JobService } from '../../src/services/JobService';
import { CandidateService } from '../../src/services/CandidateService';
import { Job, Candidate } from '../../types';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';

const JobApplication: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { success, error, warning } = useToast();
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [job, setJob] = useState<Job | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        linkedin: '',
        portfolio: '',
        summary: '',
        password: '',
        confirmPassword: '',
        experiences: [
            { company: '', position: '', duration: '', description: '' }
        ],
        resume: null as File | null
    });

    // Smart Flow State
    const [formStatus, setFormStatus] = useState<Record<string, 'verified' | 'manual'>>({});
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [showMissingAlert, setShowMissingAlert] = useState(false);
    const [existingResumeUrl, setExistingResumeUrl] = useState('');
    const [existingResumeName, setExistingResumeName] = useState('');

    // Load job details
    useEffect(() => {
        const loadJob = async () => {
            if (id) {
                const fetchedJob = await JobService.getJobById(id);
                setJob(fetchedJob);
            }
        };
        loadJob();
    }, [id]);

    // Autofill form if user is authenticated
    useEffect(() => {
        const autofillForm = async () => {
            if (isAuthenticated && user) {
                // Fetch latest candidate profile to autofill
                const { data: profile, error: profileError } = await supabase
                    .from('candidates')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('applied_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (profileError) {
                    console.error('[JobApplication] Error fetching profile:', profileError);
                    return;
                }

                if (profile) {
                    const statusUpdates: Record<string, 'verified' | 'manual'> = {};
                    const newMissing: string[] = [];

                    // Field mapping for validation
                    const fields = [
                        { key: 'name', label: 'Nome completo', value: profile.name },
                        { key: 'email', label: 'E-mail', value: profile.email },
                        { key: 'phone', label: 'Telefone', value: profile.phone },
                        { key: 'city', label: 'Cidade', value: profile.location },
                        { key: 'linkedin', label: 'LinkedIn', value: profile.linkedin },
                        { key: 'portfolio', label: 'Portfólio', value: profile.portfolio }
                    ];

                    fields.forEach(f => {
                        if (f.value) {
                            statusUpdates[f.key] = 'verified';
                        } else {
                            if (['name', 'email', 'phone', 'city'].includes(f.key)) {
                                newMissing.push(f.key);
                            }
                        }
                    });

                    setFormData(prev => ({
                        ...prev,
                        name: profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                        city: profile.location || '',
                        linkedin: profile.linkedin || '',
                        portfolio: profile.portfolio || '',
                        summary: profile.summary || '',
                        experiences: profile.experiences && profile.experiences.length > 0
                            ? profile.experiences
                            : prev.experiences,
                    }));

                    if (profile.resume_url) {
                        setExistingResumeUrl(profile.resume_url);
                        // Extract a friendly name from URL or generic
                        const name = profile.resume_url.split('/').pop()?.split('_')[0] || 'Curriculo_Salvo.pdf';
                        setExistingResumeName(name);
                    }

                    setFormStatus(statusUpdates);
                    setMissingFields(newMissing);
                    setShowMissingAlert(newMissing.length > 0);
                }
            }
        };
        autofillForm();
    }, [isAuthenticated, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                warning('Por favor, envie apenas arquivos PDF.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                warning('O arquivo deve ter no máximo 5MB.');
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        // Validate password if not authenticated
        if (!isAuthenticated) {
            if (!formData.password) {
                error('Você precisa criar uma senha para sua conta.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                error('As senhas não coincidem.');
                return;
            }
            if (formData.password.length < 6) {
                error('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
        }

        setIsLoading(true);
        let resumeUrl = '';

        try {
            // 1. Account Creation (if not authenticated)
            let userId = user?.id;

            if (!isAuthenticated) {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            name: formData.name,
                            role: 'candidate'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered')) {
                        error('Este e-mail já possui uma conta. Por favor, faça login.');
                        navigate('/login');
                        return;
                    }
                    throw authError;
                }
                userId = authData.user?.id;
            }

            // 2. Resume Upload Logic
            if (formData.resume) {
                resumeUrl = await CandidateService.uploadResume(formData.resume, formData.email);
            } else {
                resumeUrl = existingResumeUrl;
            }

            const newCandidate: Omit<Candidate, 'id'> = {
                jobId: id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.city,
                applied_at: new Date().toISOString(),
                columnId: 'received',
                initials: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2),
                avatarColor: 'bg-primary',
                textColor: 'text-white',
                linkedin: formData.linkedin,
                portfolio: formData.portfolio,
                summary: formData.summary,
                experiences: formData.experiences,
                resume_url: resumeUrl,
                user_id: userId
            };

            await CandidateService.addCandidate(newCandidate);

            // Invalidate queries to refresh dashboard and job detail
            queryClient.invalidateQueries({ queryKey: ['candidate-data', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['candidates'] });

            if (isAuthenticated) {
                success('Candidatura enviada com sucesso!');
            } else {
                success('Parabéns! Sua conta foi criada e sua candidatura enviada com sucesso.');
            }
            navigate('/candidate/dashboard');
        } catch (err: any) {
            console.error('Submission error:', err);
            error('Erro ao processar candidatura: ' + (err.message || 'Tente novamente.'));
        } finally {
            setIsLoading(false);
        }
    };

    // Step 1: Personal Data
    const renderStep1 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Suas informações</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Preencha seus dados de contato para prosseguir com a candidatura.</p>
                </div>

                {/* Missing Fields Alert */}
                {showMissingAlert && missingFields.length > 0 && (
                    <div className="mx-8 mt-2 mb-4 p-4 border border-amber-200 bg-amber-50 rounded-lg flex flex-col gap-2 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            <span>Encontramos seu perfil, mas precisamos de alguns dados:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-7">
                            {missingFields.map(field => {
                                const label = field === 'name' ? 'Nome' :
                                    field === 'email' ? 'E-mail' :
                                        field === 'phone' ? 'Telefone' : 'Cidade';
                                return (
                                    <span key={field} className="text-xs px-2 py-1 bg-white border border-amber-200 rounded font-medium text-amber-700">
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="p-8 flex flex-col gap-8">
                    {isAuthenticated && !showMissingAlert && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                                {formData.name ? formData.name.charAt(0) : 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Perfil verificado</p>
                                <p className="text-xs text-muted-foreground">Seus dados foram preenchidos automaticamente.</p>
                            </div>
                            <span className="material-symbols-outlined text-primary">verified</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Nome completo <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className={`w-full h-12 rounded-md border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 outline-none hover:border-ring
                                        ${formStatus.name === 'verified' ? 'border-primary/50 bg-primary/5' : 'border-border'}
                                        ${missingFields.includes('name') ? 'border-destructive/50 focus-visible:border-destructive ring-destructive/20' : ''}
                                    `}
                                    placeholder="Nome completo"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formStatus.name === 'verified' ? (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-primary animate-in zoom-in">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-background/50 px-1.5 rounded">Perfil</span>
                                        <span className="material-symbols-outlined text-lg">verified</span>
                                    </div>
                                ) : formData.name && (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-xl animate-in zoom-in duration-300">check_circle</span>
                                )}
                            </div>
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">E-mail corporativo ou pessoal <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className={`w-full h-12 rounded-md border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 outline-none hover:border-ring
                                        ${formStatus.email === 'verified' ? 'border-primary/50 bg-primary/5' : 'border-border'}
                                    `}
                                    placeholder="seu@email.com"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formStatus.email === 'verified' && (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-lg animate-in zoom-in">verified</span>
                                )}
                            </div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Telefone / WhatsApp <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className={`w-full h-12 rounded-md border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 outline-none hover:border-ring
                                        ${formStatus.phone === 'verified' ? 'border-primary/50 bg-primary/5' : 'border-border'}
                                        ${missingFields.includes('phone') ? 'border-destructive/50 bg-destructive/5' : ''}
                                    `}
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formStatus.phone === 'verified' && (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-lg animate-in zoom-in">verified</span>
                                )}
                            </div>
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Cidade e UF <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className={`w-full h-12 rounded-md border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 outline-none hover:border-ring
                                        ${formStatus.city === 'verified' ? 'border-primary/50 bg-primary/5' : 'border-border'}
                                        ${missingFields.includes('city') ? 'border-destructive/50 bg-destructive/5' : ''}
                                    `}
                                    placeholder="Cidade - UF"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formStatus.city === 'verified' && (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-lg animate-in zoom-in">verified</span>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Presença digital</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Links opcionais para acelerar o processo de análise.</p>
                </div>
                <div className="p-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">LinkedIn</span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="linkedin.com/in/seuusuario"
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Portfólio / GitHub</span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="seusite.com ou github.com/seuusuario"
                                type="url"
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={nextStep}
                    className="h-12 px-10 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40"
                >
                    Continuar candidatura
                </button>
            </div>
        </div>
    );

    // Step 2: Experience & Resume
    const renderStep2 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Experiência e Currículo</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Conte um pouco sobre sua trajetória profissional.</p>
                </div>

                <div className="p-8 flex flex-col gap-10">
                    <div className="flex flex-col gap-5">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Última empresa onde trabalhou <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className="w-full h-12 rounded-md border border-border bg-background px-4 pl-11 text-sm text-foreground font-medium placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                    placeholder="Ex: Google"
                                    name="company"
                                    value={formData.experiences[0].company}
                                    onChange={(e) => {
                                        const newExps = [...formData.experiences];
                                        newExps[0].company = e.target.value;
                                        setFormData({ ...formData, experiences: newExps });
                                    }}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">business</span>
                            </div>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <label className="flex flex-col gap-2.5">
                                <span className="text-xs font-semibold text-muted-foreground px-1">Cargo ocupado <span className="text-destructive">*</span></span>
                                <div className="relative">
                                    <input
                                        className="w-full h-12 rounded-md border border-border bg-background px-4 pl-11 text-sm text-foreground font-medium placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                        placeholder="Ex: Desenvolvedor Senior"
                                        name="position"
                                        value={formData.experiences[0].position}
                                        onChange={(e) => {
                                            const newExps = [...formData.experiences];
                                            newExps[0].position = e.target.value;
                                            setFormData({ ...formData, experiences: newExps });
                                        }}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">badge</span>
                                </div>
                            </label>
                            <label className="flex flex-col gap-2.5">
                                <span className="text-xs font-semibold text-muted-foreground px-1">Tempo de experiência <span className="text-destructive">*</span></span>
                                <div className="relative">
                                    <input
                                        className="w-full h-12 rounded-md border border-border bg-background px-4 pl-11 text-sm text-foreground font-medium placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                        placeholder="Ex: 2 anos e 3 meses"
                                        name="duration"
                                        value={formData.experiences[0].duration}
                                        onChange={(e) => {
                                            const newExps = [...formData.experiences];
                                            newExps[0].duration = e.target.value;
                                            setFormData({ ...formData, experiences: newExps });
                                        }}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">schedule</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Biografia profissional <span className="text-destructive">*</span></span>
                            <textarea
                                rows={4}
                                className="w-full rounded-md border border-border bg-background p-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring resize-none"
                                placeholder="Conte um pouco sobre sua trajetória, principais conquistas e o que você busca para sua carreira..."
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-semibold text-muted-foreground px-1">Currículo (PDF) <span className="text-destructive">*</span></span>
                        <div className="flex items-center justify-center w-full">
                            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                                ${formData.resume ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30'}
                            `}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {formData.resume ? (
                                        <>
                                            <span className="material-symbols-outlined text-primary text-4xl mb-3">check_circle</span>
                                            <p className="text-sm font-semibold text-primary">{formData.resume.name}</p>
                                            <p className="text-xs text-primary/60 mt-1">Clique para substituir o arquivo</p>
                                        </>
                                    ) : existingResumeUrl ? (
                                        <>
                                            <span className="material-symbols-outlined text-primary text-4xl mb-3">verified</span>
                                            <p className="text-sm font-semibold text-primary">{existingResumeName}</p>
                                            <p className="text-xs text-primary/60 mt-1 italic">Currículo salvo em seu perfil</p>
                                            <p className="text-[10px] text-muted-foreground mt-2">Clique para enviar um novo arquivo</p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-muted-foreground/60 text-4xl mb-3">upload_file</span>
                                            <p className="text-sm font-semibold text-foreground/80">Clique para enviar ou arraste seu PDF</p>
                                            <p className="text-xs text-muted-foreground/60 mt-2 italic">PDF de até 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-muted/20 border-t border-border flex justify-between gap-6">
                    <button
                        onClick={prevStep}
                        className="h-12 px-8 rounded-base border border-border bg-background text-foreground text-xs font-semibold hover:bg-accent transition-all duration-200 outline-none flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">west</span>
                        Voltar
                    </button>
                    <button
                        onClick={nextStep}
                        className="h-12 px-10 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40"
                    >
                        Continuar candidatura
                    </button>
                </div>
            </div>
        </div>
    );

    // Step 3: Review
    const renderStep3 = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4 bg-muted/20">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Revise sua candidatura</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Confirme se todas as informações estão corretas.</p>
                </div>

                <div className="p-8 space-y-10">
                    {/* Summary Item */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b border-border pb-3">
                            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                            <span className="text-xs font-semibold text-muted-foreground">Dados pessoais</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold">Nome</span>
                                <p className="text-sm font-semibold text-foreground">{formData.name}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold">E-mail</span>
                                <p className="text-sm font-semibold text-foreground">{formData.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Resume Item */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b border-border pb-3">
                            <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                            <span className="text-xs font-semibold text-muted-foreground">Biografia e documentos</span>
                        </div>
                        <div className="flex flex-col gap-6 pl-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-muted-foreground font-semibold">Biografia profissional</span>
                                <p className="text-sm font-medium text-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                    "{formData.summary || 'Não informada'}"
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold">Arquivo de currículo</span>
                                <div className="flex items-center gap-3 text-primary">
                                    <span className="material-symbols-outlined">description</span>
                                    <p className="text-sm font-semibold underline underline-offset-2">
                                        {formData.resume?.name || existingResumeName || 'Não anexado'}
                                        {(!formData.resume && existingResumeName) && (
                                            <span className="ml-2 text-[10px] font-normal italic brightness-90">(Salvo no perfil)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b border-border pb-3">
                            <span className="material-symbols-outlined text-primary text-[20px]">link</span>
                            <span className="text-xs font-semibold text-muted-foreground">Canais digitais</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold">LinkedIn</span>
                                <p className="text-sm font-semibold text-foreground">{formData.linkedin || 'Não informado'}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-semibold">Portfólio</span>
                                <p className="text-sm font-semibold text-foreground">{formData.portfolio || 'Não informado'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-muted/20 border-t border-border flex flex-col sm:flex-row justify-between gap-6">
                    <button
                        onClick={prevStep}
                        className="h-12 px-8 rounded-base border border-border bg-background text-foreground text-xs font-semibold hover:bg-accent transition-all duration-200 outline-none flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">west</span>
                        Voltar
                    </button>
                    {isAuthenticated ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="group h-12 px-12 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40 flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isLoading ? 'Enviando...' : (
                                <>
                                    <span>Finalizar candidatura</span>
                                    <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">send</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="group h-12 px-12 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40 flex items-center justify-center gap-4"
                        >
                            <span>Próximo: Criar conta</span>
                            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">east</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    // Step 4: Account Security
    const renderStep4 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">security</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Segurança da conta</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Crie uma senha para acessar seu painel de candidato e acompanhar o status da sua aplicação.</p>
                </div>

                <div className="p-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Crie sua senha <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                    placeholder="Mínimo 6 caracteres"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">lock</span>
                            </div>
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Confirme sua senha <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className={`w-full h-12 rounded-md border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 outline-none hover:border-ring
                                        ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-destructive/50' : 'border-border'}
                                    `}
                                    placeholder="Repita a senha"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.confirmPassword && formData.password === formData.confirmPassword ? (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary">check_circle</span>
                                ) : (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">lock_reset</span>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
                            Dica de acesso
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Ao finalizar, você terá acesso imediato à sua área logada para editar seu currículo, ver feedback de recrutadores e aplicar para outras vagas com apenas um clique.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-muted/20 border-t border-border flex flex-col sm:flex-row justify-between gap-6">
                    <button
                        onClick={prevStep}
                        className="h-12 px-8 rounded-base border border-border bg-background text-foreground text-xs font-semibold hover:bg-accent transition-all duration-200 outline-none flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">west</span>
                        Voltar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="group h-12 px-12 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40 flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{isAuthenticated ? 'Enviando...' : 'Criando conta...'}</span>
                            </div>
                        ) : (
                            <>
                                <span>Finalizar candidatura</span>
                                <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">how_to_reg</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-background font-display text-foreground transition-all duration-200 min-h-screen">
            <div className="relative flex h-full w-full flex-col overflow-x-hidden">
                <main className="layout-container flex h-full grow flex-col px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
                    {/* Top Navigation / Back Link */}
                    <div className="flex items-center gap-2 pb-10">
                        <button
                            onClick={() => navigate(`/vagas/${id}`)}
                            className="group flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-3 py-2"
                        >
                            <span className="material-symbols-outlined text-xl mr-2 transition-transform group-hover:-translate-x-1">keyboard_backspace</span>
                            Ver detalhes da vaga
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
                        {/* LEFT COLUMN: Form Application */}
                        <div className="lg:col-span-8 flex flex-col gap-10">
                            {/* Header Section */}
                            <div className="flex flex-col gap-3">
                                <h1 className="text-foreground text-3xl font-semibold tracking-tight transition-colors">
                                    Candidatura simplificada
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium leading-relaxed flex items-center gap-2.5 transition-colors">
                                    <span className="material-symbols-outlined text-[20px] text-primary">timer</span>
                                    <span>Processo rápido para {job?.title || 'vaga'} • Leva aprox. 3 min</span>
                                </p>
                            </div>

                            {/* Progress Indicator */}
                            <div className="rounded-lg bg-card p-8 border border-border transition-colors">
                                <div className="flex flex-col gap-5">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-muted-foreground">Etapa atual</p>
                                            <p className="text-foreground text-sm font-semibold transition-colors">
                                                {step}. {
                                                    step === 1 ? 'Dados pessoais' :
                                                        step === 2 ? 'Experiência e Currículo' :
                                                            step === 3 ? 'Revisão final' : 'Segurança da conta'
                                                }
                                            </p>
                                        </div>
                                        <p className="text-primary text-lg font-semibold tracking-tight">
                                            {Math.round((step / (isAuthenticated ? 3 : 4)) * 100)}%
                                        </p>
                                    </div>
                                    <div className="rounded-full bg-muted h-2.5 w-full overflow-hidden transition-colors">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-700 ease-in-out"
                                            style={{ width: `${(step / (isAuthenticated ? 3 : 4)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Forms */}
                            <div className="transition-all duration-300">
                                {step === 1 && renderStep1()}
                                {step === 2 && renderStep2()}
                                {step === 3 && renderStep3()}
                                {step === 4 && renderStep4()}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Job Summary) */}
                        <div className="lg:col-span-4 flex flex-col gap-8 order-first lg:order-last">
                            <div className="rounded-lg bg-card text-card-foreground border border-border sticky top-28 overflow-hidden transition-colors shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-3 mb-8 tracking-tight">
                                        <span className="material-symbols-outlined text-primary text-[24px]">work_outline</span>
                                        Resumo da vaga
                                    </h3>
                                    <div className="flex flex-col gap-8">
                                        <div className="flex items-center gap-5 transition-transform hover:translate-x-1 duration-300">
                                            <div className="size-14 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary text-3xl">hexagon</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-lg font-semibold text-foreground tracking-tight leading-none">{job?.title}</p>
                                                <p className="text-xs font-semibold text-muted-foreground capitalize">{job?.department} • {job?.location}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                                                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                                                {job ? `${job.location} (${job.model})` : '---'}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                                                <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                                                {job?.salary_min && job?.salary_max
                                                    ? `R$ ${job.salary_min.toLocaleString('pt-BR')} - R$ ${job.salary_max.toLocaleString('pt-BR')}`
                                                    : 'A combinar'}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                                                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                                                {job?.contract || 'Tempo integral'}
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-3">
                                                {job?.context || job?.mission}
                                            </p>
                                            <Link to={`/vagas/${id}`} className="text-xs font-semibold text-primary hover:text-primary/70 transition-all mt-4 inline-block underline underline-offset-4 decoration-primary/30">
                                                Ver detalhes
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobApplication;
