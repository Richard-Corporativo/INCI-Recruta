import { useState, useEffect, useCallback } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Job } from '../types';

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            StorageService.initialize();

            // --> otimizado: Simulando latência de rede para feedback visual (Fake Loading)
            await new Promise(resolve => setTimeout(resolve, 800));

            const data = StorageService.get<Job[]>(KEYS.JOBS);
            if (data) setJobs(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const addJob = useCallback((job: Omit<Job, 'id' | 'created_at'>) => {
        setJobs(prev => {
            const newJob: Job = {
                ...job,
                id: Math.floor(Math.random() * 90000) + 10000,
                created_at: new Date().toLocaleDateString('pt-BR')
            };
            const updated = [...prev, newJob];
            StorageService.set(KEYS.JOBS, updated);
            return updated;
        });
    }, []);

    const updateJob = useCallback((id: string | number, updates: Partial<Job>) => {
        setJobs(prev => {
            const updated = prev.map(job => (String(job.id) === String(id) ? { ...job, ...updates } : job));
            StorageService.set(KEYS.JOBS, updated);
            return updated;
        });
    }, []);

    const deleteJob = useCallback((id: string | number) => {
        setJobs(prev => {
            const updated = prev.filter(job => String(job.id) !== String(id));
            StorageService.set(KEYS.JOBS, updated);
            return updated;
        });
    }, []);

    return { jobs, isLoading, addJob, updateJob, deleteJob };
};
