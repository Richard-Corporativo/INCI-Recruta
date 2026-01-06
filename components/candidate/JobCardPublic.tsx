import React from 'react';

export interface PublicJob {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    level: string;
    tags: string[];
    isNew?: boolean;
    isUrgent?: boolean;
    createdAt?: string;
}

interface JobCardPublicProps {
    job: PublicJob;
    onApply: (id: string) => void;
    onDetails: (id: string) => void;
}

const JobCardPublic: React.FC<JobCardPublicProps> = ({ job, onApply, onDetails }) => {
    return (
        <article className="group relative flex flex-col md:flex-row gap-8 p-8 bg-card text-card-foreground rounded-lg border border-border shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            {/* Visual Indicator for New/Urgent */}
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                        {job.isUrgent && (
                            <span className="bg-destructive/10 text-destructive border border-destructive/20 text-xs font-semibold px-2.5 py-1 rounded-md">
                                Urgente
                            </span>
                        )}
                        {job.isNew && (
                            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-transparent text-xs font-semibold px-2.5 py-1 rounded-md">
                                Nova vaga
                            </span>
                        )}
                        {/* Area tag moved here for better hierarchy */}
                        <span className="text-sm font-semibold text-primary">
                            {job.department}
                        </span>
                    </div>

                    {/* Primary Title */}
                    <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {job.title}
                    </h3>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2" title="Localização">
                        <span className="material-symbols-outlined text-[20px] text-muted-foreground/70">location_on</span>
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Tipo de Contrato">
                        <span className="material-symbols-outlined text-[20px] text-muted-foreground/70">description</span>
                        <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Senioridade">
                        <span className="material-symbols-outlined text-[20px] text-muted-foreground/70">work_history</span>
                        <span>{job.level}</span>
                    </div>
                </div>

                {/* Tags for Context */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {job.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-md bg-muted text-muted-foreground border border-border text-xs font-semibold transition-colors group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Actions Area */}
            <div className="flex md:flex-col gap-4 min-w-[180px] md:justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                <button
                    onClick={() => onApply(job.id)}
                    className="flex-1 md:flex-none justify-center items-center h-12 px-6 rounded-base bg-primary text-primary-foreground text-sm font-semibold transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 whitespace-nowrap text-xs"
                >
                    Candidatar-se agora
                </button>
                <button
                    onClick={() => onDetails(job.id)}
                    className="flex-1 md:flex-none justify-center items-center h-12 px-6 rounded-base border border-border bg-card text-card-foreground text-sm font-semibold transition-all hover:bg-muted hover:border-ring active:scale-95 text-xs"
                >
                    Ver detalhes
                </button>

            </div>
        </article>
    );
};

export default JobCardPublic;
