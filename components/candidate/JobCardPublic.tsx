import React from 'react';
import { Bookmark, MapPin, FileText, Briefcase } from 'lucide-react';

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
}

interface JobCardPublicProps {
    job: PublicJob;
    onApply: (id: string) => void;
    onDetails: (id: string) => void;
}

const JobCardPublic: React.FC<JobCardPublicProps> = ({ job, onApply, onDetails }) => {
    return (
        <article className="group flex flex-col md:flex-row gap-5 p-5 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {job.title}
                            </h3>
                            {job.isUrgent && (
                                <span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Urgente
                                </span>
                            )}
                            {job.isNew && (
                                <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Novo
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {job.department}
                        </p>
                    </div>
                    <button aria-label="Salvar vaga" className="text-gray-400 hover:text-primary transition-colors p-1">
                        <Bookmark size={20} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5" title="Localização">
                        <MapPin size={18} className="text-gray-400" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Tipo de Contrato">
                        <FileText size={18} className="text-gray-400" />
                        <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Senioridade">
                        <Briefcase size={18} className="text-gray-400" />
                        <span>{job.level}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    {job.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 text-xs font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex md:flex-col gap-3 mt-2 md:mt-0 md:min-w-[140px] md:justify-center border-t md:border-t-0 md:border-l border-border-light dark:border-border-dark pt-4 md:pt-0 md:pl-5">
                <button
                    onClick={() => onApply(job.id)}
                    className="flex-1 md:flex-none justify-center items-center h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Candidatar-se
                </button>
                <button
                    onClick={() => onDetails(job.id)}
                    className="flex-1 md:flex-none justify-center items-center h-10 px-4 rounded-lg border border-border-light dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-transparent"
                >
                    Ver detalhes
                </button>
            </div>
        </article>
    );
};

export default JobCardPublic;
