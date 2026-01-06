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

            // NOTE: Fields 'role', 'github', 'summary', 'education' are expected in DB (run migration 005)

            if ('resumeName' in data) {
                dbPayload.resume_name = data.resumeName;
                delete dbPayload.resumeName;
            }

            const { error } = await supabase
                .from('candidates')
                .update(dbPayload)
                .eq('user_id', session.user.id);

            if (error) throw error;

            // Sync with public.users profile
            // Only update fields that definitely exist in the users table to avoid errors
            const userUpdatePayload: any = {};
            if (data.name) userUpdatePayload.name = data.name;
            if (data.phone) userUpdatePayload.phone = data.phone;
            if (data.location) userUpdatePayload.location = data.location;
            if (data.linkedin) userUpdatePayload.linkedin = data.linkedin;
            if (data.portfolio) userUpdatePayload.portfolio = data.portfolio;
            if (data.summary) userUpdatePayload.summary = data.summary;
            if (data.resumeName) userUpdatePayload.resume_name = data.resumeName;
            if ((data as any).resume_url) userUpdatePayload.resume_url = (data as any).resume_url;

            // Skip complex fields for users table unless we are sure they exist
            // if (data.skills) userUpdatePayload.skills = data.skills;
            // if (data.languages) userUpdatePayload.languages = data.languages;
            // if (data.education) userUpdatePayload.education = data.education;
            // if (data.experience) userUpdatePayload.experience = data.experience;

            if (Object.keys(userUpdatePayload).length > 0) {
                // Wrap in try-catch specifically for users table sync so it doesn't fail the main candidate update
                try {
                    const { error: userError } = await supabase
                        .from('users')
                        .update(userUpdatePayload)
                        .eq('id', session.user.id);

                    if (userError) {
                        console.warn('Warning: Could not sync with users table:', userError.message);
                        // Do not throw here, as main candidate update succeeded
                    }
                } catch (syncErr) {
                    console.warn('Warning: Sync error ignored:', syncErr);
                }
            }

            refreshData();
        } catch (error: any) {
            console.error('Detailed Error updating profile:', error);
            // Re-throw to be handled by the UI (Toast)
            throw new Error(error.message || error.details || 'Falha desconhecida ao atualizar perfil');
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
