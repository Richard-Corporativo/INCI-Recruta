import { useState, useEffect, useCallback } from 'react';
import { CandidateService } from '../src/services/CandidateService';
import { Candidate, KanbanColumnId } from '../types';

export const useCandidates = (jobId?: string | number) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCandidates = useCallback(async () => {
        setIsLoading(true);
        let data: Candidate[] = [];
        if (jobId) {
            data = await CandidateService.getCandidatesByJob(String(jobId));
        } else {
            data = await CandidateService.getCandidates();
        }
        setCandidates(data);
        setIsLoading(false);
    }, [jobId]);

    useEffect(() => {
        loadCandidates();
    }, [loadCandidates]);

    const addCandidate = useCallback(async (candidate: Omit<Candidate, 'id'>) => {
        await CandidateService.addCandidate(candidate);
        await loadCandidates();
    }, [loadCandidates]);

    const moveCandidate = useCallback(async (candidateId: string, targetColumnId: string) => {
        // Optimistic update
        setCandidates(prev => prev.map(c =>
            String(c.id) === String(candidateId) ? { ...c, columnId: targetColumnId as KanbanColumnId } : c
        ));
        await CandidateService.updateCandidate(candidateId, { columnId: targetColumnId as KanbanColumnId });
        await loadCandidates();
    }, [loadCandidates]);

    const updateCandidate = useCallback(async (id: string, data: Partial<Candidate>) => {
        await CandidateService.updateCandidate(id, data);
        await loadCandidates();
    }, [loadCandidates]);

    const deleteCandidate = useCallback(async (id: string) => {
        setCandidates(prev => prev.filter(c => String(c.id) !== String(id)));
        await CandidateService.deleteCandidate(id);
        await loadCandidates();
    }, [loadCandidates]);

    const addFeedback = useCallback(async (candidateId: string, feedback: any) => {
        await CandidateService.addFeedback(candidateId, feedback);
        await loadCandidates();
    }, [loadCandidates]);

    const refresh = useCallback(async () => {
        await loadCandidates();
    }, [loadCandidates]);

    return { candidates, isLoading, addCandidate, moveCandidate, updateCandidate, addFeedback, deleteCandidate, refresh };
};
