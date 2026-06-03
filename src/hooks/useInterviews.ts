'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@src/lib/supabase';
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
        if (!candidateId) return;

        const channel = supabase
            .channel(`interviews:${candidateId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'interviews',
                filter: `candidate_id=eq.${candidateId}`,
            }, () => loadInterviews())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [loadInterviews, candidateId]);

    const addInterview = async (data: Omit<Interview, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
        return await InterviewService.addInterview(data);
    };

    const updateInterview = async (id: string, updates: Partial<Interview>) => {
        return await InterviewService.updateInterview(id, updates);
    };

    const deleteInterview = async (id: string) => {
        return await InterviewService.deleteInterview(id);
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
