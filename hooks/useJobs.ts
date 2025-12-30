import { useState, useEffect } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Job } from '../types';

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<Job[]>(KEYS.JOBS);
        if (data) setJobs(data);
    }, []);

    const addJob = (job: Omit<Job, 'id' | 'created_at'>) => {
        const newJob: Job = {
            ...job,
            id: Math.floor(Math.random() * 90000) + 10000,
            created_at: new Date().toLocaleDateString('pt-BR')
        };
        const updated = [...jobs, newJob];
        setJobs(updated);
        StorageService.set(KEYS.JOBS, updated);
    };

    const updateJob = (id: string | number, updates: Partial<Job>) => {
        const updated = jobs.map(job => (String(job.id) === String(id) ? { ...job, ...updates } : job));
        setJobs(updated);
        StorageService.set(KEYS.JOBS, updated);
    };

    const deleteJob = (id: string | number) => {
        const updated = jobs.filter(job => String(job.id) !== String(id));
        setJobs(updated);
        StorageService.set(KEYS.JOBS, updated);
    };

    return { jobs, addJob, updateJob, deleteJob };
};
