import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CandidateService } from '../src/services/CandidateService';
import { Job, Candidate } from '../types';

export const useCandidateData = () => {
    const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [myApplications, setMyApplications] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const calculateCompleteness = (candidate: Candidate) => {
        const fields: (keyof Candidate)[] = [
            'name', 'phone', 'location', 'summary', 'linkedin', 'github', 'portfolio', 'resume_url', 'avatar'
        ];
        const filled = fields.filter(f => !!candidate[f]).length;
        return Math.round((filled / fields.length) * 100);
    };

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Active Jobs
            const { data: activeJobs, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'Ativa');

            if (!jobsError && activeJobs) {
                setJobs(activeJobs as unknown as Job[]);
            }

            // 2. Fetch All Candidates via Service (which handles mapping)
            const allCandidates = await CandidateService.getCandidates();

            // 3. Fetch Current Auth User
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Filter candidates belonging to this user
                const userProfiles = allCandidates.filter(c => c.user_id === session.user.id);

                if (userProfiles.length > 0) {
                    // The first item is our latest profile
                    setCurrentCandidate(userProfiles[0]);

                    // All items that have a jobId are applications
                    const apps = userProfiles.filter(p => !!p.jobId);
                    setMyApplications(apps);
                }
            }
        } catch (error) {
            console.error('Error refreshing candidate data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const updateProfile = async (data: Partial<Candidate>) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        try {
            // Mapping frontend field names to DB column names
            const dbPayload: any = { ...data };

            if ('jobId' in data) {
                dbPayload.job_id = data.jobId;
                delete dbPayload.jobId;
            }
            if ('columnId' in data) {
                dbPayload.column_id = data.columnId;
                delete dbPayload.columnId;
            }
            if ('avatarColor' in data) {
                dbPayload.avatar_color = data.avatarColor;
                delete dbPayload.avatarColor;
            }
            if ('textColor' in data) {
                dbPayload.text_color = data.textColor;
                delete dbPayload.textColor;
            }

            // Critical: Remove fields that don't exist in DB or shouldn't be updated here
            if ('applied_at' in dbPayload) delete dbPayload.applied_at;
            if ('feedbacks' in dbPayload) delete dbPayload.feedbacks;
            if ('resumeName' in data) {
                dbPayload.resume_name = data.resumeName;
                delete dbPayload.resumeName;
            }

            const { error } = await supabase
                .from('candidates')
                .update(dbPayload)
                .eq('user_id', session.user.id);

            if (error) throw error;

            refreshData();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil.');
        }
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
