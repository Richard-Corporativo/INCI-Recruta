import { useState, useEffect } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Candidate } from '../types';

export const useCandidates = (jobId?: string | number) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<Candidate[]>(KEYS.CANDIDATES);
        if (data) {
            setCandidates(data);
        }
    }, [jobId]);

    const addCandidate = (candidate: Omit<Candidate, 'id'>) => {
        const data = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const newCandidate: Candidate = {
            ...candidate,
            id: Math.random().toString(36).substr(2, 9)
        } as Candidate;
        const updated = [...data, newCandidate];
        setCandidates(updated);
        StorageService.set(KEYS.CANDIDATES, updated);
    };

    const moveCandidate = (candidateId: string, targetColumnId: string) => {
        const data = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
        const updated = data.map(c =>
            c.id === candidateId ? { ...c, columnId: targetColumnId } : c
        );
        setCandidates(updated);
        StorageService.set(KEYS.CANDIDATES, updated);
    };

    return { candidates, addCandidate, moveCandidate };
};
