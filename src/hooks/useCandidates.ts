'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CandidateService } from '@src/services/candidate.service';
import { Candidate, CandidateFeedbackInput, CandidateSearchFilters, KanbanColumnId } from '@src/types';

export const useCandidates = (jobId?: string | number) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allSkills, setAllSkills] = useState<string[]>([]);
    const [allLocations, setAllLocations] = useState<string[]>([]);

    const loadCandidates = useCallback(async () => {
        setIsLoading(true);
        try {
            let data: Candidate[] = [];
            if (jobId) {
                data = await CandidateService.getCandidatesByJob(String(jobId));
            } else {
                data = await CandidateService.getCandidatesApplicants();
            }
            setCandidates(data || []);
        } finally {
            setIsLoading(false);
        }
    }, [jobId]);

    const candidatesRef = useRef(candidates);
    useEffect(() => { candidatesRef.current = candidates; }, [candidates]);

    const loadMetadata = useCallback(async () => {
        const [skills, locations] = await Promise.all([
            CandidateService.getAllSkills(),
            CandidateService.getAllLocations(),
        ]);
        setAllSkills(skills);
        setAllLocations(locations);
    }, []);

    useEffect(() => {
        loadCandidates();
        loadMetadata();
    }, [loadCandidates, loadMetadata]);

    const addCandidate = useCallback(async (candidate: Omit<Candidate, 'id' | 'applied_at'>) => {
        await CandidateService.addCandidate(candidate);
        await loadCandidates();
    }, [loadCandidates]);

    const moveCandidate = useCallback(async (candidateId: string, targetColumnId: string) => {
        const previous = candidatesRef.current;
        setCandidates(prev => prev.map(c =>
            String(c.id) === String(candidateId) ? { ...c, columnId: targetColumnId as KanbanColumnId } : c
        ));
        try {
            await CandidateService.updateCandidate(candidateId, { columnId: targetColumnId as KanbanColumnId });
        } catch (e) {
            setCandidates(previous);
            throw e;
        }
    }, []);

    const updateCandidate = useCallback(async (id: string, data: Partial<Candidate>) => {
        const previous = candidatesRef.current;
        setCandidates(prev => prev.map(c =>
            String(c.id) === String(id) ? { ...c, ...data } : c
        ));
        try {
            await CandidateService.updateCandidate(id, data);
        } catch (e) {
            setCandidates(previous);
            throw e;
        }
    }, []);

    const deleteCandidate = useCallback(async (id: string) => {
        const previous = candidatesRef.current;
        setCandidates(prev => prev.filter(c => String(c.id) !== String(id)));
        try {
            await CandidateService.deleteCandidate(id);
        } catch (e) {
            setCandidates(previous);
            throw e;
        }
    }, []);

    const addFeedback = useCallback(async (candidateId: string, feedback: CandidateFeedbackInput) => {
        await CandidateService.addFeedback(candidateId, feedback);
        await loadCandidates();
    }, [loadCandidates]);

    const refresh = useCallback(async () => {
        await loadCandidates();
    }, [loadCandidates]);

    const searchCandidates = useCallback(async (filters: CandidateSearchFilters) => {
        setIsLoading(true);
        try {
            const data = await CandidateService.searchCandidates(filters);
            setCandidates(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        candidates,
        isLoading,
        allSkills,
        allLocations,
        addCandidate,
        moveCandidate,
        updateCandidate,
        addFeedback,
        deleteCandidate,
        refresh,
        searchCandidates,
    };
};
