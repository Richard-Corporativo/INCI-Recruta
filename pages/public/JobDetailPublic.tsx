import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { JobService } from '../../src/services/JobService';
import { Job } from '../../types';

// Robust benefit icon mapping
const BENEFIT_ICON_MAP: Record<string, string> = {
    // Health & Wellness
    'saúde': 'favorite',
    'plano de saúde': 'favorite',
    'assistência médica': 'favorite',
    'odontológico': 'dentistry',
    'plano odontológico': 'dentistry',

    // Food & Meal
    'alimentação': 'restaurant',
    'refeição': 'restaurant',
    'vale-refeição': 'restaurant',
    'vale-alimentação': 'restaurant',
    'vr': 'restaurant',
    'va': 'restaurant',

    // Transportation
    'transporte': 'directions_bus',
    'vale-transporte': 'directions_bus',
    'vt': 'directions_bus',

    // Fitness
    'gym': 'fitness_center',
    'academia': 'fitness_center',
    'gympass': 'fitness_center',
    'wellhub': 'fitness_center',

    // Remote & Flexibility
    'remoto': 'home_work',
    'home office': 'home_work',
    'auxílio home office': 'home_work',
    'híbrido': 'home_work',
    'trabalho remoto': 'home_work',

    // Time & Schedule
    'flexível': 'schedule',
    'horário flexível': 'schedule',
    'flexibilidade': 'schedule',

    // Education & Development
    'educação': 'school',
    'cursos': 'school',
    'treinamento': 'school',
    'desenvolvimento': 'school',

    // Default fallback
    'default': 'star'
};

const getBenefitIcon = (benefitText: string): string => {
    const normalized = benefitText.toLowerCase().trim();

    // Try exact match first
    if (BENEFIT_ICON_MAP[normalized]) {
        return BENEFIT_ICON_MAP[normalized];
    }

    // Try partial match
    for (const [key, icon] of Object.entries(BENEFIT_ICON_MAP)) {
        if (normalized.includes(key)) {
            return icon;
        }
    }

    // Fallback
    return BENEFIT_ICON_MAP['default'];
};

