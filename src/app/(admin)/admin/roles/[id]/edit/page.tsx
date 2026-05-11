'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useRoles } from '@src/hooks/useRoles';
import DynamicListInput from '@src/components/shared/DynamicListInput';
import { JobService } from '@src/services/job.service';
import { DEPARTMENT_AREAS } from '@src/constants/departments';
import { Role } from '@src/types';
import { Icon } from "@iconify/react";

const EditRolePage: React.FC = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { roles, updateRole } = useRoles();

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        area: '',
        level: 1,
        mission: '',
        requirements_technical: [] as string[],
        requirements_behavioral: [] as string[],
        kpis: [] as string[],
        competencies: [] as string[],
        status: 'Ativo',
        reports_to: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const role = roles.find((r: Role) => r.id === id);
        if (role) {
            setFormData({
                title: role.title || '',
                department: role.department || '',
                area: role.area || '',
                level: role.level || 1,
                mission: role.mission || '',
                requirements_technical: typeof role.requirements_technical === 'string' ? role.requirements_technical.split('\n').filter(Boolean) : (Array.isArray(role.requirements_technical) ? role.requirements_technical : []),
                requirements_behavioral: typeof role.requirements_behavioral === 'string' ? role.requirements_behavioral.split('\n').filter(Boolean) : (Array.isArray(role.requirements_behavioral) ? role.requirements_behavioral : []),
                kpis: typeof role.kpis === 'string' ? role.kpis.split('\n').filter(Boolean) : (Array.isArray(role.kpis) ? role.kpis : []),
                competencies: typeof role.competencies === 'string' ? role.competencies.split('\n').filter(Boolean) : (Array.isArray(role.competencies) ? role.competencies : []),
                status: role.status || 'Ativo',
                reports_to: role.reports_to || ''
            });
        }
    }, [roles, id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'level' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            setIsSaving(true);
            try {
                await updateRole(id, {
                    ...formData,
                    status: formData.status as 'Ativo' | 'Inativo',
                    requirements_technical: formData.requirements_technical.join('\n'),
                    requirements_behavioral: formData.requirements_behavioral.join('\n'),
                    kpis: formData.kpis.join('\n'),
                    competencies: formData.competencies.join('\n')
                });

                await JobService.syncJobsByRole(id, {
                    title: formData.title,
                    department: formData.department
                });

                router.push('/admin/roles');
            } catch (error) {
                console.error('Error updating role:', error);
                alert('Erro ao atualizar cargo. Tente novamente.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background transition-colors duration-200 ease-in-out">
            <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shrink-0 sticky top-0 transition-colors">
                <div className="mb-3">
                    <Breadcrumbs items={[
                        { label: 'Cargos', to: '/admin/roles' },
                        { label: 'Editar Cargo' }
                    ]} />
                </div>
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold text-foreground tracking-tight transition-colors">Editar Cargo</h1>
                            {(() => {
                                const currentRole = roles.find((r: Role) => r.id === id);
                                return currentRole?.code ? (
                                    <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 border border-border/40 px-2.5 py-1 rounded-md tracking-wider">
                                        {currentRole.code}
                                    </span>
                                ) : null;
                            })()}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1 transition-colors">Atualize os detalhes do cargo selecionado abaixo.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/admin/roles')}
                            className="h-10 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-2xl hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="flex items-center gap-2.5 h-10 px-6 bg-primary text-primary-foreground border border-border/40 rounded-2xl text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                        >
                            <Icon icon={isSaving ? "material-symbols:progress-activity" : "material-symbols:save"} className="text-[20px]" width="20" height="20" />
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-8 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto pb-24">
                    <div className="border border-border bg-card rounded-2xl transition-colors overflow-hidden">
                        <form className="divide-y divide-border" onSubmit={handleSubmit}>
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center transition-all">
                                        <Icon icon="material-symbols:badge" className="text-[20px]" width="20" height="20" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Dados Cadastrais</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="title">
                                            Nome do Cargo <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="area">
                                            Área <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="area" name="area" type="text" value={formData.area} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="reports_to">
                                            Reporta a <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="reports_to" name="reports_to" type="text" value={formData.reports_to} onChange={handleInputChange} required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center transition-all">
                                        <Icon icon="material-symbols:clinical-notes" className="text-[20px]" width="20" height="20" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Requisitos e Competências</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">Requisitos Técnicos</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: React, SQL, Inglês..."
                                            items={formData.requirements_technical}
                                            onChange={(items: string[]) => setFormData(prev => ({ ...prev, requirements_technical: items }))}
                                            icon="engineering"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">Requisitos Comportamentais</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: Liderança, Comunicação..."
                                            items={formData.requirements_behavioral}
                                            onChange={(items: string[]) => setFormData(prev => ({ ...prev, requirements_behavioral: items }))}
                                            icon="psychology"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">KPIs (Indicadores de Desempenho)</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: Tempo de resposta, Satisfação..."
                                            items={formData.kpis}
                                            onChange={(items: string[]) => setFormData(prev => ({ ...prev, kpis: items }))}
                                            icon="insights"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">Competências Obrigatórias</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: Resolução de conflitos..."
                                            items={formData.competencies}
                                            onChange={(items: string[]) => setFormData(prev => ({ ...prev, competencies: items }))}
                                            icon="stars"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center transition-all">
                                        <Icon icon="material-symbols:description" className="text-[20px]" width="20" height="20" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Escopo do Cargo</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="mission">
                                            Missão <span className="text-destructive">*</span>
                                        </label>
                                        <textarea
                                            className="block w-full h-24 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-3.5 text-sm resize-none placeholder:text-muted-foreground"
                                            id="mission" name="mission" placeholder="Descreva o propósito principal deste cargo..."
                                            value={formData.mission} onChange={handleInputChange} required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditRolePage;
