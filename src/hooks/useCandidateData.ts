import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@src/lib/supabase';
import { CandidateService } from '@src/services/candidate.service';
import { Job, Candidate } from '@src/types';

import { useAuth } from '@src/context/AuthContext';

export const useCandidateData = () => {
    const { refreshProfile } = useAuth();
    const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [myApplications, setMyApplications] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const calculateCompleteness = (candidate: Candidate) => {
        const fields: (keyof Candidate)[] = [
            'name', 'phone', 'location', 'summary', 'linkedin', 'github', 'portfolio', 'has_resume', 'avatar'
        ];
        const filled = fields.filter(f => !!candidate[f]).length;
        return Math.round((filled / fields.length) * 100);
    };

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Sessão do usuário atual
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setIsLoading(false);
                return;
            }

            // 2. Perfil base e candidaturas são registros diferentes.
            const { data: baseProfile, error: baseProfileError } = await supabase
                .from('candidates')
                .select('*')
                .eq('user_id', session.user.id)
                .is('job_id', null)
                .order('applied_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (baseProfileError) throw baseProfileError;

            const { data: applicationRows, error: applicationsError } = await supabase
                .from('candidates')
                .select('*')
                .eq('user_id', session.user.id)
                .not('job_id', 'is', null)
                .order('applied_at', { ascending: false });

            if (applicationsError) throw applicationsError;

            if (baseProfile) {
                const profile = baseProfile;

                // Avatar via URL pública/assinada (não BLOB bruto)
                if (profile.has_avatar) {
                    try {
                        const avatarUrl = await CandidateService.getAvatarUrl(profile.id);
                        if (avatarUrl) profile.avatar = avatarUrl;
                    } catch (err) {
                        console.warn('Failed to fetch avatar URL:', err);
                    }
                }

                setCurrentCandidate(profile as unknown as Candidate);
            } else {
                // Fallback: Se não existe na tabela 'candidates', criamos um objeto base com dados da sessão/users
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                const fallbackProfile: Partial<Candidate> = {
                    user_id: session.user.id,
                    name: userData?.name || session.user.user_metadata?.name || 'Candidato',
                    email: session.user.email || '',
                    phone: userData?.phone || '',
                    location: userData?.location || '',
                    role: 'Candidato',
                    status: 'Novo',
                    columnId: 'received'
                };
                setCurrentCandidate(fallbackProfile as Candidate);
            }

            setMyApplications((applicationRows || []) as unknown as Candidate[]);

            // 3. Fetch vagas ativas (apenas as necessárias para o dashboard e candidaturas)
            const { data: activeJobs, error: jobsError } = await supabase
                .from('jobs')
                .select('id, title, status, department, location, model, contract')
                .eq('status', 'Ativa');

            if (!jobsError && activeJobs) {
                setJobs(activeJobs as unknown as Job[]);
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
        if (!session?.user) throw new Error('Sessão expirada. Faça login novamente.');

        try {
            // Mapping frontend field names to DB column names
            const dbPayload: any = {};
            
            // Somente incluir campos que não sejam undefined
            Object.keys(data).forEach(key => {
                const val = (data as any)[key];
                if (val !== undefined) {
                    dbPayload[key] = val;
                }
            });

            // Tratamento de campos numéricos (pretensão salarial)
            if (dbPayload.pretension_min === '') dbPayload.pretension_min = null;
            if (dbPayload.pretension_max === '') dbPayload.pretension_max = null;
            if (typeof dbPayload.pretension_min === 'string') dbPayload.pretension_min = Number(dbPayload.pretension_min);
            if (typeof dbPayload.pretension_max === 'string') dbPayload.pretension_max = Number(dbPayload.pretension_max);

            if ('jobId' in dbPayload) {
                dbPayload.job_id = dbPayload.jobId;
                delete dbPayload.jobId;
            }
            if ('columnId' in dbPayload) {
                dbPayload.column_id = dbPayload.columnId;
                delete dbPayload.columnId;
            }
            if ('avatarColor' in dbPayload) {
                dbPayload.avatar_color = dbPayload.avatarColor;
                delete dbPayload.avatarColor;
            }
            if ('textColor' in dbPayload) {
                dbPayload.text_color = dbPayload.textColor;
                delete dbPayload.textColor;
            }
            if ('resumeName' in dbPayload) {
                dbPayload.resume_name = dbPayload.resumeName;
                delete dbPayload.resumeName;
            }

            // Critical: Remove fields that don't exist in DB or shouldn't be updated here
            const forbiddenFields = ['applied_at', 'feedbacks', 'avatar', 'has_avatar', 'id', 'user_id', 'email', 'initials'];
            forbiddenFields.forEach(field => {
                if (field in dbPayload) delete dbPayload[field];
            });

            const { data: existingProfiles } = await supabase
                .from('candidates')
                .select('id')
                .eq('user_id', session.user.id)
                .is('job_id', null)
                .order('applied_at', { ascending: false })
                .limit(1);

            if (!existingProfiles || existingProfiles.length === 0) {
                // Se não tem nenhum perfil, cria um "perfil base" (sem job_id)
                const basePayload = {
                    ...dbPayload,
                    job_id: null,
                    user_id: session.user.id,
                    name: data.name || session.user.user_metadata?.name || 'Candidato',
                    email: session.user.email,
                    initials: ((data.name || session.user.user_metadata?.name || 'C').substring(0, 2)).toUpperCase(),
                    column_id: 'received',
                    avatar_color: 'bg-foreground',
                    text_color: 'text-background'
                };
                
                const { error: insertError } = await supabase
                    .from('candidates')
                    .insert([basePayload]);
                    
                if (insertError) throw insertError;
            } else {
                const { data: updatedRows, error } = await supabase
                    .from('candidates')
                    .update(dbPayload)
                    .eq('id', existingProfiles[0].id)
                    .select('id');

                if (error) throw error;
                if (!updatedRows || updatedRows.length === 0) console.warn('[updateProfile] UPDATE retornou 0 rows — user_id pode não corresponder.');
            }

            // Sync with public.users profile
            const userUpdatePayload: any = {};
            if (data.name) userUpdatePayload.name = data.name;
            if (data.phone) userUpdatePayload.phone = data.phone;
            if (data.location) userUpdatePayload.location = data.location;
            if (data.linkedin) userUpdatePayload.linkedin = data.linkedin;
            if (data.portfolio) userUpdatePayload.portfolio = data.portfolio;
            if (data.summary) userUpdatePayload.summary = data.summary;
            if (data.resumeName) userUpdatePayload.resume_name = data.resumeName;
            
            if (Object.keys(userUpdatePayload).length > 0) {
                try {
                    await supabase
                        .from('users')
                        .update(userUpdatePayload)
                        .eq('id', session.user.id);
                } catch (syncErr) {
                    console.warn('Sync error ignored:', syncErr);
                }
            }

            // Sync with local AuthContext to update header/sidebar immediately
            try {
                await refreshProfile();
            } catch (e) {
                console.warn('RefreshProfile error:', e);
            }

            await refreshData();
        } catch (error: any) {
            console.error('Detailed Error updating profile:', error);
            throw new Error(error.message || error.details || 'Falha ao salvar as configurações. Verifique os dados e tente novamente.');
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
