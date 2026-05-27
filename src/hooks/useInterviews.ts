'use client';

import { useState, useEffect, useCallback } from 'react';
import { InterviewService } from '@src/services/interview.service';
import { Interview } from '@src/types';

export const useInterviews = (candidateId?: string) => {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadInterviews = useCallback(async () => {
        setIsLoading(true);
        try {
            let data: Interview[] = [];
            if (candidateId) {
                data = await InterviewService.getInterviewsByCandidate(candidateId);
            } else {
                data = await InterviewService.getInterviews();
            }
            setInterviews(data);
        } catch (error) {
            console.error('[useInterviews] Error loading interviews:', error);
        } finally {
            setIsLoading(false);
        }
    }, [candidateId]);

    useEffect(() => {
        loadInterviews();
    }, [loadInterviews]);

    const addInterview = async (data: Omit<Interview, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
        const result = await InterviewService.addInterview(data);
        if (result) await loadInterviews();
        return result;
    };

    const updateInterview = async (id: string, updates: Partial<Interview>) => {
        const result = await InterviewService.updateInterview(id, updates);
        if (result) await loadInterviews();
        return result;
    };

    const deleteInterview = async (id: string) => {
        const result = await InterviewService.deleteInterview(id);
        if (result) await loadInterviews();
        return result;
    };

    return {
        interviews,
        isLoading,
        refresh: loadInterviews,
        addInterview,
        updateInterview,
        deleteInterview
    };
};
