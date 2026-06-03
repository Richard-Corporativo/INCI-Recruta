'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from '@src/lib/router-compat';
import { cn } from '@src/lib/utils';
import { usePublicNotifications } from '@src/hooks/usePublicNotifications';

function formatRelative(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
}

export function PublicNotificationBell() {
    const { notifications, unreadCount, isLoading, markRead, markAllRead, readIds } = usePublicNotifications();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleItemClick = (id: string) => {
        markRead(id);
        setOpen(false);
        navigate('/vagas');
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(prev => !prev)}
                aria-label="Novas vagas"
                aria-expanded={open}
                aria-haspopup="true"
                className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
                <Icon icon="material-symbols:notifications" className="h-5 w-5" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full z-[80] mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-[0.15em]">Novas vagas</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-[11px] font-medium text-primary hover:underline transition-colors duration-200 ease-in-out"
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-xs text-muted-foreground">Nenhuma vaga publicada recentemente</p>
                        ) : (
                            notifications.map(n => {
                                const isRead = readIds.has(n.id);
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => handleItemClick(n.id)}
                                        className={cn(
                                            'w-full text-left px-4 py-3 flex flex-col gap-0.5 border-b border-border last:border-0 transition-colors duration-200 ease-in-out hover:bg-muted/50',
                                            !isRead && 'bg-primary/5'
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-semibold text-foreground leading-snug">{n.title}</span>
                                            {!isRead && (
                                                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-muted-foreground/70">Nova vaga publicada</span>
                                            <span className="text-[10px] text-muted-foreground/50">·</span>
                                            <span className="text-[10px] text-muted-foreground/70">{formatRelative(n.created_at)}</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