const JobDetailPublic: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            setIsLoading(true);
            const found = await JobService.getJobById(id);

            if (found) {
                // Map the simple Job type to the Rich Detail type for consistency
                setJob({
                    title: found.title,
                    location: found.location,
                    publishedAt: new Date(found.created_at).toLocaleDateString('pt-BR'),
                    model: found.model,
                    contract: found.contract,
                    level: found.seniority || 'Sênior',
                    area: found.department,
                    description: found.context || "",
                    mission: found.mission || "",
                    salary: {
                        min: found.salary_min,
                        max: found.salary_max
                    },
                    responsibilities: found.responsibilities
                        ? found.responsibilities.split('\n').map(r => r.replace(/^- /, ''))
                        : [],
                    requirements: found.requirements
                        ? found.requirements.split('\n').filter((r: string) => r.trim() !== '')
                        : [],
                    skills: [],
                    benefits: Array.isArray(found.benefits) && found.benefits.length > 0
                        ? found.benefits.map((b: string) => ({
                            icon: getBenefitIcon(b),
                            title: b,
                            color: "primary"
                        }))
                        : [],
                    areaDescription: `A área de ${found.department} é fundamental para o sucesso do nosso negócio.`,
                    registrationDeadline: found.registration_deadline,
                    // Dynamic stats (use actual data if available, otherwise hide)
                    candidatesCount: (found as any).candidates_count || null,
                    responseTime: (found as any).average_response_time || null,
                    steps: [
                        { number: 1, title: "Aplicação", active: true },
                        { number: 2, title: "Entrevista", active: false },
                        { number: 3, title: "Proposta", active: false }
                    ]
                });
            }
            setIsLoading(false);
        };

        fetchJob();
    }, [id]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
    if (!job) return <div className="h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Vaga não encontrada</h2>
        <button onClick={() => navigate('/vagas')} className="text-primary underline">Voltar para listagem</button>
    </div>;

    return (
        <main className="flex-grow w-full bg-slate-50 transition-all duration-300 antialiased">
            {/* Context Navigation */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
                    <nav className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                        <Link className="hover:text-primary transition-colors duration-200" to="/vagas">Vagas</Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-slate-900">{job.title}</span>
                    </nav>
                    <button
                        onClick={() => navigate('/vagas')}
                        className="flex items-center gap-2 text-primary hover:text-slate-900 transition-colors duration-200 text-xs font-semibold active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Voltar
                    </button>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 flex flex-col gap-16">

                        {/* Hero Header */}
                        <header className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-semibold border border-green-200 rounded-full">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                                    Vaga aberta recentemente
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-slate-900 max-w-4xl">
                                    {job.title}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white border border-slate-200 flex items-center justify-center text-primary rounded-lg">
                                        <span className="material-symbols-outlined text-2xl">location_on</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500">Localização</span>
                                        <span className="text-sm font-semibold text-slate-900">{job.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white border border-slate-200 flex items-center justify-center text-primary rounded-lg">
                                        <span className="material-symbols-outlined text-2xl">home_work</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500">Modalidade</span>
                                        <span className="text-sm font-semibold text-slate-900">{job.model}</span>
                                    </div>
                                </div>
                                {(job.salary?.min > 0 || job.salary?.max > 0) && (
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white border border-slate-200 flex items-center justify-center text-primary rounded-lg">
                                            <span className="material-symbols-outlined text-2xl">payments</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-semibold text-slate-500">Faixa Salarial</span>
                                            <span className="text-sm font-semibold text-slate-900">
                                                {job.salary.min > 0 ? `R$ ${job.salary.min}` : ''}
                                                {job.salary.min > 0 && job.salary.max > 0 ? ' - ' : ''}
                                                {job.salary.max > 0 ? `R$ ${job.salary.max}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white border border-slate-200 flex items-center justify-center text-primary rounded-lg">
                                        <span className="material-symbols-outlined text-2xl">calendar_today</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500">Publicado</span>
                                        <span className="text-sm font-semibold text-slate-900">{job.publishedAt}</span>
                                    </div>
                                </div>
                                {job.registrationDeadline && (
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white border border-slate-200 flex items-center justify-center text-primary rounded-lg">
                                            <span className="material-symbols-outlined text-2xl">event</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-semibold text-slate-500">Inscrições até</span>
                                            <span className="text-sm font-semibold text-slate-900">{new Date(job.registrationDeadline).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Info Badges */}
                            <div className="flex flex-wrap gap-2.5 pt-4">
                                {[job.contract, job.level, job.area].map((badge, idx) => (
                                    <span key={idx} className="px-5 h-10 flex items-center justify-center bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 rounded-lg">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </header>

                        <div className="h-px bg-slate-200 w-full"></div>

                        {/* Description & Responsibilities */}
                        <div className="grid grid-cols-1 gap-16">
                            <section className="space-y-6">
                                <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-3 justify-center sm:justify-start">
                                    Missão do Cargo
                                </h3>
                                <p className="text-slate-600 text-lg font-normal leading-relaxed max-w-prose">
                                    {job.mission}
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    Sobre a Oportunidade
                                </h3>
                                <p className="text-slate-600 text-base font-normal leading-relaxed max-w-prose">
                                    {job.description}
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    O que você vai fazer
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    {job.responsibilities.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 px-6 py-4 border border-slate-200 bg-white rounded-xl shadow-sm hover:border-primary/30 transition-all">
                                            <div className="size-2 bg-blue-700 rounded-full shrink-0"></div>
                                            <span className="text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    O que esperamos de você
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {job.requirements.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 px-6 py-4 border border-slate-200 bg-white rounded-xl shadow-sm hover:border-primary/30 transition-all">
                                            <span className="material-symbols-outlined text-blue-700 text-xl font-bold">check</span>
                                            <span className="text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Benefits */}
                        {job.benefits.length > 0 && (
                            <section className="space-y-6 pt-6">
                                <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50/50">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3 mb-6">
                                        Pacote de Vantagens
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {job.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl transition-colors shadow-sm hover:border-primary/30">
                                                <div className="size-10 bg-blue-50 text-blue-700 flex items-center justify-center rounded-lg shrink-0">
                                                    <span className="material-symbols-outlined text-xl">{benefit.icon}</span>
                                                </div>
                                                <span className="text-slate-900 text-sm font-semibold">{benefit.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Process Transparency */}
                        <section className="space-y-12 py-8">
                            <div className="text-center sm:text-left space-y-2">
                                <h3 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3 justify-center sm:justify-start">
                                    Jornada de Seleção
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">Transparência é um de nossos valores. Saiba o que esperar:</p>
                            </div>

                            <div className="relative flex flex-col md:flex-row items-start justify-between w-full max-w-4xl mx-auto gap-8 lg:gap-0">
                                <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-slate-200 -z-0" />
                                {job.steps.map((step, idx) => (
                                    <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-5 bg-slate-50 px-4 z-10 w-full md:w-auto">
                                        <div className={`size-12 flex items-center justify-center font-semibold text-sm border-2 rounded-full ${step.active ? 'bg-primary text-white border-primary' : 'bg-white text-slate-300 border-slate-200'}`}>
                                            {step.number}
                                        </div>
                                        <div className="flex flex-col items-start md:items-center">
                                            <span className={`text-[10px] font-semibold ${step.active ? 'text-primary' : 'text-slate-400'}`}>{step.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Sticky Action */}
                    <aside className="hidden lg:block lg:col-span-4 relative">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white text-slate-900 border border-slate-200 p-6 rounded-3xl overflow-hidden relative shadow-sm">
                                <div className="flex flex-col gap-6">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Candidatura</h3>
                                        <p className="text-slate-500 text-sm font-medium">Cadastre-se para aplicar nesta vaga.</p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => navigate(`/vagas/${id}/candidatar`)}
                                            className="group flex w-full items-center justify-center h-14 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 active:scale-95 gap-2 shadow-sm shadow-primary/20"
                                        >
                                            Candidatar agora
                                        </button>
                                        <button className="flex w-full items-center justify-center h-14 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold text-xs gap-2 active:scale-95">
                                            Compartilhar
                                        </button>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full"></div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-semibold">
                                            <span className="text-slate-400">Status</span>
                                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">Aberta</span>
                                        </div>
                                        {job.candidatesCount !== null && job.candidatesCount !== undefined && (
                                            <div className="flex justify-between items-center text-[10px] font-semibold">
                                                <span className="text-slate-400">Candidatos</span>
                                                <span className="text-slate-900">+{job.candidatesCount}</span>
                                            </div>
                                        )}
                                        {job.responseTime && (
                                            <div className="flex justify-between items-center text-[10px] font-semibold">
                                                <span className="text-slate-400">Resposta</span>
                                                <span className="text-slate-900">{job.responseTime}</span>
                                            </div>
                                        )}
                                        {job.registrationDeadline && (
                                            <div className="flex justify-between items-center text-[10px] font-semibold">
                                                <span className="text-slate-400">Prazo</span>
                                                <span className="text-primary">{new Date(job.registrationDeadline).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div >

            {/* Mobile Bottom Bar Sticky */}
            < div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-300 p-4 z-[60]" >
                <div className="flex gap-4 max-w-[1280px] mx-auto">
                    <button
                        onClick={() => navigate(`/vagas/${id}/candidatar`)}
                        className="flex-1 h-12 bg-primary text-white font-semibold text-sm rounded-lg transition-colors hover:bg-slate-900"
                    >
                        Candidatar agora
                    </button>
                    <button className="aspect-square h-12 flex items-center justify-center bg-white text-slate-900 border border-slate-300 rounded-lg transition-colors hover:bg-slate-50">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div >

            {/* Final Space for Mobile Button Margin */}
            < div className="h-28 lg:hidden" ></div >
        </main >
    );
};

export default JobDetailPublic;
