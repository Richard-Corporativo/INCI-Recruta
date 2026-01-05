import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService, KEYS } from '../../lib/storage';
import { Candidate, Job } from '../../types';

const ApplicationDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDesistirModal, setShowDesistirModal] = useState(false);
    const [app, setApp] = useState<Candidate | null>(null);
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const foundApp = allCandidates.find(c => c.id === id);

        if (foundApp) {
            setApp(foundApp);
            const allJobs = StorageService.get<Job[]>(KEYS.JOBS) || [];
            const foundJob = allJobs.find(j => j.id.toString() === foundApp.jobId?.toString());
            if (foundJob) setJob(foundJob);
        }
        setIsLoading(false);
    }, [id]);

    const statusConfig: any = {
        'received': { label: 'Recebido', icon: 'check_circle', index: 0 },
        'screening': { label: 'Triagem', icon: 'search', index: 1 },
        'technical': { label: 'Avaliação Técnica', icon: 'code', index: 2 },
        'hr_interview': { label: 'Entrevista RH', icon: 'chat', index: 3 },
        'manager_interview': { label: 'Entrevista Gestor', icon: 'person', index: 4 },
        'finalist': { label: 'Finalista', icon: 'star', index: 5 },
        'hired': { label: 'Contratado!', icon: 'celebration', index: 6 },
        'rejected': { label: 'Encerrado', icon: 'cancel', index: -1 }
    };

    const currentStatus = statusConfig[app?.columnId || 'received'] || statusConfig['received'];

    const steps = [
        {
            name: 'Candidatura',
            status: currentStatus.index >= 0 ? 'completed' : 'upcoming',
            desc: 'Sua candidatura foi recebida com sucesso pela nossa equipe.'
        },
        {
            name: 'Triagem inicial',
            status: currentStatus.index > 1 ? 'completed' : currentStatus.index === 1 ? 'current' : 'upcoming',
            desc: 'Análise do perfil e experiências.'
        },
        {
            name: 'Entrevistas / Testes',
            status: currentStatus.index > 4 ? 'completed' : (currentStatus.index >= 2 && currentStatus.index <= 4) ? 'current' : 'upcoming',
            desc: 'Etapa de avaliação técnica e entrevistas com RH e Gestores.'
        },
        {
            name: 'Proposta final',
            status: currentStatus.index >= 6 ? 'completed' : currentStatus.index === 5 ? 'current' : 'upcoming',
            desc: 'Última etapa do processo com detalhes da contratação.'
        }
    ];

    if (isLoading) return <div className="p-12 text-center text-xs font-semibold">Carregando detalhes...</div>;
    if (!app) return <div className="p-12 text-center text-xs font-semibold">Candidatura não encontrada.</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 pb-20">
            {/* Header & Back Link */}
            <div className="flex flex-col gap-6">
                <button
                    onClick={() => navigate('/candidate/applications')}
                    className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors outline-none"
                >
                    <span className="material-symbols-outlined text-lg">west</span>
                    Voltar para minhas candidaturas
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-card p-10 md:p-14 rounded-lg border border-border">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <span className="h-7 px-3 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center border border-primary/20">
                                Candidatura ativa
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground">Ref: {app.jobId}</span>
                        </div>
                        <h1 className="text-3xl font-semibold text-foreground">{job?.title || 'Vaga'}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">apartment</span>
                                INCI Brasil
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                                {job?.location} ({job?.model})
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                                Aplicado em {app.applied_at || 'Recente'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Timeline */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-10 md:p-14">
                        <div className="flex flex-col gap-2 mb-12">
                            <p className="text-xs font-semibold text-primary">Próxima etapa: Entrevista</p>
                            <h3 className="text-2xl font-semibold text-foreground">Progresso da candidatura</h3>
                        </div>

                        <div className="relative flex flex-col gap-14 ml-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-border/50"></div>

                            {steps.map((step, idx) => (
                                <div key={idx} className="relative pl-12">
                                    {/* Step Marker */}
                                    <div className={`absolute left-0 top-1.5 size-2 rounded-full z-10 ${step.status === 'completed' ? 'bg-primary ring-4 ring-primary/20' :
                                        step.status === 'current' ? 'bg-primary animate-pulse ring-8 ring-primary/10' :
                                            'bg-muted-foreground/30'
                                        }`}></div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <h4 className={`text-lg font-semibold ${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {step.name}
                                            </h4>
                                            <span className={`text-[10px] font-semibold ${step.status === 'upcoming' ? 'text-muted-foreground/40' : 'text-primary'}`}>
                                                {step.status === 'completed' ? 'Finalizado' : step.status === 'current' ? 'Em andamento' : 'Pendente'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-2xl">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Status Summary Card */}
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-10 flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-semibold text-muted-foreground">Status atual</p>
                            <div className="text-2xl font-semibold text-primary">{currentStatus.label}</div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                Seu perfil está sendo avaliado. Mantenha seus dados de contato atualizados para não perder comunicados importantes.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border mt-2">
                            <button
                                onClick={() => setShowDesistirModal(true)}
                                className="w-full h-12 flex items-center justify-center gap-2 rounded-base border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white text-[11px] font-semibold transition-all duration-200 outline-none active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Desistir da vaga
                            </button>
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="bg-foreground text-background rounded-lg p-10 flex flex-col gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                            <span className="material-symbols-outlined text-[80px]">support_agent</span>
                        </div>
                        <div className="relative z-10 flex flex-col gap-6">
                            <h4 className="text-xl font-semibold">Precisa de ajuda?</h4>
                            <p className="text-[11px] font-medium opacity-70 leading-relaxed">
                                Ficou com alguma dúvida sobre o processo ou o agendamento? Nossa equipe de suporte está pronta para te auxiliar.
                            </p>
                            <button className="h-11 flex items-center justify-center gap-2 rounded-base bg-white text-foreground text-[10px] font-semibold hover:bg-white/90 transition-all outline-none">
                                Central de ajuda
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Desistência */}
            {showDesistirModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
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
                                    onClick={() => setShowDesistirModal(false)}
                                    className="h-12 rounded-base border border-border bg-background text-foreground text-[10px] font-semibold hover:bg-accent transition-all outline-none active:scale-95"
                                >
                                    Manter candidatura
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDesistirModal(false);
                                        navigate('/candidate/applications');
                                    }}
                                    className="h-12 rounded-base bg-destructive text-destructive-foreground text-[10px] font-semibold hover:bg-destructive/90 transition-all outline-none active:scale-95 shadow-lg shadow-destructive/10"
                                >
                                    Confirmar desistência
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetail;
