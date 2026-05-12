'use client';

import { useState, useEffect, useCallback } from 'react';
import { JobService } from '@src/services/job.service';
import { Job, User } from '@src/types';

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await JobService.getJobs();
            setJobs(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const addJob = useCallback(async (jobData: Omit<Job, 'id' | 'created_at' | 'candidates_count'>) => {
        setIsLoading(true);
        const result = await JobService.createJob(jobData);
        if (!result) throw new Error('Falha ao criar vaga');
        await loadJobs();
    }, [loadJobs]);

    const updateJob = useCallback(async (id: string | number, updates: Partial<Job>) => {
        // Optimistic update
        setJobs(prev => prev.map(j => String(j.id) === String(id) ? { ...j, ...updates } : j));
        await JobService.updateJob(String(id), updates);
        await loadJobs(); // Refresh to ensure consistency
    }, [loadJobs]);

    const deleteJob = useCallback(async (id: string | number) => {
        setJobs(prev => prev.filter(j => String(j.id) !== String(id)));
        await JobService.deleteJob(String(id));
        await loadJobs(); // Refresh to ensure consistency
    }, [loadJobs]);

    const transitionJobStatus = useCallback(async (id: string | number, nextStatus: Job['workflow_status'], user: User) => {
        setIsLoading(true);
        try {
            await JobService.transitionStatus(String(id), nextStatus, user);
            await loadJobs();
        } finally {
            setIsLoading(false);
        }
    }, [loadJobs]);

    return { jobs, isLoading, addJob, updateJob, deleteJob, transitionJobStatus };
};

