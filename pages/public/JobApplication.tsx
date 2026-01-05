import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { StorageService, KEYS } from '../../lib/storage';
import { Job, Candidate } from '../../types';


const JobApplication: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [job, setJob] = useState<Job | null>(null);

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
        resume: null as File | null
    });

    useEffect(() => {
        const allJobs = StorageService.get<Job[]>(KEYS.JOBS) || [];
        const found = allJobs.find(j => j.id.toString() === id);
        if (found) setJob(found);
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];

        const newCandidate: Candidate = {
            id: Math.random().toString(36).substring(7),
            jobId: id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location: formData.city,
            time: new Date().toISOString(),
            applied_at: new Date().toLocaleDateString('pt-BR'),
            columnId: 'received',
            initials: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2),
            avatarColor: 'bg-primary',
            textColor: 'text-white'
        };

        StorageService.set(KEYS.CANDIDATES, [...allCandidates, newCandidate]);

        // Mock session for candidate
        localStorage.setItem('recruitSys_candidate_email', formData.email);

        alert('Candidatura enviada com sucesso!');
        navigate('/candidate/dashboard');
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
                    <div className="group relative border-2 border-dashed border-border rounded-xl p-12 text-center transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 cursor-pointer">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf" />
                        <div className="flex flex-col items-center gap-4">
                            <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold text-foreground">Clique para fazer upload ou arraste o arquivo</p>
                                <p className="text-xs text-muted-foreground font-medium">Somente arquivos PDF • Máx. 10MB</p>
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
                <button
                    onClick={nextStep}
                    className="h-12 px-10 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto active:scale-95 border border-border/40"
                >
                    Continuar candidatura
                </button>
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
                                                {step}. {step === 1 ? 'Dados pessoais' : step === 2 ? 'Experiência' : 'Revisão final'}
                                            </p>
                                        </div>
                                        <p className="text-primary text-lg font-semibold tracking-tight">{Math.round((step / 3) * 100)}%</p>
                                    </div>
                                    <div className="rounded-full bg-muted h-2.5 w-full overflow-hidden transition-colors">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-700 ease-in-out"
                                            style={{ width: `${(step / 3) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Forms */}
                            <div className="transition-all duration-300">
                                {step === 1 && renderStep1()}
                                {step === 2 && renderStep2()}
                                {step === 3 && renderStep3()}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Job Summary) */}
                        <div className="lg:col-span-4 flex flex-col gap-8 order-first lg:order-last">
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
                                                { icon: 'payments', label: `R$ ${job?.salary_min} - R$ ${job?.salary_max}` },
                                                { icon: 'schedule', label: 'Tempo integral' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                                                    <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-3">
                                                {job?.context}
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
