import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { JobService } from '../../src/services/JobService';
import { Job } from '../../types';
import { AVAILABLE_BENEFITS } from '../../components/BenefitsSelector';
import { useAuth } from '../../hooks/useAuth';
import { useCandidateData } from '../../hooks/useCandidateData';
import { useToast } from '../../components/ui/Toast';

const JobDetailPublic: React.FC = () => {
    const { user: authUser } = useAuth();
    const { myApplications, isLoading: isDataLoading, withdrawApplication } = useCandidateData();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const hasApplied = useMemo(() =>
        myApplications.some(app => app.jobId?.toString() === id?.toString()),
        [myApplications, id]
    );

    const application = useMemo(() =>
        myApplications.find(app => app.jobId?.toString() === id?.toString()),
        [myApplications, id]
    );

    const handleWithdraw = async () => {
        if (!application?.id) return;
        setIsWithdrawing(true);

        // Trigger mutation
        const p = withdrawApplication(application.id);

        // Optimistic feedback
        setTimeout(() => {
            success('Candidatura removida com sucesso!');
            setShowWithdrawModal(false);
            setIsWithdrawing(false);
        }, 600);

        try {
            await p;
        } catch (err) {
            toastError('Erro ao processar sua solicitação no servidor.');
            setIsWithdrawing(false);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            setIsLoading(true);
            const found = await JobService.getJobById(id);

            if (found) {
                const createdAt = new Date(found.created_at);
                const now = new Date();
                const diffDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

                setJob({
                    id: found.id,
                    title: found.title,
                    location: `${found.location} - ${found.model}`, // Combined for standard display
                    pureLocation: found.location,
                    model: found.model,
                    publishedAt: createdAt.toLocaleDateString('pt-BR'),
                    isNew: diffDays <= 7,
                    contract: found.contract,
                    level: found.seniority || 'Sênior',
                    area: found.department,
                    status: found.status,
                    candidatesCount: found.candidates_count || 0,
                    description: found.context || found.mission || "Descrição detalhada em breve.",
                    responsibilities: (found.responsibilities || "")
                        .split(/\n|;/)
                        .map(r => r.trim().replace(/^- /, ''))
                        .filter(r => r.length > 0),
                    requirements: (found.requirements || "")
                        .split(/\n|;/)
                        .map(r => r.trim().replace(/^- /, ''))
                        .filter(r => r.length > 0),
                    benefits: (found.benefits || []).map((bLabel: string) => {
                        const def = AVAILABLE_BENEFITS.find(b => b.label === bLabel);
                        return {
                            icon: def?.icon || 'star',
                            title: bLabel,
                        };
                    }),
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
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white border border-slate-200 flex items-center justify-center text-primary rounded-lg">
                                        <span className="material-symbols-outlined text-2xl">calendar_today</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500">Publicado</span>
                                        <span className="text-sm font-semibold text-slate-900">{job.publishedAt}</span>
                                    </div>
                                </div>
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
                                    Sobre a Oportunidade
                                </h3>
                                <p className="text-slate-600 text-lg font-normal leading-relaxed max-w-prose">
                                    {job.description}
                                </p>
                            </section>

                            <section className="space-y-8">
                                <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-3 justify-center sm:justify-start">
                                    O que você vai fazer
                                </h3>
                                <ul className="grid grid-cols-1 gap-4">
                                    {job.responsibilities.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 p-5 border border-slate-200 bg-white rounded-2xl">
                                            <span className="size-2 bg-primary mt-2 shrink-0 rounded-full" />
                                            <span className="text-base text-slate-600 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-8">
                                <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-3 justify-center sm:justify-start">
                                    O que esperamos de você
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {job.requirements.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-6 border border-slate-200 bg-white rounded-2xl">
                                            <span className="material-symbols-outlined text-primary/60 text-2xl">check</span>
                                            <span className="text-sm text-slate-900 font-semibold leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Benefits */}
                        <section className="space-y-8 p-8 bg-slate-50 border border-slate-200 rounded-3xl">
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
                                Pacote de Vantagens
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl transition-colors hover:border-primary/50">
                                        <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
                                            <span className="material-symbols-outlined text-xl">{benefit.icon}</span>
                                        </div>
                                        <span className="text-slate-900 text-xs font-semibold">{benefit.title}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

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
                                        {hasApplied ? (
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={() => navigate(`/candidate/applications/${application?.id}`)}
                                                    className="w-full h-14 flex items-center justify-center gap-2 rounded-base bg-green-600 text-white text-[11px] font-semibold hover:bg-green-700 transition-all duration-200 outline-none active:scale-95 shadow-lg shadow-green-100"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    Ver minha candidatura
                                                </button>
                                                <button
                                                    onClick={() => setShowWithdrawModal(true)}
                                                    disabled={isWithdrawing}
                                                    className="w-full h-12 flex items-center justify-center gap-2 rounded-base border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white text-[11px] font-semibold transition-all duration-200 outline-none active:scale-95 disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                                                    {isWithdrawing ? 'Processando...' : 'Desistir da vaga'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => navigate(`/vagas/${id}/candidatar`)}
                                                className="group flex w-full items-center justify-center h-14 bg-primary text-white text-sm font-semibold rounded-base hover:bg-primary/90 transition-all duration-200 active:scale-95 gap-2 shadow-sm shadow-primary/20"
                                            >
                                                Candidatar agora
                                            </button>
                                        )}
                                        <button className="flex w-full items-center justify-center h-14 bg-white text-slate-700 border border-slate-200 rounded-base hover:bg-slate-50 transition-all duration-200 font-semibold text-xs gap-2 active:scale-95">
                                            Compartilhar
                                        </button>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full"></div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-semibold">
                                            <span className="text-slate-400">Status</span>
                                            <span className={`${job.status === 'Encerrada' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'} px-2 py-1 rounded-md capitalize`}>
                                                {job.status === 'Ativa' ? 'Aberta' : job.status || 'Aberta'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-semibold">
                                            <span className="text-slate-400">Candidatos</span>
                                            <span className="text-slate-900">{job.candidatesCount > 50 ? `+${job.candidatesCount}` : job.candidatesCount || 'Poucos'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-semibold">
                                            <span className="text-slate-400">Resposta</span>
                                            <span className="text-slate-900">~ {job.level === 'Estágio' ? '48h' : '5 dias'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile Bottom Bar Sticky */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-300 p-4 z-[60]">
                <div className="flex gap-4 max-w-[1280px] mx-auto">
                    {hasApplied ? (
                        <div className="flex-1 flex gap-2">
                            <button
                                onClick={() => navigate(`/candidate/applications/${application?.id}`)}
                                className="flex-1 h-12 bg-green-600 text-white font-semibold text-[11px] rounded-lg transition-colors hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                Ver minha candidatura
                            </button>
                            <button
                                onClick={() => setShowWithdrawModal(true)}
                                disabled={isWithdrawing}
                                className="size-12 flex items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all duration-200 outline-none active:scale-95 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate(`/vagas/${id}/candidatar`)}
                            className="flex-1 h-12 bg-primary text-white font-semibold text-sm rounded-lg transition-colors hover:bg-slate-900"
                        >
                            Candidatar agora
                        </button>
                    )}
                    <button className="aspect-square h-12 flex items-center justify-center bg-white text-slate-900 border border-slate-300 rounded-lg transition-colors hover:bg-slate-50">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Final Space for Mobile Button Margin */}
            <div className="h-28 lg:hidden"></div>

            {/* Modal de Desistência */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-2xl p-10 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center text-center gap-6">
                            <div className="size-20 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl">warning</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h3 className="text-2xl font-semibold text-foreground">Confirmar desistência?</h3>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                    Essa ação é irreversível. Você não poderá reverter sua candidatura para esta vaga após confirmar.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    disabled={isWithdrawing}
                                    className="h-12 rounded-base border border-border bg-background text-foreground text-[10px] font-semibold hover:bg-accent transition-all outline-none active:scale-95 disabled:opacity-50"
                                >
                                    Manter candidatura
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing}
                                    className="h-12 rounded-base bg-destructive text-destructive-foreground text-[10px] font-semibold hover:bg-destructive/90 transition-all outline-none active:scale-95 shadow-lg shadow-destructive/10 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isWithdrawing ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Processando...</span>
                                        </>
                                    ) : (
                                        'Confirmar desistência'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default JobDetailPublic;
