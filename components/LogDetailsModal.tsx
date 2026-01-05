import React from 'react';
import BaseModal from './BaseModal';
import { useCandidates } from '../hooks/useCandidates';
import { AuditLog } from '../types';

interface LogDetailsModalProps {
    log: AuditLog | null;
    onClose: () => void;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ log, onClose }) => {
    const { candidates } = useCandidates();

    const getEntityName = (type?: string, id?: string) => {
        if (type?.toLowerCase() === 'candidato' && id) {
            const candidate = candidates.find(c => String(c.id) === String(id));
            return candidate ? `${candidate.name}` : `ID #${id}`;
        }
        return id ? `ID #${id}` : 'N/A';
    };

    if (!log) return null;

    return (
        <BaseModal isOpen={!!log} onClose={onClose} maxWidth="max-w-2xl">
            <div className="flex flex-col gap-0">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                            <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground leading-tight">Detalhes de Auditoria</h2>
                            <span className="text-xs text-muted-foreground font-medium">{log.id}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ação</label>
                            <p className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border">
                                {log.action}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Data / Hora</label>
                            <p className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border">
                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Usuário Responsável</label>
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border border-border">
                                <span className="material-symbols-outlined text-muted-foreground text-[18px]">person</span>
                                <p className="text-sm font-semibold text-foreground">{log.user_name}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Entidade (Opicional)</label>
                            <p className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border font-mono text-xs">
                                {log.entity_type ? `${log.entity_type}: ${getEntityName(log.entity_type, log.entity_id)}` : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Detalhes Completos</label>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg max-h-[200px] overflow-y-auto">
                            <p className="text-sm text-foreground whitespace-pre-wrap font-medium leading-relaxed">
                                {log.details}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-background border border-border rounded-base text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default LogDetailsModal;
