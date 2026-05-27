'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useJobs } from '@src/hooks/useJobs';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import JobForm from '@src/components/admin/JobForm';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { parseDate, formatJobId } from '@src/lib/formatters';
import { JobService } from '@src/services/job.service';
import { Job } from '@src/types';

const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
    if (typeof value !== 'string') return [];

    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
    } catch {
        return value.split('\n').map(item => item.trim()).filter(Boolean);
    }

    return [];
};

const EditJob: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { updateJob } = useJobs();
    const { success: toastSuccess, error: toastError } = useToast();

    const [job, setJob] = useState<Job | null>(null);
    const [isLoadingJob, setIsLoadingJob] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        model: 'Híbrido',
        contract: 'CLT',
        positionsCount: 1,
        workSchedule: '',
        registrationDeadline: '',
        location: 'Barbalha - CE',
        urgency: 'Média',
        salaryMin: '',
        salaryMax: '',
        context: '',
        mission: '',
        responsibilities: '',
        reports_to: '',
        seniority: 'Pleno',
        experienceMin: '',
        requirements: [] as string[],
        requirementsTechnical: [] as string[],
        requirementsBehavioral: [] as string[],
        kpis: [] as string[],
        competencies: [] as string[],
        benefits: [] as string[],
        slaSettings: {
            'Triagem': { days: 2 },
            'Entrevista': { days: 3 },
            'Aprovação': { days: 1 }
        }
    });

    useEffect(() => {
        if (!id) return;
        setIsLoadingJob(true);
        JobService.getJobById(id).then((data) => {
            if (data) {
                setJob(data);
                setFormData({
                    title: data.title || '',
                    department: data.department || '',
                    model: data.model || 'Híbrido',
                    contract: data.contract || 'CLT',
                    positionsCount: data.positions_count || 1,
                    workSchedule: data.work_schedule || '',
                    registrationDeadline: parseDate(data.registration_deadline)?.toISOString().split('T')[0] || '',
                    location: data.location || 'Barbalha - CE',
                    urgency: data.urgency || 'Média',
                    salaryMin: data.salary_min?.toString() || '',
                    salaryMax: data.salary_max?.toString() || '',
                    seniority: data.seniority || 'Pleno',
                    context: data.context || '',
                    mission: data.mission || '',
                    responsibilities: data.responsibilities || '',
                    reports_to: data.reports_to || '',
                    experienceMin: data.experience_min || '',
                    requirements: toStringArray(data.requirements),
                    requirementsTechnical: toStringArray(data.requirements_technical),
                    requirementsBehavioral: toStringArray(data.requirements_behavioral),
                    kpis: toStringArray(data.kpis),
                    competencies: toStringArray(data.competencies),
                    benefits: toStringArray(data.benefits),
                    slaSettings: (data.sla_settings as any) || {
                        'Triagem': { days: 2 },
                        'Entrevista': { days: 3 },
                        'Aprovação': { days: 1 }
                    }
                });
            }
            setIsLoadingJob(false);
        });
    }, [id]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateFormData = (updates: any) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!job) return;

        setIsSaving(true);
        try {
            await updateJob(job.id, {
                title: formData.title,
                department: formData.department,
                model: formData.model,
                contract: formData.contract,
                location: formData.location,
                urgency: formData.urgency,
                context: formData.context,
                mission: formData.mission,
                responsibilities: formData.responsibilities || undefined,
                reports_to: formData.reports_to || undefined,
                experience_min: formData.experienceMin || undefined,
                requirements: formData.requirements,
                requirements_technical: formData.requirementsTechnical,
                requirements_behavioral: formData.requirementsBehavioral,
                kpis: formData.kpis,
                competencies: formData.competencies,
                benefits: formData.benefits,
                registration_deadline: formData.registrationDeadline || undefined,
                positions_count: formData.positionsCount,
                work_schedule: formData.workSchedule || undefined,
                salary_min: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
                salary_max: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
                seniority: formData.seniority,
                sla_settings: formData.slaSettings,
            } as any);
            toastSuccess('Vaga atualizada com sucesso!');
            router.push(`/admin/jobs/${job.id}`);
        } catch (err) {
            console.error(err);
            toastError('Erro ao salvar alterações. Tente novamente.');
            setIsSaving(false);
        }
    };

    if (isLoadingJob) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shrink-0 transition-colors">
                    <div className="mb-3">
                        <Breadcrumbs items={[{ label: 'Vagas', to: '/admin/jobs' }, { label: 'Editar Vaga' }]} />
                    </div>
                    <h1 className="text-3xl font-semibold text-foreground tracking-tight">Editar Vaga</h1>
                    <p className="text-sm text-muted-foreground mt-1">Carregando dados da vaga...</p>
                </header>
                <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
                    <Icon icon="material-symbols:progress-activity" className="text-[32px] text-muted-foreground animate-spin" width="32" height="32" />
                </main>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shrink-0 transition-colors">
                    <div className="mb-3">
                        <Breadcrumbs items={[{ label: 'Vagas', to: '/admin/jobs' }, { label: 'Editar Vaga' }]} />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    <p className="text-destructive font-bold">Vaga não encontrada.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 transition-colors">
                <div className="mb-3">
                    <Breadcrumbs items={[{ label: 'Vagas', to: '/admin/jobs' }, { label: job.title, to: `/admin/jobs/${job.id}` }, { label: 'Editar' }]} />
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Editar Vaga: <span className="text-primary">{job.title}</span></h1>
                            {job.job_number && (
                                <span className="text-xs font-semibold text-muted-foreground/60 tracking-widest">
                                    {formatJobId(job.job_number)}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Atualize as informações da vaga e salve as alterações.</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form id="edit-job-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Título da Vaga <span className="text-destructive">*</span></label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="block w-full h-11 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Departamento/Setor <span className="text-destructive">*</span></label>
                                <input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="block w-full h-11 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gestor(a)</label>
                                <input
                                    name="reports_to"
                                    value={formData.reports_to}
                                    onChange={handleInputChange}
                                    className="block w-full h-11 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                />
                            </div>
                        </div>

                        <JobForm
                            formData={formData as any}
                            handleInputChange={handleInputChange}
                            updateFormData={updateFormData}
                        />
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="h-10 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-2xl hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="edit-job-form"
                            disabled={isSaving}
                            className="flex items-center gap-2.5 h-10 px-6 bg-primary text-primary-foreground border border-border/40 rounded-2xl text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                        >
                            <Icon icon={isSaving ? "material-symbols:progress-activity" : "material-symbols:save"} className={`text-[20px]${isSaving ? ' animate-spin' : ''}`} width="20" height="20" />
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditJob;
