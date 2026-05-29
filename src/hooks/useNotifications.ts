import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@src/lib/supabase';
import { NotificationService } from '@src/services/notification.service';
import { CandidateNotification } from '@src/types';
import { useAuth } from '@src/context/AuthContext';

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<CandidateNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const unreadCount = useMemo(
        () => notifications.filter(n => !n.read).length,
        [notifications]
    );

    const fetchAll = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        const data = await NotificationService.getForUser(user.id, 10);
        setNotifications(data);
        setIsLoading(false);
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;

        fetchAll();

        const channel = supabase
            .channel(`notifications:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'candidate_notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const newItem = payload.new as CandidateNotification;
                    setNotifications(prev => [newItem, ...prev].slice(0, 10));
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'candidate_notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const updated = payload.new as CandidateNotification;
                    setNotifications(prev =>
                        prev.map(n => n.id === updated.id ? updated : n)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, fetchAll]);

    const markRead = useCallback(async (id: string) => {
        await NotificationService.markRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllRead = useCallback(async () => {
        if (!user?.id) return;
        await NotificationService.markAllRead(user.id);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, [user?.id]);

    return { notifications, unreadCount, markRead, markAllRead, isLoading };
}
