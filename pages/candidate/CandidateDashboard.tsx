import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidateData } from '../../hooks/useCandidateData';
import { Skeleton } from '../../components/atoms/Skeleton/Skeleton';
import { useToast } from '../../components/ui/Toast';

const CandidateDashboard: React.FC = () => {
    const { currentCandidate, isLoading, completeness } = useCandidateData();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (currentCandidate) {
            setFormData({
                name: currentCandidate.name,
                role: currentCandidate.role || 'Candidato',
                location: currentCandidate.location,
                email: currentCandidate.email,
                phone: currentCandidate.phone,
                summary: currentCandidate.summary || '',
                linkedin: currentCandidate.linkedin || '',
                github: currentCandidate.github || '',
                portfolio: currentCandidate.portfolio || '',
                resumeName: currentCandidate.resumeName || 'Clique para anexar curriculo',
                avatar: currentCandidate.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                lastUpdate: currentCandidate.applied_at || 'Recente',
                pretension_min: currentCandidate.pretension_min,
                pretension_max: currentCandidate.pretension_max,
                availability: currentCandidate.availability
            });
        }
    }, [currentCandidate]);


    const renderSkeletons = () => (
        <div className="flex flex-col gap-12 pb-24 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-12 w-40" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                        <div className="p-10 md:p-14 border-b border-border flex flex-col sm:flex-row items-center sm:items-start gap-10">
                            <Skeleton className="size-32 rounded-3xl shrink-0" />
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 pt-4 flex-1">
                                <Skeleton className="h-10 w-64" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                        <div className="p-10 md:p-14 grid grid-cols-1 sm:grid-cols-2 gap-10 bg-muted/10">
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                </div>
            </div>
        </div>
    );

    if (isLoading || !formData) return <div className="p-12">{renderSkeletons()}</div>;


    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-12 pb-24">
            {/* Page Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-primary">Painel de controle</p>
                    <h1 className="text-3xl font-semibold text-foreground">Meu perfil</h1>
                    <p className="text-muted-foreground text-sm font-medium">Veja como seu perfil aparece para os recrutadores da rede.</p>
                </div>
                <button
                    onClick={() => navigate('/candidate/settings')}
                    className="h-12 px-8 flex items-center justify-center gap-3 rounded-base bg-foreground text-background text-xs font-semibold hover:bg-foreground/80 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                    <span>Editar perfil</span>
                </button>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                {/* Left Column: Profile Card & Summary */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    {/* Personal Data Card */}
                    <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors shadow-sm">
                        {/* Header Profile */}
                        <div className="p-10 md:p-14 border-b border-border flex flex-col sm:flex-row items-center sm:items-start gap-10">
                            <div className="size-32 rounded-3xl bg-cover bg-center shrink-0 border-8 border-background bg-muted overflow-hidden transition-transform hover:scale-105 duration-500" style={{ backgroundImage: `url('${formData.avatar}')` }}></div>
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 pt-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-3xl font-semibold text-foreground leading-tight">{formData.name}</h3>
                                    <p className="text-primary font-semibold text-sm">{formData.role}</p>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                                    <span className="material-symbols-outlined text-[16px] text-primary">location_pin</span>
                                    <span>{formData.location}</span>
                                </div>
                            </div>
                        </div>
                        {/* Details Grid */}
                        <div className="p-10 md:p-14 grid grid-cols-1 sm:grid-cols-2 gap-10 bg-muted/10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold text-muted-foreground/60">Canal de e-mail</span>
                                <p className="text-sm font-semibold text-foreground truncate">{formData.email}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold text-muted-foreground/60">Contato telefônico</span>
                                <p className="text-sm font-semibold text-foreground">{formData.phone}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold text-muted-foreground/60">Endereço atual</span>
                                <p className="text-sm font-semibold text-foreground">{formData.location}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold text-muted-foreground/60">Sincronizado em</span>
                                <p className="text-sm font-semibold text-foreground">{formData.lastUpdate}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold text-muted-foreground/60 text-emerald-600 uppercase tracking-wider">Pretensão Salarial</span>
                                <p className="text-sm font-bold text-foreground">
                                    {formData.pretension_min ? `R$ ${formData.pretension_min.toLocaleString()}` : 'Não informada'}
                                    {formData.pretension_max ? ` até R$ ${formData.pretension_max.toLocaleString()}` : ''}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold text-muted-foreground/60 text-amber-600 uppercase tracking-wider">Disponibilidade</span>
                                <p className="text-sm font-bold text-foreground">{formData.availability || 'Não informada'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-10 md:p-12 shadow-sm">
                        <h4 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary text-[28px]">article</span>
                            Trajetória profissional
                        </h4>
                        <p className="text-muted-foreground leading-relaxed text-sm font-medium whitespace-pre-wrap">
                            {formData.summary || 'Nenhuma biografia informada ainda. Clique em editar para adicionar.'}
                        </p>
                    </div>

                    {/* Resume Section */}
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-10 md:p-12 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                            <h4 className="text-xl font-semibold text-foreground flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-[28px]">folder_special</span>
                                Arquivo de currículo
                            </h4>
                            <span className="h-7 items-center justify-center px-4 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 flex">
                                <span className="size-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                                Documento ativo
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-muted/10 group hover:border-ring transition-all duration-300">
                            <div className="flex items-center gap-5">
                                <div className="size-14 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center group-hover:bg-destructive group-hover:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{formData.resumeName}</p>
                                    <p className="text-xs font-semibold text-muted-foreground">PDF • 1.2 MB</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column: Links & Stats */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    {/* Profile Completeness */}
                    <div className="bg-primary text-primary-foreground rounded-lg p-10 relative overflow-hidden group shadow-lg shadow-primary/20">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:translate-x-4">
                            <span className="material-symbols-outlined text-[120px]">leaderboard</span>
                        </div>
                        <div className="relative z-10 flex flex-col gap-6">
                            <p className="text-xs font-semibold text-primary-foreground/70">Força do perfil</p>
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-bold leading-none">{completeness}%</span>
                                <span className="text-xs font-semibold opacity-80 pb-1">Concluído</span>
                            </div>
                            <div className="w-full bg-primary-foreground/20 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-white h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${completeness}%` }}></div>
                            </div>
                            <p className="text-xs font-medium leading-relaxed opacity-70">
                                {completeness < 100
                                    ? 'Complete todas as informações para ganhar 3x mais destaque nas buscas.'
                                    : 'Parabéns! Seu perfil está completo e pronto para os recrutadores.'}
                            </p>
                            {completeness < 100 && (
                                <button
                                    onClick={() => navigate('/candidate/settings')}
                                    className="h-11 mt-2 flex items-center justify-center rounded-base bg-white text-primary text-xs font-semibold hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-black/10"
                                >
                                    Completar agora
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Professional Links */}
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-10 shadow-sm">
                        <h4 className="text-sm font-semibold text-foreground mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[20px]">share_reviews</span>
                            Presença digital
                        </h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { name: 'LinkedIn', icon: 'work', value: formData.linkedin, color: 'bg-primary/10 text-primary' },
                                { name: 'GitHub', icon: 'terminal', value: formData.github, color: 'bg-foreground/5 text-foreground' },
                                { name: 'Portfólio', icon: 'language', value: formData.portfolio, color: 'bg-primary/10 text-primary' }
                            ].map((link, idx) => (
                                <a key={idx} className="flex items-center gap-5 p-5 rounded-xl border border-border bg-muted/5 group hover:border-ring transition-all duration-300 hover:shadow-sm active:scale-[0.98] outline-none" href={link.value ? (link.value.startsWith('http') ? link.value : `https://${link.value}`) : '#'} target={link.value ? "_blank" : "_self"} rel="noopener noreferrer">
                                    <div className={`size-10 rounded-lg flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                                    </div>
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <span className="text-xs font-semibold text-foreground">{link.name}</span>
                                        <span className="text-xs font-medium text-muted-foreground truncate opacity-70 group-hover:text-primary transition-colors">{link.value || 'Não informado'}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
