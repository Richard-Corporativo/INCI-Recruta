import { useState, useEffect, useCallback } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Job, Candidate } from '../types';

export const useCandidateData = () => {
    const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [myApplications, setMyApplications] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const calculateCompleteness = (candidate: Candidate) => {
        const fields: (keyof Candidate)[] = [
            'name', 'phone', 'location', 'summary', 'linkedin', 'github', 'portfolio', 'resumeName', 'avatar'
        ];
        const filled = fields.filter(f => !!candidate[f]).length;
        return Math.round((filled / fields.length) * 100);
    };

    const refreshData = useCallback(() => {
        setIsLoading(true);
        const allJobs = StorageService.get<Job[]>(KEYS.JOBS) || [];
        const activeJobs = allJobs.filter(j => j.status === 'Ativa');
        setJobs(activeJobs);

        const email = localStorage.getItem('recruitSys_candidate_email');
        if (email) {
            const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
            const candidateInfo = allCandidates.find(c => c.email === email);
            if (candidateInfo) {
                setCurrentCandidate(candidateInfo);
                const apps = allCandidates.filter(c => c.email === email && c.jobId);
                setMyApplications(apps);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshData();
        // Escutar mudanças no localStorage (simplificado)
        window.addEventListener('storage', refreshData);
        return () => window.removeEventListener('storage', refreshData);
    }, [refreshData]);

    const updateProfile = (data: Partial<Candidate>) => {
        if (!currentCandidate) return;
        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const updatedCandidates = allCandidates.map(c =>
            c.email === currentCandidate.email ? { ...c, ...data } : c
        );
        StorageService.set(KEYS.CANDIDATES, updatedCandidates);
        refreshData();
    };

    return {
        currentCandidate,
        jobs,
        myApplications,
        isLoading,
        refreshData,
        updateProfile,
        completeness: currentCandidate ? calculateCompleteness(currentCandidate) : 0
    };
};
