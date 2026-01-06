import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CandidateService } from '../src/services/CandidateService';
import { Candidate, KanbanColumnId } from '../types';

export const useCandidates = (jobId?: string | number) => {
    const queryClient = useQueryClient();
    const queryKey = jobId ? ['candidates', String(jobId)] : ['candidates'];

    const { data: candidates = [], isLoading, error, refetch } = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            if (jobId) {
                return await CandidateService.getCandidatesByJob(String(jobId));
            } else {
                return await CandidateService.getCandidates();
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
    });

    const addCandidate = useMutation({
        mutationFn: async (candidate: Omit<Candidate, 'id'>) => {
            await CandidateService.addCandidate(candidate);
        },
        onMutate: async (newCandidate) => {
            await queryClient.cancelQueries({ queryKey });
            const previousCandidates = queryClient.getQueryData(queryKey);

            // Optimistic update
            const optimisticCandidate = { ...newCandidate, id: 'temp-' + Date.now() } as Candidate;
            queryClient.setQueryData(queryKey, (old: Candidate[] | undefined) => [...(old || []), optimisticCandidate]);

            return { previousCandidates };
        },
        onError: (_err, _newCandidate, context) => {
            if (context?.previousCandidates) {
                queryClient.setQueryData(queryKey, context.previousCandidates);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const moveCandidate = useMutation({
        mutationFn: async ({ candidateId, targetColumnId }: { candidateId: string, targetColumnId: string }) => {
            await CandidateService.updateCandidate(candidateId, { columnId: targetColumnId as KanbanColumnId });
        },
        onMutate: async ({ candidateId, targetColumnId }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousCandidates = queryClient.getQueryData<Candidate[]>(queryKey);

            // Optimistic update
            if (previousCandidates) {
                queryClient.setQueryData(queryKey, previousCandidates.map(c =>
                    String(c.id) === String(candidateId) ? { ...c, columnId: targetColumnId as KanbanColumnId } : c
                ));
            }

            return { previousCandidates };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousCandidates) {
                queryClient.setQueryData(queryKey, context.previousCandidates);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const updateCandidate = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<Candidate> }) => {
            await CandidateService.updateCandidate(id, data);
        },
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousCandidates = queryClient.getQueryData<Candidate[]>(queryKey);

            if (previousCandidates) {
                queryClient.setQueryData(queryKey, previousCandidates.map(c =>
                    String(c.id) === String(id) ? { ...c, ...data } : c
                ));
            }
            return { previousCandidates };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousCandidates) {
                queryClient.setQueryData(queryKey, context.previousCandidates);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const deleteCandidate = useMutation({
        mutationFn: async (id: string) => {
            await CandidateService.deleteCandidate(id);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey });
            const previousCandidates = queryClient.getQueryData<Candidate[]>(queryKey);

            if (previousCandidates) {
                queryClient.setQueryData(queryKey, previousCandidates.filter(c => String(c.id) !== String(id)));
            }
            return { previousCandidates };
        },
        onError: (_err, _id, context) => {
            if (context?.previousCandidates) {
                queryClient.setQueryData(queryKey, context.previousCandidates);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const addFeedback = useMutation({
        mutationFn: async ({ candidateId, feedback }: { candidateId: string, feedback: any }) => {
            await CandidateService.addFeedback(candidateId, feedback);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        candidates,
        isLoading,
        addCandidate: addCandidate.mutate,
        moveCandidate: (candidateId: string, targetColumnId: string) => moveCandidate.mutate({ candidateId, targetColumnId }),
        updateCandidate: (id: string, data: Partial<Candidate>) => updateCandidate.mutate({ id, data }),
        addFeedback: (candidateId: string, feedback: any) => addFeedback.mutate({ candidateId, feedback }),
        deleteCandidate: deleteCandidate.mutate,
        refresh: refetch
    };
};
