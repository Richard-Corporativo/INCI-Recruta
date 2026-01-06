import React, { useState } from 'react';
import { Job } from '../types';
import { useNavigate } from 'react-router-dom';

interface JobDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
    onDelete: (id: string | number) => void;
    managerName?: string;
}

const JobDetailsDrawer: React.FC<JobDetailsDrawerProps> = ({
    isOpen,
    onClose,
    job,
    onDelete,
    managerName
}) => {
    const navigate = useNavigate();

    if (!isOpen || !job) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm transition-opacity duration-200 ease-in-out"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[600px] bg-card shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 ease-in-out border-l border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="fixed-header p-8 border-b border-border bg-card shrink-0 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${job.status === 'Ativa' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-muted-foreground bg-muted border-border'}`}>
                                    {job.status}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${job.urgency === 'Alta' ? 'text-destructive bg-destructive/10 border-destructive/20' : 'text-primary bg-primary/10 border-primary/20'}`}>
                                    {job.urgency} Urgência
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mt-2">{job.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <span className="material-symbols-outlined text-[18px]">domain</span>
                                {job.department}
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mx-1"></span>
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                {job.location}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 outline-none"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-muted/10 custom-scrollbar p-8">
                    <div className="flex flex-col gap-8">

                        {/* Stats/Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground font-semibold">Modelo de Trabalho</span>
                                <p className="text-sm font-bold text-foreground mt-1">{job.model}</p>
                            </div>
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground font-semibold">Regime Contratual</span>
                                <p className="text-sm font-bold text-foreground mt-1">{job.contract}</p>
                            </div>
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground font-semibold">Salário</span>
                                <p className="text-sm font-bold text-foreground mt-1">
                                    {(job.salary_min / 1000).toFixed(1)}k - {(job.salary_max / 1000).toFixed(1)}k <span className="text-xs font-normal text-muted-foreground">/mês</span>
                                </p>
                            </div>
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground font-semibold">Gestor Responsável</span>
                                <p className="text-sm font-bold text-foreground mt-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">person</span>
                                    {managerName || 'Sistema'}
                                </p>
                            </div>
                        </div>

                        {/* Context */}
                        <section>
                            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                                Contexto da Vaga
                            </h3>
                            <div className="bg-card p-5 rounded-lg border border-border text-sm text-foreground leading-relaxed">
                                {job.context || <em className="text-muted-foreground/60">Sem contexto definido.</em>}
                            </div>
                        </section>

                        {/* Mission */}
                        {job.mission && (
                            <section>
                                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                                    Missão do Cargo
                                </h3>
                                <div className="bg-card p-5 rounded-lg border border-border text-sm text-muted-foreground leading-relaxed">
                                    {job.mission}
                                </div>
                            </section>
                        )}

                        {/* Requirements */}
                        {job.requirements && (
                            <section>
                                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                    Requisitos
                                </h3>
                                <div className="bg-card p-5 rounded-lg border border-border">
                                    <ul className="space-y-3">
                                        {job.requirements.split('\n').map((item, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-foreground">
                                                <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
                                                <span className="leading-relaxed">{item.replace(/^- /, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}

                    </div>
                </div>

                {/* Footer Actions */}
                <footer className="p-6 border-t border-border bg-card shrink-0 flex justify-between items-center gap-4">
                    <button
                        onClick={() => {
                            onClose();
                            onDelete(job.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-base text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        Excluir Vaga
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/jobs/${job.id}/kanban`)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-base bg-background border border-border hover:bg-muted text-foreground transition-all active:scale-95 text-sm font-semibold"
                        >
                            <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                            Ver Kanban
                        </button>
                        <button
                            onClick={() => navigate(`/jobs/${job.id}/edit`)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all active:scale-95 text-sm font-semibold"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Editar Vaga
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default JobDetailsDrawer;
