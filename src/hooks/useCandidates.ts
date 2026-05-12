'use client';

import { useState, useEffect, useCallback } from 'react';
import { CandidateService } from '@src/services/candidate.service';
import { Candidate, KanbanColumnId } from '@src/types';

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
            const candidatesWithAvatars = await Promise.all((data || []).map(async (c) => {
                if (c.has_avatar) {
                    try {
                        const avatarUrl = await Promise.race([
                            CandidateService.getAvatarUrl(c.id),
                            new Promise<null>(res => setTimeout(() => res(null), 3000))
                        ]);
                        if (avatarUrl) return { ...c, avatar: avatarUrl };
                    } catch (err) {
                        console.warn(`Failed to fetch avatar for candidate ${c.id}:`, err);
                    }
                }
                return c;
            }));
            setCandidates(candidatesWithAvatars);
        } finally {
            setIsLoading(false);
        }
    }, [jobId]);

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

    const searchCandidates = useCallback(async (filters: any) => {
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
