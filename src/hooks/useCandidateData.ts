import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@src/lib/supabase';
import { CandidateService } from '@src/services/candidate.service';
import { Job, Candidate, Interview } from '@src/types';

import { useAuth } from '@src/context/AuthContext';

export const useCandidateData = () => {
    const { refreshProfile } = useAuth();
    const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [myApplications, setMyApplications] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const calculateCompleteness = (candidate: Candidate) => {
        const weightedFields = [
            { field: 'name', weight: 10 },
            { field: 'phone', weight: 10 },
            { field: 'location', weight: 10 },
            { field: 'summary', weight: 15 },
            { field: 'has_resume', weight: 20 },
            { field: 'avatar', weight: 5 },
            { field: 'linkedin', weight: 5 },
            { field: 'experience', weight: 15 }, // Se tiver pelo menos 1
            { field: 'education', weight: 10 },   // Se tiver pelo menos 1
        ];

        let totalScore = 0;
        let maxScore = 0;

        weightedFields.forEach(({ field, weight }) => {
            maxScore += weight;
            const value = candidate[field as keyof Candidate];
            
            if (Array.isArray(value)) {
                if (value.length > 0) totalScore += weight;
            } else if (!!value) {
                totalScore += weight;
            }
        });

        return Math.min(100, Math.round((totalScore / maxScore) * 100));
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

            // Buscar entrevistas para todas as candidaturas deste usuário
            const appIds = (applicationRows || []).map(a => a.id).filter(Boolean);
            let interviewsByAppId = new Map<string, Interview[]>();

            if (appIds.length > 0) {
                const { data: interviewRows } = await supabase
                    .from('interviews')
                    .select('id, candidate_id, job_id, title, type, starts_at, status')
                    .in('candidate_id', appIds)
                    .in('status', ['scheduled', 'rescheduled']);

                if (interviewRows) {
                    interviewRows.forEach(iv => {
                        const key = iv.candidate_id as string;
                        if (!interviewsByAppId.has(key)) interviewsByAppId.set(key, []);
                        interviewsByAppId.get(key)!.push(iv as Interview);
                    });
                }
            }

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
                    linkedin: userData?.linkedin || '',
                    github: userData?.github || '',
                    portfolio: userData?.portfolio || '',
                    role: 'Candidato',
                    status: 'Novo',
                    columnId: 'received'
                };
                setCurrentCandidate(fallbackProfile as Candidate);
            }

            const now = new Date().toISOString();

            const mappedApplications = (applicationRows || []).map(app => {
                const appInterviews = interviewsByAppId.get(app.id as string) || [];
                const future = appInterviews
                    .filter(iv => iv.starts_at > now)
                    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));

                const next = future[0];
                const nextInterview = next
                    ? {
                          type: next.type || 'Entrevista',
                          date: new Date(next.starts_at).toLocaleDateString('pt-BR'),
                          time: new Date(next.starts_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                          }),
                      }
                    : undefined;

                return {
                    ...app,
                    jobId: app.job_id,
                    columnId: app.column_id || 'received',
                    nextInterview,
                };
            });

            setMyApplications(mappedApplications as unknown as Candidate[]);

            // 3. Fetch vagas relacionadas às candidaturas (mesmo que não estejam mais 'Ativas')
            const jobIds = (applicationRows || []).map(a => a.job_id).filter(Boolean);
            
            if (jobIds.length > 0) {
                const { data: relevantJobs, error: jobsError } = await supabase
                    .from('jobs')
                    .select('id, title, status, department, location, model, contract')
                    .in('id', jobIds);

                if (!jobsError && relevantJobs) {
                    setJobs(relevantJobs as unknown as Job[]);
                }
            } else {
                // Caso não tenha candidaturas, pode buscar algumas ativas para recomendação futuramente
                setJobs([]);
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
