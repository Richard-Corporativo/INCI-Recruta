import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { AuditLog } from '../types';

const fetchLogs = async ({ pageParam = 0 }) => {
    const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam * 50, (pageParam + 1) * 50 - 1);

    if (error) throw error;

    return data.map(log => ({
        id: log.id,
        action: log.action,
        details: log.details || '',
        entity_id: log.entity_id,
        timestamp: log.created_at,
        user_name: log.user_email || 'Sistema'
    })) as AuditLog[];
};

export const useAudit = () => {
    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['audit_logs'],
        queryFn: fetchLogs,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 50 ? allPages.length : undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
    });

    const logs = data?.pages.flat() || [];

    const addLog = useMutation({
        mutationFn: async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
            const { data: { session } } = await supabase.auth.getSession();

            const { error } = await supabase
                .from('audit_logs')
                .insert([{
                    action: log.action,
                    details: log.details,
                    entity_id: log.entity_id,
                    user_id: session?.user?.id,
                    user_email: session?.user?.email || 'Sistema'
                }]);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
        }
    });

    return {
        logs,
        addLog: addLog.mutate,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['audit_logs'] })
    };
};
