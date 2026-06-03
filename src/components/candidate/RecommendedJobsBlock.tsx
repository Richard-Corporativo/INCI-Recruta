'use client';

// @component RecommendedJobsBlock | @tipo component | @versao 1.0.0
// > Bloco "Vagas recomendadas para você" — exibe as 3 vagas com maior match_score
// @props recommendations, isLoading, isFallback, hasEnoughProfile, onJobClick
// @rule Nunca exibe vagas já candidatadas (garantido pela RPC)
// @rule Exibe match_score e match_reasons de forma auditável

import React from 'react';
import { Icon } from '@iconify/react';
import { RecommendedJob } from '@src/services/recommendation.service';
import { formatDate, isExpiredDate, formatSalaryRange, formatJobId } from '@src/lib/formatters';

const urgencyConfig: Record<string, { label: string; color: string; dot: string }> = {
    'Alta': { label: 'Urgente', color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500' },
    'Média': { label: 'Média', color: 'text-amber-600 bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
    'Baixa': { label: 'Normal', color: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' },
};

const modelIcon: Record<string, string> = {
    'Remoto': 'material-symbols:home-work',
    'Híbrido': 'material-symbols:sync-alt',
    'Presencial': 'material-symbols:location-city',
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const RecommendationSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-muted/50 rounded-xl border border-border" />
        ))}
    </div>
);

// ── Card individual ────────────────────────────────────────────────────────────
interface RecommendedJobCardProps {
    job: RecommendedJob;
    onClick: (id: string) => void;
}

const RecommendedJobCard: React.FC<RecommendedJobCardProps> = ({
    job, onClick,
}) => {
    const urg = urgencyConfig[job.urgency] ?? urgencyConfig['Baixa'];
    const mIcon = modelIcon[job.model] ?? 'material-symbols:work';
    const deadlineStr = job.registration_deadline
        ? formatDate(job.registration_deadline, { day: '2-digit', month: 'short' })
        : null;
    const isExpired = isExpiredDate(job.registration_deadline);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onClick(job.job_id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(job.job_id);
                }
            }}
            className="w-full text-left group relative bg-card border border-border rounded-2xl p-4 flex items-start gap-4 transition-all duration-200 hover:border-primary/40 active:scale-[0.99] cursor-pointer"
        >
            {/* Favorite Button */}
            <button 
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white border border-border text-muted hover:text-primary transition-all duration-300 group/fav shadow-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    // Fav logic here
                }}
                title="Favoritar vaga"
            >
                <Icon icon="ph:star-fill" className="size-4 transition-transform group-hover/fav:scale-110" />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
                            {job.department || 'Área não informada'}
                        </p>
                        {job.job_number && (
                            <span className="text-[9px] font-semibold text-muted-foreground/50 tracking-widest shrink-0">
                                {formatJobId(job.job_number)}
                            </span>
                        )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {job.title}
                    </h3>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Icon icon="material-symbols:location-on" className="size-3" />
                        {job.location || 'Não informada'}
                    </span>
                    <span className="size-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Icon icon={mIcon} className="size-3" />
                        {job.model}
                    </span>
                    <span className={`
                        ml-auto flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 
                        rounded-full border ${urg.color}
                    `}>
                        <span className={`size-1.5 rounded-full ${urg.dot}`} />
                        {urg.label}
                    </span>
                </div>

                {/* Salário + prazo */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-foreground">
                        {formatSalaryRange(job.salary_min, job.salary_max)}
                    </span>
                    {deadlineStr && (
                        <span className={`text-[9px] font-semibold ${isExpired ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {isExpired ? 'Encerrado' : `até ${deadlineStr}`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Bloco principal (export) ──────────────────────────────────────────────────

interface RecommendedJobsBlockProps {
    recommendations: RecommendedJob[];
    isLoading: boolean;
    isAuthenticated: boolean;
    onJobClick: (jobId: string) => void;
}

const RecommendedJobsBlock: React.FC<RecommendedJobsBlockProps> = ({
    recommendations,
    isLoading,
    isAuthenticated,
    onJobClick,
}) => {
    if (!isAuthenticated) return null;

    return (
        <section className="space-y-3">
            {isLoading ? (
                <RecommendationSkeleton />
            ) : recommendations.length > 0 && (
                <>
                    <h2 className="text-sm font-semibold text-foreground">Vagas recomendadas para você</h2>
                    <div className="space-y-3">
                        {recommendations.map((job) => (
                            <RecommendedJobCard
                                key={job.job_id}
                                job={job}
                                onClick={onJobClick}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default RecommendedJobsBlock;
