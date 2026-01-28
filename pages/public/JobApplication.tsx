import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { JobService } from '../../src/services/JobService';
import { CandidateService } from '../../src/services/CandidateService';
import { Job, Candidate } from '../../types';
import { supabase } from '../../lib/supabase';
import { formatSalaryRange } from '../../src/utils/formatters';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import JobSummarySkeleton from '../../components/candidate/JobSummarySkeleton';

const JobApplication: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error, warning } = useToast();
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState(1);
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isTalentPool = !id;

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        linkedin: '',
        portfolio: '',
        experiences: [
            { company: '', position: '', duration: '', description: '' }
        ],
        resume: null as File | null,
        pretension_min: '',
        pretension_max: '',

        // Diversity Fields (Optional & Segregated)
        gender: '',
        race: '',
        isPcd: false,
        pcdDetails: ''
    });

    // Load job details
    useEffect(() => {
        const loadJob = async () => {
            setIsLoading(true);
            if (id) {
                const fetchedJob = await JobService.getJobById(id);
                setJob(fetchedJob);

                // Check deadline
                if (fetchedJob?.registration_deadline) {
                    const deadline = new Date(fetchedJob.registration_deadline);
                    // Reset hours for comparison
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    deadline.setHours(23, 59, 59, 999);

                    if (today > deadline) {
                        warning('O prazo para candidatura nesta vaga expirou.');
                        navigate(`/vagas/${id}`);
                    }
                }
            } else {
                // Talent Pool Virtual Job
                setJob({
                    id: 'talentos',
                    title: 'Banco de Talentos',
                    department: 'Talentos INCI',
                    location: 'Brasil',
                    model: 'Remoto/Híbrido/Presencial',
                    contract: 'A combinar',
                    urgency: 'Média',
                    status: 'Ativa',
                    salary_min: 0,
                    salary_max: 0,
                    context: 'Candidatura espontânea para futuras oportunidades em nossa base de dados.',
                    candidates_count: 0,
                    created_at: new Date().toISOString()
                } as Job);
            }
            setIsLoading(false);
        };
        loadJob();
    }, [id, navigate]);

    // Autofill form if user is authenticated
    useEffect(() => {
        const autofillForm = async () => {
            if (isAuthenticated && user) {
                // SECURITY: If logged in but profile incomplete, force Wizard
                if (user.profile_status === 'incomplete') {
                    warning('Você precisa completar seu perfil e enviar seu currículo antes de se candidatar.');
                    navigate('/perfil/completar');
                    return;
                }

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
                    setFormData(prev => ({
                        ...prev,
                        name: profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                        city: profile.location || '',
                        linkedin: profile.linkedin || '',
                        portfolio: profile.portfolio || '',
                        pretension_min: profile.pretension_min?.toString() || '',
                        pretension_max: profile.pretension_max?.toString() || '',
                        availability: profile.availability || ''
                    }));
                }
            }
        };
        autofillForm();
    }, [isAuthenticated, user, navigate, warning]);

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

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev + 1);
    };
    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 0. Check for existing application if authenticated
        if (isAuthenticated && user) {
            const { data: existingApp } = await supabase
                .from('candidates')
                .select('id')
                .eq('user_id', user.id)
                .is('job_id', id || null)
                .maybeSingle();

            if (existingApp) {
                warning(isTalentPool
                    ? 'Você já possui um cadastro em nosso Banco de Talentos.'
                    : 'Você já possui uma candidatura ativa para esta vaga. Acompanhe o status no seu painel.');
                navigate('/candidate/dashboard');
                return;
            }
        } else if (!isAuthenticated) {
            // Check by email even for non-authenticated users to avoid duplicate profiles
            const { data: existingAppByEmail } = await supabase
                .from('candidates')
                .select('id')
                .eq('email', formData.email.trim().toLowerCase())
                .is('job_id', id || null)
                .maybeSingle();

            if (existingAppByEmail) {
                warning(isTalentPool
                    ? 'Já existe um cadastro com este e-mail em nosso Banco de Talentos. Entre na sua conta para atualizar.'
                    : 'Já existe uma candidatura com este e-mail para esta vaga. Entre na sua conta para acompanhar.');
                navigate('/login');
                return;
            }
        }

        // 1. Resume Upload Logic
        try {
            const newCandidate: Omit<Candidate, 'id'> = {
                jobId: isTalentPool ? undefined : id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.city,
                applied_at: new Date().toISOString(), // Use ISO format for timestamp
                columnId: 'received',
                initials: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2),
                avatarColor: 'bg-primary',
                textColor: 'text-white',
                linkedin: formData.linkedin,
                portfolio: formData.portfolio,
                user_id: user?.id,
                pretension_min: formData.pretension_min ? Number(formData.pretension_min) : undefined,
                pretension_max: formData.pretension_max ? Number(formData.pretension_max) : undefined,
                availability: formData.availability
            };

            const createdCandidate = await CandidateService.addCandidate(newCandidate, formData.resume || undefined);

            if (createdCandidate && createdCandidate.id) {
                // 2. Save Diversity Data (Fire & Forget / Segregated)
                // We check if any diversity data was filled to avoid unnecessary calls/empty records if totally skipped
                if (formData.gender || formData.race || formData.isPcd) {
                    await CandidateService.saveDiversityData(createdCandidate.id, {
                        gender: formData.gender,
                        race: formData.race,
                        isPcd: formData.isPcd
                    });
                }
            }


            success('Sua candidatura foi enviada com sucesso!');
            navigate('/candidate/dashboard');
        } catch (err: any) {
            console.error('Submission error:', err);
            error('Erro ao enviar candidatura: ' + (err.message || 'Tente novamente.'));
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
                <div className="p-8 flex flex-col gap-8">
                    {isAuthenticated && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                                {formData.name ? formData.name.charAt(0) : 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">Conectado / Reconhecido</p>
                                <p className="text-xs text-muted-foreground">Facilitamos o processo preenchendo seus dados automaticamente.</p>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Nome completo <span className="text-destructive">*</span></span>
                            <div className="relative">
                                <input
                                    className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                    placeholder="Nome completo"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.name && (
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-xl animate-in zoom-in duration-300">verified</span>
                                )}
                            </div>
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">E-mail corporativo ou pessoal <span className="text-destructive">*</span></span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="seu@email.com"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Telefone / WhatsApp <span className="text-destructive">*</span></span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="(00) 00000-0000"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Cidade e UF <span className="text-destructive">*</span></span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="Cidade - UF"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Pretensão Salarial Mín.</span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                                placeholder="R$ Min"
                                type="number"
                                name="pretension_min"
                                value={formData.pretension_min}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Pretensão Salarial Máx.</span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                                placeholder="R$ Max"
                                type="number"
                                name="pretension_max"
                                value={formData.pretension_max}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Disponibilidade</span>
                            <select
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange as any}
                            >
                                <option value="">Selecione...</option>
                                <option value="Imediata">Imediata</option>
                                <option value="15 dias">15 dias</option>
                                <option value="30 dias">30 dias</option>
                                <option value="A combinar">A combinar</option>
                            </select>
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

    // Step 2: Experience
    const renderStep2 = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Experiência profissional</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Conte um pouco sobre sua última experiência marcante.</p>
                </div>
                <div className="p-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Última empresa</span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="Nome da empresa"
                                type="text"
                            />
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Último cargo</span>
                            <input
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring"
                                placeholder="Cargo ocupado"
                                type="text"
                            />
                        </label>
                    </div>
                    <label className="flex flex-col gap-2.5">
                        <span className="text-xs font-semibold text-muted-foreground px-1">Resumo das atividades</span>
                        <textarea
                            className="w-full rounded-md border border-border bg-background p-4 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200 outline-none hover:border-ring resize-none"
                            placeholder="Descreva brevemente suas responsabilidades..."
                            rows={4}
                        />
                    </label>
                </div>
            </div>

            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Currículo (PDF)</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Anexe seu arquivo atualizado para análise detalhada.</p>
                </div>
                <div className="p-8">
                    {!formData.resume ? (
                        <div className="group relative border-2 border-dashed border-border rounded-xl p-12 text-center transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 cursor-pointer">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-semibold text-foreground">Clique para fazer upload ou arraste o arquivo</p>
                                    <p className="text-xs text-muted-foreground font-medium">Somente arquivos PDF • Máx. 5MB</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{formData.resume.name}</p>
                                    <p className="text-xs text-muted-foreground">PDF • {(formData.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-4">
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
    );

    // Step 3: Diversity (New)
    const renderStepDiversity = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-lg bg-card text-card-foreground border border-border overflow-hidden transition-colors">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary text-[28px]">diversity_3</span>
                        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Diversidade & Inclusão</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed">
                        Acreditamos na construção de times diversos. Estas perguntas são <strong>opcionais</strong> e têm fins <strong>estritamente estatísticos</strong>.
                    </p>
                </div>

                {/* LGPD Disclaimer Box */}
                <div className="px-8 pb-4">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">lock</span>
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Privacidade Garantida (LGPD)</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Suas respostas <strong>não serão exibidas individualmente</strong> aos recrutadores durante o processo seletivo e não impactam sua avaliação. Os dados são analisados apenas de forma agregada e anônima.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex flex-col gap-8 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Como você se identifica? (Gênero)</span>
                            <select
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange as any}
                            >
                                <option value="">Prefiro não informar</option>
                                <option value="female">Mulher (Cis ou Trans)</option>
                                <option value="male">Homem (Cis ou Trans)</option>
                                <option value="non_binary">Não-binário</option>
                                <option value="other">Outro</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-2.5">
                            <span className="text-xs font-semibold text-muted-foreground px-1">Cor ou Raça (IBGE)</span>
                            <select
                                className="w-full h-12 rounded-md border border-border bg-background px-4 text-sm text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                                name="race"
                                value={formData.race}
                                onChange={handleInputChange as any}
                            >
                                <option value="">Prefiro não informar</option>
                                <option value="white">Branca</option>
                                <option value="black">Preta</option>
                                <option value="brown">Parda</option>
                                <option value="yellow">Amarela</option>
                                <option value="indigenous">Indígena</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex flex-col gap-4 p-5 rounded-lg border border-border bg-muted/5">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="isPcd"
                                name="isPcd"
                                checked={formData.isPcd}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPcd: e.target.checked }))}
                                className="mt-1 size-5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                            />
                            <div className="flex flex-col">
                                <label htmlFor="isPcd" className="text-sm font-semibold text-foreground cursor-pointer">Sou Pessoa com Deficiência (PcD)</label>
                                <p className="text-xs text-muted-foreground mt-1">Marque se você possui alguma deficiência conforme critérios legais. Isso nos ajuda a promover acessibilidade.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={prevStep}
                    className="h-12 px-8 rounded-base border border-border bg-background text-foreground text-xs font-semibold hover:bg-accent transition-all duration-200 outline-none flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">west</span>
                    Voltar
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={nextStep}
                        className="h-12 px-6 rounded-base hover:bg-muted text-muted-foreground text-xs font-semibold hover:text-foreground transition-all duration-200 flex items-center justify-center"
                        title="Pular esta etapa"
                    >
                        Pular
                    </button>
                    <button
                        onClick={nextStep}
                        className="h-12 px-10 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );

    // Step 4: Review
    const renderStep4 = () => (
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
                                <span className="text-xs text-muted-foreground font-semibold">Pretensão Salarial</span>
                                <p className="text-sm font-semibold text-foreground">
                                    {formData.pretension_min ? `R$ ${Number(formData.pretension_min).toLocaleString()}` : 'N/A'}
                                    {formData.pretension_max ? ` até R$ ${Number(formData.pretension_max).toLocaleString()}` : ''}
                                </p>
                            </div>
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
                    <button onClick={handleSubmit} className="group h-12 px-12 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40 flex items-center justify-center gap-4">
                        <span>Finalizar candidatura</span>
                        <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">send</span>
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
                            onClick={() => navigate(isTalentPool ? '/vagas' : `/vagas/${id}`)}
                            className="group flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-3 py-2"
                        >
                            <span className="material-symbols-outlined text-xl mr-2 transition-transform group-hover:-translate-x-1">keyboard_backspace</span>
                            {isTalentPool ? 'Voltar para Vagas' : 'Ver detalhes da vaga'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
                        {/* LEFT COLUMN: Form Application */}
                        <div className="lg:col-span-8 flex flex-col gap-10">
                            {/* Header Section */}
                            <div className="flex flex-col gap-3">
                                <h1 className="text-foreground text-3xl font-semibold tracking-tight transition-colors">
                                    {isTalentPool ? 'Candidatura Espontânea' : 'Candidatura simplificada'}
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium leading-relaxed flex items-center gap-2.5 transition-colors">
                                    <span className="material-symbols-outlined text-[20px] text-primary">{isTalentPool ? 'account_circle' : 'timer'}</span>
                                    <span>{isTalentPool ? 'Seu perfil no Banco de Talentos' : `Processo rápido para ${job?.title || 'vaga'}`} • Leva aprox. 3 min</span>
                                </p>
                            </div>

                            {/* Progress Indicator */}
                            <div className="rounded-lg bg-card p-8 border border-border transition-colors">
                                <div className="flex flex-col gap-5">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-muted-foreground">Etapa atual</p>
                                            <p className="text-foreground text-sm font-semibold transition-colors">
                                                {step}. {step === 1 ? 'Dados pessoais' : step === 2 ? 'Experiência' : step === 3 ? 'Diversidade' : 'Revisão final'}
                                            </p>
                                        </div>
                                        <p className="text-primary text-lg font-semibold tracking-tight">{Math.round((step / 4) * 100)}%</p>
                                    </div>
                                    <div className="rounded-full bg-muted h-2.5 w-full overflow-hidden transition-colors">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-700 ease-in-out"
                                            style={{ width: `${(step / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Forms */}
                            <div className="transition-all duration-300">
                                {step === 1 && renderStep1()}
                                {step === 2 && renderStep2()}
                                {step === 3 && renderStepDiversity()}
                                {step === 4 && renderStep4()}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Job Summary) */}
                        <div className="lg:col-span-4 flex flex-col gap-8 order-first lg:order-last">
                            {isLoading ? (
                                <JobSummarySkeleton />
                            ) : (
                                <div className="rounded-lg bg-card text-card-foreground border border-border sticky top-28 overflow-hidden transition-colors">
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
                                                    <p className="text-xs font-semibold text-muted-foreground">{job?.department} • {job?.location}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {[
                                                    { icon: 'location_on', label: `${job?.location} (${job?.model})` },
                                                    {
                                                        icon: 'payments',
                                                        label: formatSalaryRange(job?.salary_min, job?.salary_max)
                                                    },
                                                    { icon: 'schedule', label: 'Tempo integral' }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                                                        <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                                                        {item.label}
                                                    </div>
                                                ))}
                                                {job?.registration_deadline && (
                                                    <div className="flex items-center gap-4 text-xs font-semibold text-primary">
                                                        <span className="material-symbols-outlined text-primary text-[18px]">event</span>
                                                        Inscrições até {new Date(job.registration_deadline).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                                                <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-3">
                                                    {job?.context}
                                                </p>
                                                <Link to={isTalentPool ? '/vagas' : `/vagas/${id}`} className="text-xs font-semibold text-primary hover:text-primary/70 transition-all mt-4 inline-block underline underline-offset-4 decoration-primary/30">
                                                    {isTalentPool ? 'Ver vagas abertas' : 'Ver detalhes'}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};

export default JobApplication;
