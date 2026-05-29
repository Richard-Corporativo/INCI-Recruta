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
        try {
            setIsLoading(true);
            const data = await NotificationService.getForUser(user.id);
            setNotifications(data);
        } catch (error) {
            console.warn('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
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
        try {
            await NotificationService.markRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.warn('Failed to mark notification as read:', error);
        }
    }, []);

    const markAllRead = useCallback(async () => {
        if (!user?.id) return;
        try {
            await NotificationService.markAllRead(user.id);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.warn('Failed to mark all notifications as read:', error);
        }
    }, [user?.id]);

    return { notifications, unreadCount, markRead, markAllRead, isLoading };
}
