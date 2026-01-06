import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobService } from '../src/services/JobService';
import { Job } from '../types';

export const useJobs = () => {
    const queryClient = useQueryClient();

    const { data: jobs = [], isLoading, error } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            return await JobService.getJobs();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
    });

    const addJob = useMutation({
        mutationFn: async (jobData: Omit<Job, 'id' | 'created_at' | 'candidates_count'>) => {
            return await JobService.createJob(jobData);
        },
        onMutate: async (newJob) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] });
            const previousJobs = queryClient.getQueryData(['jobs']);

            // Optimistic update
            const optimisticJob = { ...newJob, id: 'temp-' + Date.now(), created_at: new Date().toISOString(), candidates_count: 0 } as Job;
            queryClient.setQueryData(['jobs'], (old: Job[] | undefined) => [...(old || []), optimisticJob]);

            return { previousJobs };
        },
        onError: (_err, _newJob, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context.previousJobs);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });

    const updateJob = useMutation({
        mutationFn: async ({ id, ...updates }: { id: string | number } & Partial<Job>) => {
            await JobService.updateJob(String(id), updates);
        },
        onMutate: async ({ id, ...updates }) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] });
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);

            // Optimistic update
            if (previousJobs) {
                queryClient.setQueryData(['jobs'], previousJobs.map(j => String(j.id) === String(id) ? { ...j, ...updates } : j));
            }

            return { previousJobs };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context.previousJobs);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
    });

    const deleteJob = useMutation({
        mutationFn: async (id: string | number) => {
            await JobService.deleteJob(String(id));
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] });
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);

            // Optimistic update
            if (previousJobs) {
                queryClient.setQueryData(['jobs'], previousJobs.filter(j => String(j.id) !== String(id)));
            }
            return { previousJobs };
        },
        onError: (_err, _id, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context.previousJobs);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
    });

    return {
        jobs,
        isLoading,
        addJob: addJob.mutate,
        updateJob: (id: string | number, updates: Partial<Job>) => updateJob.mutate({ id, ...updates }),
        deleteJob: deleteJob.mutate,
        error
    };
};
