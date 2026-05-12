'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useJobs } from '@src/hooks/useJobs';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import JobForm from '@src/components/admin/JobForm';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { parseDate } from '@src/lib/formatters';

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
    const { jobs, updateJob, isLoading } = useJobs();
    const { success: toastSuccess, error: toastError } = useToast();
    const [isSaving, setIsSaving] = useState(false);


    const job = jobs.find(j => String(j.id) === String(params?.id));

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
        responsibilities: '',
        reports_to: '',
        requirements: [] as string[],
        benefits: [] as string[],
        slaSettings: {
            'Triagem': { days: 2 },
            'Entrevista': { days: 3 },
            'Aprovação': { days: 1 }
        }
    });

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || '',
                department: job.department || '',
                model: job.model || 'Híbrido',
                contract: job.contract || 'CLT',
                positionsCount: job.positions_count || 1,
                workSchedule: job.work_schedule || '',
                registrationDeadline: parseDate(job.registration_deadline)?.toISOString().split('T')[0] || '',
                location: job.location || 'Barbalha - CE',
                urgency: job.urgency || 'Média',
                salaryMin: job.salary_min?.toString() || '',
                salaryMax: job.salary_max?.toString() || '',
                context: job.context || '',
                responsibilities: job.responsibilities || '',
                reports_to: job.reports_to || '',
                requirements: toStringArray(job.requirements),
                benefits: toStringArray(job.benefits),
                slaSettings: (job.sla_settings as any) || {
                    'Triagem': { days: 2 },
                    'Entrevista': { days: 3 },
                    'Aprovação': { days: 1 }
                }
            });
        }
    }, [job]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateFormData = (updates: any) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                responsibilities: formData.responsibilities || undefined,
                reports_to: formData.reports_to || undefined,
                requirements: formData.requirements,
                benefits: formData.benefits,
                registration_deadline: formData.registrationDeadline || undefined,
                positions_count: formData.positionsCount,
                work_schedule: formData.workSchedule || undefined,
                salary_min: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
                salary_max: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
                sla_settings: formData.slaSettings,
            } as any);
            toastSuccess('Vaga atualizada com sucesso!');
            router.push(`/admin/jobs/${job.id}`);
        } catch (err) {
            console.error(err);
            toastError('Erro ao salvar alterações. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !job) return <div className="p-8">Carregando...</div>;
    if (!job) return <div className="p-8 text-destructive font-bold">Vaga não encontrada</div>;

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 transition-colors">
                <div className="mb-3">
                    <Breadcrumbs items={[{ label: 'Vagas', to: '/jobs' }, { label: job.title, to: `/jobs/${job.id}` }, { label: 'Editar' }]} />
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Editar Vaga: <span className="text-primary">{job.title}</span></h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Atualize as informações da vaga e salve as alterações.</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-card border border-border shadow-sm rounded-xl p-8 space-y-8">
                        {/* Essential Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-muted-foreground transition-colors uppercase tracking-wider">Título da Vaga <span className="text-destructive">*</span></label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-muted-foreground transition-colors uppercase tracking-wider">Departamento <span className="text-destructive">*</span></label>
                                <input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-semibold text-muted-foreground transition-colors uppercase tracking-wider">Gestor(a) <span className="text-destructive">*</span></label>
                                <input
                                    name="reports_to"
                                    value={formData.reports_to}
                                    onChange={handleInputChange}
                                    className="w-full h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground uppercase tracking-widest">
                                Responsabilidades <span className="text-muted-foreground font-normal normal-case tracking-normal">(opcional — aparece na página da vaga)</span>
                            </label>
                            <textarea
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Descreva as principais atividades e responsabilidades do cargo, uma por linha..."
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none text-sm font-semibold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/40 resize-none"
                            />
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
                            className="px-6 h-12 rounded-md text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 h-12 rounded-md text-sm font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5" />
                            ) : (
                                <Icon icon="material-symbols:save" className="w-5 h-5" />
                            )}
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditJob;
