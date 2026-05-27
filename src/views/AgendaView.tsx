'use client';

// @component AgendaView | @tipo view | @versao 1.0.0
// > Central de agendamentos e entrevistas da empresa
// @state filter — todos | hoje | semana

import React, { useState } from 'react';
import { useInterviews } from '@src/hooks/useInterviews';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from '@iconify/react';
import { formatDateTime } from '@src/lib/formatters';

const AgendaView: React.FC = () => {
    const { interviews, isLoading, deleteInterview, updateInterview } = useInterviews();
    const { success: toastSuccess, error: toastError } = useToast();
    const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
    const [editing, setEditing] = useState<{ id: string; field: 'location' | 'address' | 'starts_at' } | null>(null);
    const [editValue, setEditValue] = useState('');

    const filteredInterviews = interviews.filter(item => {
        if (filter === 'all') return true;
        const date = new Date(item.starts_at);
        const now = new Date();
        if (filter === 'today') {
            return date.toDateString() === now.toDateString();
        }
        if (filter === 'week') {
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);
            return date >= now && date <= nextWeek;
        }
        return true;
    });

    const getStatusBadge = (status: string | undefined) => {
        switch (status) {
            case 'scheduled': return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 uppercase">Agendada</span>;
            case 'completed': return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600 uppercase">Concluída</span>;
            case 'cancelled': return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 uppercase">Cancelada</span>;
            default: return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">Agendada</span>;
        }
    };

    const handleEditStart = (id: string, field: 'location' | 'address' | 'starts_at', value: string) => {
        setEditing({ id, field });
        setEditValue(value);
    };

    const handleEditSave = async (id: string) => {
        if (!editing || editing.id !== id) return;
        try {
            let updatePayload: Record<string, string>;
            if (editing.field === 'starts_at') {
                const [dateStr, timeStr] = editValue.split('T');
                const [year, month, day] = dateStr.split('-').map(Number);
                const [hours, minutes] = timeStr.split(':').map(Number);
                const newStart = new Date(year, month - 1, day, hours, minutes, 0);
                const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);
                updatePayload = { starts_at: newStart.toISOString(), ends_at: newEnd.toISOString() };
            } else {
                updatePayload = { [editing.field]: editValue };
            }
            await updateInterview(id, updatePayload);
            toastSuccess('Agendamento atualizado com sucesso');
            setEditing(null);
        } catch (err: any) {
            toastError(err?.message || 'Erro ao atualizar agendamento');
        }
    };

    const handleEditCancel = () => {
        setEditing(null);
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Agenda de Entrevistas</h1>
                    <p className="text-sm text-muted-foreground">Gerencie seus compromissos e processos seletivos.</p>
                </div>

                <div className="flex bg-muted/50 p-1 rounded-xl border border-border w-fit">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Tudo
                    </button>
                    <button 
                        onClick={() => setFilter('today')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'today' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Hoje
                    </button>
                    <button 
                        onClick={() => setFilter('week')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'week' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Esta Semana
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : filteredInterviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Icon icon="material-symbols:calendar-month-outline" className="text-muted-foreground text-3xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Nenhuma entrevista encontrada</h3>
                    <p className="text-sm text-muted-foreground">Tente mudar o filtro ou agende novas entrevistas via Kanban.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredInterviews.map((item) => (
                        <div key={item.id} className="bg-background border border-border p-5 rounded-3xl hover:border-primary/40 transition-all group relative">

                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="material-symbols:calendar-today" className="text-primary text-sm" />
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {formatDateTime(item.starts_at, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                </div>
                                {getStatusBadge(item.status)}
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
                                        {item.candidate_name?.charAt(0) || 'C'}
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-tight">Candidato</p>
                                        <p className="font-semibold text-foreground">{item.candidate_name || 'Não informado'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                                        <Icon icon="material-symbols:schedule" width="16" />
                                    </div>
                                    <div className="text-sm min-w-0 flex-1">
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-tight">Horário</p>
                                        {editing?.id === item.id && editing?.field === 'starts_at' ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="datetime-local"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleEditSave(item.id);
                                                        if (e.key === 'Escape') handleEditCancel();
                                                    }}
                                                    autoFocus
                                                    className="flex-1 h-8 px-3 rounded-lg border border-ring bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                                />
                                                <button onClick={() => handleEditSave(item.id)} className="p-1 hover:bg-primary/10 rounded text-primary transition-colors">
                                                    <Icon icon="material-symbols:check" width="16" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group/time">
                                                <span className="font-semibold text-foreground">
                                                    {formatDateTime(item.starts_at, { hour: '2-digit', minute: '2-digit', hour12: false })} - {formatDateTime(item.ends_at, { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        const d = new Date(item.starts_at);
                                                        const localStr = d.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T').slice(0, 16);
                                                        handleEditStart(item.id, 'starts_at', localStr);
                                                    }}
                                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded opacity-0 group-hover/time:opacity-100 transition-all duration-200 ease-in-out shrink-0"
                                                    title="Editar horário"
                                                >
                                                    <Icon icon="material-symbols:edit-outline" width="16" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                        {item.location && (() => {
                                            const isUrl = /^https?:\/\//i.test(item.location);
                                            const isEditing = editing?.id === item.id && editing?.field === 'location';
                                            return (
                                                <div className="flex items-start gap-3">
                                                    <div className="size-8 rounded-full bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
                                                        <Icon icon="material-symbols:videocam-outline" width="16" />
                                                    </div>
                                                    <div className="text-sm min-w-0 flex-1">
                                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-tight">Link de Videochamada</p>
                                                        {isEditing ? (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <input
                                                                    type="text"
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleEditSave(item.id);
                                                                        if (e.key === 'Escape') handleEditCancel();
                                                                    }}
                                                                    onBlur={() => handleEditSave(item.id)}
                                                                    autoFocus
                                                                    className="flex-1 h-8 px-3 rounded-lg border border-ring bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                                                />
                                                                <button onClick={() => handleEditSave(item.id)} className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors">
                                                                    <Icon icon="material-symbols:check" width="16" />
                                                                </button>
                                                            </div>
                                                        ) : isUrl ? (
                                                            <div className="flex items-start gap-2 group/link">
                                                                <a
                                                                    href={item.location}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate block transition-colors duration-200 ease-in-out flex-1"
                                                                    title={item.location}
                                                                >
                                                                    {item.location}
                                                                </a>
                                                                <button
                                                                    onClick={() => handleEditStart(item.id, 'location', item.location || '')}
                                                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded opacity-0 group-hover/link:opacity-100 transition-all duration-200 ease-in-out shrink-0"
                                                                    title="Editar link"
                                                                >
                                                                    <Icon icon="material-symbols:edit-outline" width="16" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-start gap-2 group/link">
                                                                <a
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-semibold text-foreground hover:text-blue-600 hover:underline cursor-pointer break-words transition-colors duration-200 ease-in-out flex-1"
                                                                    title="Abrir no Google Maps"
                                                                >
                                                                    {item.location}
                                                                </a>
                                                                <button
                                                                    onClick={() => handleEditStart(item.id, 'location', item.location || '')}
                                                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded opacity-0 group-hover/link:opacity-100 transition-all duration-200 ease-in-out shrink-0"
                                                                    title="Editar link"
                                                                >
                                                                    <Icon icon="material-symbols:edit-outline" width="16" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {(() => {
                                            const isEditing = editing?.id === item.id && editing?.field === 'address';
                                            return (
                                                <div className="flex items-start gap-3">
                                                    <div className="size-8 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
                                                        <Icon icon="material-symbols:location-on-outline" width="16" />
                                                    </div>
                                                    <div className="text-sm min-w-0 flex-1">
                                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-tight">Endereço Físico</p>
                                                        {isEditing ? (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <input
                                                                    type="text"
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleEditSave(item.id);
                                                                        if (e.key === 'Escape') handleEditCancel();
                                                                    }}
                                                                    onBlur={() => handleEditSave(item.id)}
                                                                    autoFocus
                                                                    className="flex-1 h-8 px-3 rounded-lg border border-ring bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                                                />
                                                                <button onClick={() => handleEditSave(item.id)} className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors">
                                                                    <Icon icon="material-symbols:check" width="16" />
                                                                </button>
                                                            </div>
                                                        ) : item.address ? (
                                                            <div className="flex items-start gap-2 group/address">
                                                                <a
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-semibold text-foreground hover:text-amber-600 hover:underline cursor-pointer break-words transition-colors duration-200 ease-in-out flex-1"
                                                                    title="Abrir no Google Maps"
                                                                >
                                                                    {item.address}
                                                                </a>
                                                                <button
                                                                    onClick={() => handleEditStart(item.id, 'address', item.address || '')}
                                                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded opacity-0 group-hover/address:opacity-100 transition-all duration-200 ease-in-out shrink-0"
                                                                    title="Editar endereço"
                                                                >
                                                                    <Icon icon="material-symbols:edit-outline" width="16" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleEditStart(item.id, 'address', '')}
                                                                className="text-xs text-muted-foreground hover:text-amber-600 transition-colors flex items-center gap-1 mt-0.5"
                                                            >
                                                                <Icon icon="material-symbols:add" width="14" />
                                                                Adicionar endereço
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                            </div>

                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Icon icon="material-symbols:work-outline" />
                                    <span className="truncate max-w-[120px]">{item.job_title || 'Vaga não vinculada'}</span>
                                </div>
                                <button 
                                    onClick={() => { if(confirm('Excluir agendamento?')) deleteInterview(item.id); }}
                                    className="p-2 hover:bg-rose-50 rounded-full text-muted-foreground hover:text-rose-500 transition-colors"
                                    title="Remover"
                                >
                                    <Icon icon="material-symbols:delete-outline" width="18" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgendaView;
