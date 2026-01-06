import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { CandidateService } from '../src/services/CandidateService';
import { Candidate } from '../types';

export const useCandidateData = () => {
    const queryClient = useQueryClient();

    // --> otimizado: Cache unificado e lookup O(1) via React Query key
    const { data: authUser } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            return session?.user || null;
        }
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['candidate-data', authUser?.id],
        queryFn: () => CandidateService.getCandidateData(authUser!.id),
        enabled: !!authUser?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // --> otimizado: Memoização do cálculo de completude integrada ao hook
    const calculateCompleteness = (candidate: Candidate) => {
        const fields: (keyof Candidate)[] = [
            'name', 'phone', 'location', 'summary', 'linkedin', 'github', 'portfolio', 'resume_url', 'avatar'
        ];
        const filled = fields.filter(f => !!candidate[f]).length;
        return Math.round((filled / fields.length) * 100);
    };

    const mutation = useMutation({
        mutationFn: (updates: Partial<Candidate>) =>
            CandidateService.upsertCandidateByUserId(authUser!.id, updates),

        // --> otimizado: Update otimista para resposta instantânea (UX Guide 6.3)
        onMutate: async (newUpdates) => {
            await queryClient.cancelQueries({ queryKey: ['candidate-data', authUser?.id] });
            const previousData = queryClient.getQueryData(['candidate-data', authUser?.id]);

            if (previousData) {
                queryClient.setQueryData(['candidate-data', authUser?.id], (old: any) => ({
                    ...old,
                    currentCandidate: { ...old.currentCandidate, ...newUpdates }
                }));
            }

            return { previousData };
        },
        onError: (err, newUpdates, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['candidate-data', authUser?.id], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['candidate-data', authUser?.id] });
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: (applicationId: string) => CandidateService.withdrawApplication(applicationId),
        onMutate: async (applicationId) => {
            await queryClient.cancelQueries({ queryKey: ['candidate-data', authUser?.id] });
            const previousData = queryClient.getQueryData(['candidate-data', authUser?.id]);

            if (previousData) {
                queryClient.setQueryData(['candidate-data', authUser?.id], (old: any) => ({
                    ...old,
                    myApplications: (old.myApplications || []).map((app: any) =>
                        app.id === applicationId ? { ...app, columnId: 'withdrawn' } : app
                    )
                }));
            }
            return { previousData };
        },
        onError: (err, applicationId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['candidate-data', authUser?.id], context.previousData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidate-data', authUser?.id] });
        }
    });

    return {
        currentCandidate: data?.currentCandidate || null,
        jobs: data?.jobs || [],
        myApplications: (data?.myApplications || []).filter((app: any) => app.columnId !== 'withdrawn'),
        allApplications: data?.myApplications || [], // Keep all including withdrawn for history
        isLoading,
        refreshData: refetch,
        updateProfile: mutation.mutateAsync,
        withdrawApplication: withdrawMutation.mutateAsync,
        completeness: data?.currentCandidate ? calculateCompleteness(data.currentCandidate) : 0
    };
};
