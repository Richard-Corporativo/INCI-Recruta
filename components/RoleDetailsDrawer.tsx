import React from 'react';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';

interface RoleDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
    onDelete: (id: string, title: string) => void;
}

const RoleDetailsDrawer: React.FC<RoleDetailsDrawerProps> = ({
    isOpen,
    onClose,
    role,
    onDelete
}) => {
    const navigate = useNavigate();

    if (!isOpen || !role) return null;

    return (
        <>
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
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">Ref: {role.code}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${role.status === 'Ativo' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-muted-foreground bg-muted border-border'}`}>
                                        {role.status}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mt-2">{role.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                    <span className="material-symbols-outlined text-[18px]">domain</span>
                                    {role.department}
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

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card p-4 rounded-lg border border-border">
                                    <span className="text-xs text-muted-foreground font-semibold">Vagas Ativas</span>
                                    <p className="text-2xl font-bold text-primary mt-1">{role.activeJobsCount || 0}</p>
                                </div>
                                <div className="bg-card p-4 rounded-lg border border-border">
                                    <span className="text-xs text-muted-foreground font-semibold">Senioridade</span>
                                    <p className="text-lg font-bold text-foreground mt-1">{role.seniority || '-'}</p>
                                </div>
                            </div>

                            {/* Mission */}
                            <section>
                                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                                    Missão do Cargo
                                </h3>
                                <div className="bg-card p-5 rounded-lg border border-border text-sm text-muted-foreground leading-relaxed">
                                    {role.mission ? role.mission : <em className="text-muted-foreground/60">Nenhuma missão definida.</em>}
                                </div>
                            </section>

                            {/* Responsibilities */}
                            <section>
                                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                                    Responsabilidades
                                </h3>
                                <div className="bg-card p-5 rounded-lg border border-border">
                                    {role.responsibilities ? (
                                        <ul className="space-y-3">
                                            {role.responsibilities.split('\n').map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm text-foreground">
                                                    <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                                                    <span className="leading-relaxed">{item.replace(/^- /, '')}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Nenhuma responsabilidade listada.</p>
                                    )}
                                </div>
                            </section>

                            {/* Requirements */}
                            <section>
                                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                    Requisitos
                                </h3>
                                <div className="bg-card p-5 rounded-lg border border-border">
                                    {role.requirements ? (
                                        <ul className="space-y-3">
                                            {role.requirements.split('\n').map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm text-foreground">
                                                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
                                                    <span className="leading-relaxed">{item.replace(/^- /, '')}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Nenhum requisito listado.</p>
                                    )}
                                </div>
                            </section>

                            {/* Benefits */}
                            {role.benefits && role.benefits.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">redeem</span>
                                        Benefícios Sugeridos
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {role.benefits.map((benefit, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-background border border-border rounded-full text-xs font-medium text-foreground">
                                                {benefit}
                                            </span>
                                        ))}
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
                                onDelete(role.id, role.title);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-base text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                            Excluir Cargo
                        </button>
                        <button
                            onClick={() => navigate(`/roles/${role.id}/edit`)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all active:scale-95 text-sm font-semibold"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Editar Cargo
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default RoleDetailsDrawer;
