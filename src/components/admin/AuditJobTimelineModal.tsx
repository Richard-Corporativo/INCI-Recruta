import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { AuditLog } from '@src/types';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { auditService } from '@src/services/audit.service';

interface AuditJobTimelineModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle: string;
    logs: AuditLog[];
}

const AuditJobTimelineModal: React.FC<AuditJobTimelineModalProps> = ({ isOpen, onClose, jobTitle, logs }) => {
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    if (!isOpen) return null;

    const sortedLogs = [...logs].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border flex flex-col gap-4 bg-muted/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Auditoria da Vaga</h2>
                            <p className="text-sm text-muted-foreground font-medium">{jobTitle}</p>
                        </div>
                        <button onClick={onClose} className="size-10 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-all">
                            <Icon icon="material-symbols:close-rounded" className="size-6" />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setOrder('desc')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                order === 'desc' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-blue-600 border-blue-600/30 hover:bg-blue-600/10'
                            }`}
                        >
                            Mais Recentes (Desc)
                        </button>
                        <button 
                            onClick={() => setOrder('asc')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                order === 'asc' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-blue-600 border-blue-600/30 hover:bg-blue-600/10'
                            }`}
                        >
                            Mais Antigos (Cresc)
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    {sortedLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Icon icon="material-symbols:history-rounded" className="size-12 opacity-20 mb-4" />
                            <p className="text-sm italic">Nenhum registro encontrado para esta vaga.</p>
                        </div>
                    ) : (
                        <div className="relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                            {sortedLogs.map((log, index) => (
                                <div key={log.id} className="relative pl-12 pb-8 last:pb-0">
                                    {/* Dot */}
                                    <div className={`absolute left-0 top-1 size-10 rounded-full flex items-center justify-center border-4 border-card z-10 ${
                                        log.category === 'candidate_movement' ? 'bg-blue-500 text-white' :
                                        log.category === 'interview_scheduled' ? 'bg-purple-500 text-white' :
                                        log.category === 'feedback_added' ? 'bg-orange-500 text-white' :
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                        <Icon icon={
                                            log.category === 'candidate_movement' ? 'material-symbols:swap-horiz-rounded' :
                                            log.category === 'interview_scheduled' ? 'material-symbols:calendar-month-rounded' :
                                            log.category === 'feedback_added' ? 'material-symbols:rate-review-rounded' :
                                            'material-symbols:info-rounded'
                                        } className="size-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:bg-muted/50 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                {auditService.getFriendlyAction(log.action, log.category)}
                                            </span>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: ptBR })}
                                                </span>
                                                <span className="text-[9px] text-muted-foreground/60 mt-1">
                                                    {format(new Date(log.timestamp), "HH:mm:ss 'em' dd/MM/yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-foreground font-medium mb-3">
                                            {auditService.formatDetails(log.details)}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                                            <div className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-bold">
                                                {log.user_name?.[0].toUpperCase()}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground">Por {log.user_name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditJobTimelineModal;
