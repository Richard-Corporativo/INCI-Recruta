import { useState, useEffect, useCallback } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Candidate } from '../types';

export const useCandidates = (jobId?: string | number) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            StorageService.initialize();

            // await new Promise(resolve => setTimeout(resolve, 800)); // Delay removido para renderização imediata

            const data = StorageService.get<Candidate[]>(KEYS.CANDIDATES);
            if (data) {
                const filtered = jobId ? data.filter(c => String(c.jobId) === String(jobId)) : data;
                setCandidates(filtered);
            }
            setIsLoading(false);
        };
        load();

        const handleStorageChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail && customEvent.detail.key === KEYS.CANDIDATES) {
                const allData = customEvent.detail.data as Candidate[];
                if (allData) {
                    const filtered = jobId ? allData.filter(c => String(c.jobId) === String(jobId)) : allData;
                    setCandidates(filtered);
                }
            }
        };

        window.addEventListener('recruitsys_storage_change', handleStorageChange);
        return () => window.removeEventListener('recruitsys_storage_change', handleStorageChange);
    }, [jobId]);

    const addCandidate = useCallback((candidate: Omit<Candidate, 'id'>) => {
        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const newCandidate: Candidate = {
            ...candidate,
            id: Math.random().toString(36).substring(2, 11)
        } as Candidate;
        const updated = [...allCandidates, newCandidate];
        StorageService.set(KEYS.CANDIDATES, updated);

        if (jobId) {
            setCandidates(updated.filter(c => String(c.jobId) === String(jobId)));
        } else {
            setCandidates(updated);
        }
    }, [jobId]);

    const moveCandidate = useCallback((candidateId: string, targetColumnId: string) => {
        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const updated = allCandidates.map(c =>
            String(c.id) === String(candidateId) ? { ...c, columnId: targetColumnId } : c
        );
        StorageService.set(KEYS.CANDIDATES, updated);

        if (jobId) {
            setCandidates(updated.filter(c => String(c.jobId) === String(jobId)));
        } else {
            setCandidates(updated);
        }
    }, [jobId]);

    const deleteCandidate = useCallback((id: string) => {
        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const updated = allCandidates.filter(c => String(c.id) !== String(id));
        StorageService.set(KEYS.CANDIDATES, updated);

        if (jobId) {
            setCandidates(updated.filter(c => String(c.jobId) === String(jobId)));
        } else {
            setCandidates(updated);
        }
    }, [jobId]);

    const updateCandidate = useCallback((id: string, data: Partial<Candidate>) => {
        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const updated = allCandidates.map(c =>
            String(c.id) === String(id) ? { ...c, ...data } : c
        );
        StorageService.set(KEYS.CANDIDATES, updated);

        if (jobId) {
            setCandidates(updated.filter(c => String(c.jobId) === String(jobId)));
        } else {
            setCandidates(updated);
        }
    }, [jobId]);

    const addFeedback = useCallback((candidateId: string, feedback: Omit<any, 'id' | 'createdAt'>) => {
        const newFeedback = {
            ...feedback,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString()
        };

        const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const updated = allCandidates.map(c => {
            if (String(c.id) === String(candidateId)) {
                const feedbacks = [...(c.feedbacks || []), newFeedback];
                // If moving stage through feedback
                const columnId = feedback.stage || c.columnId;
                return { ...c, feedbacks, columnId };
            }
            return c;
        });
        StorageService.set(KEYS.CANDIDATES, updated);

        if (jobId) {
            setCandidates(updated.filter(c => String(c.jobId) === String(jobId)));
        } else {
            setCandidates(updated);
        }
    }, [jobId]);

    const refresh = useCallback(() => {
        const data = StorageService.get<Candidate[]>(KEYS.CANDIDATES);
        if (data) {
            const filtered = jobId ? data.filter(c => String(c.jobId) === String(jobId)) : data;
            setCandidates(filtered);
        }
    }, [jobId]);

    return { candidates, isLoading, addCandidate, moveCandidate, updateCandidate, addFeedback, deleteCandidate, refresh };
};
