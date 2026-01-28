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
        if (!id) return 'N/A';
        const typeLower = type?.toLowerCase();
        if (typeLower === 'candidato' || typeLower === 'candidate') {
            const candidate = candidates.find(c => String(c.id) === String(id));
            return candidate ? `${candidate.name}` : `ID #${id}`;
        }
        return `ID #${id}`;
    };

    if (!log) return null;

    // Helper to render diffs
    const renderDiff = () => {
        if (!log.old_value && !log.new_value) return null;

        const oldVal = log.old_value || {};
        const newVal = log.new_value || {};

        // Find keys that changed
        const allKeys = Array.from(new Set([...Object.keys(oldVal), ...Object.keys(newVal)]));
        const changedKeys = allKeys.filter(key =>
            JSON.stringify(oldVal[key]) !== JSON.stringify(newVal[key]) &&
            !['updated_at', 'created_at'].includes(key)
        );

        if (changedKeys.length === 0) return null;

        return (
            <div className="space-y-4 pt-4 border-t border-border mt-4">
                <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">difference</span>
                    Deltas Detectados (De &rarr; Para)
                </label>
                <div className="space-y-3">
                    {changedKeys.map(key => (
                        <div key={key} className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                            <div className="bg-muted px-3 py-1.5 border-b border-border">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{key}</span>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-border">
                                <div className="p-3 bg-red-500/5">
                                    <span className="text-[10px] text-red-600 font-bold uppercase block mb-1">Anterior</span>
                                    <p className="text-xs font-mono text-red-700/80 break-all">
                                        {oldVal[key] === null ? 'null' : typeof oldVal[key] === 'object' ? JSON.stringify(oldVal[key]) : String(oldVal[key])}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-500/5">
                                    <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-1">Novo</span>
                                    <p className="text-xs font-mono text-emerald-700 break-all font-bold">
                                        {newVal[key] === null ? 'null' : typeof newVal[key] === 'object' ? JSON.stringify(newVal[key]) : String(newVal[key])}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <BaseModal isOpen={!!log} onClose={onClose} maxWidth="max-w-2xl">
            <div className="flex flex-col gap-0">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                            <span className="material-symbols-outlined text-[20px]">policy</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground leading-tight">Gasto em Governança</h2>
                            <span className="text-xs text-muted-foreground font-medium">Log ID: {log.id}</span>
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
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Evento</label>
                            <p className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border">
                                {log.action}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Carimbado em</label>
                            <p className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border">
                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agente Responsável</label>
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border border-border">
                                <span className="material-symbols-outlined text-muted-foreground text-[18px]">person</span>
                                <p className="text-sm font-semibold text-foreground">{log.user_name}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Entidade Afetada</label>
                            <p className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border font-mono text-[10px] truncate">
                                {log.entity_type ? `${log.entity_type}: ${getEntityName(log.entity_type, log.entity_id)}` : 'Sistêmico'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registro Detalhado</label>
                        <div className="p-4 bg-muted/20 border border-border rounded-lg">
                            <p className="text-sm text-foreground whitespace-pre-wrap font-medium leading-relaxed">
                                {log.details}
                            </p>
                        </div>
                    </div>

                    {renderDiff()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-base text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        OK, Entendido
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default LogDetailsModal;
