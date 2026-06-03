import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@src/lib/supabase';
import { PublicNotificationService } from '@src/services/public-notification.service';
import { PublicJobNotification } from '@src/types';

const LS_KEY = 'pjn_read_ids';

function getReadIds(): Set<string> {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return new Set(raw ? JSON.parse(raw) : []);
    } catch {
        return new Set();
    }
}

function saveReadIds(ids: Set<string>): void {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
    } catch {
        // localStorage indisponível — ignora silenciosamente
    }
}

export function usePublicNotifications() {
    const [notifications, setNotifications] = useState<PublicJobNotification[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Carrega estado de "lido" do localStorage após hidratação
    useEffect(() => {
        setReadIds(getReadIds());
    }, []);

    const unreadCount = useMemo(
        () => notifications.filter(n => !readIds.has(n.id)).length,
        [notifications, readIds]
    );

    const fetchRecent = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await PublicNotificationService.getRecent(10);
            setNotifications(data);
        } catch (error) {
            console.warn('[usePublicNotifications] Falha ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecent();

        const channel = supabase
            .channel('public_job_notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'public_job_notifications' },
                (payload) => {
                    const newItem = payload.new as PublicJobNotification;
                    setNotifications(prev => [newItem, ...prev].slice(0, 10));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchRecent]);

    const markRead = useCallback((id: string) => {
        setReadIds(prev => {
            const next = new Set(prev);
            next.add(id);
            saveReadIds(next);
            return next;
        });
    }, []);

    const markAllRead = useCallback(() => {
        setReadIds(prev => {
            const next = new Set(prev);
            notifications.forEach(n => next.add(n.id));
            saveReadIds(next);
            return next;
        });
    }, [notifications]);

    return { notifications, unreadCount, isLoading, markRead, markAllRead, readIds };
}
