'use client';

// @page EditRole | @tipo page-component | @versao 1.0.0
// > Edição de cargo/perfil — permissões, escopo, update
// @calls useRoles — fetchById/update, useParams — role id

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@src/lib/router-compat';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useRoles } from '@src/hooks/useRoles';
import RequirementsSelector from '@src/components/shared/RequirementsSelector';
import DynamicListInput from '@src/components/shared/DynamicListInput';
import { JobService } from '@src/services/job.service';
import { DEPARTMENT_AREAS } from '@src/constants/departments';
import { useAuth } from '@src/hooks/useAuth';
import type { Role } from '@src/types';
import { Icon } from "@iconify/react";

const EditRole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { roles, updateRole } = useRoles();
    const { user } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        if (user && user.role === 'manager') {
            setIsAuthorized(false);
            navigate('/roles');
        }
    }, [user, navigate]);

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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const role = roles.find(r => r.id === id);
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
            setIsLoading(true);
            try {
                await updateRole(id, {
                    ...formData,
                    status: formData.status as Role['status'],
                    requirements_technical: formData.requirements_technical.join('\n'),
                    requirements_behavioral: formData.requirements_behavioral.join('\n'),
                    kpis: formData.kpis.join('\n'),
                    competencies: formData.competencies.join('\n')
                });

                // Sync with Jobs using role_id
                await JobService.syncJobsByRole(id, {
                    title: formData.title,
                    department: formData.department
                });

                navigate('/roles');
            } catch (error) {
                console.error('Error updating role:', error);
                alert('Erro ao atualizar cargo. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!isAuthorized) return null;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200 ease-in-out">
            {/* Header */}
            <header className="bg-card -b - z-20 shrink-0 sticky top-0 transition-colors p-6">
                <div className="mb-3">
                    <Breadcrumbs items={[
                        { label: 'Cargos', to: '/roles' },
                        { label: 'Editar Cargo' }
                    ]} />
                </div>
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground tracking-tight transition-colors">Editar Cargo</h1>
                        <p className="text-muted-foreground text-sm mt-1 transition-colors">Atualize os detalhes do cargo selecionado abaixo.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/roles')}
                            className="h-10 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-xl hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center gap-2.5 h-10 px-6 bg-primary text-primary-foreground border border-border/40 rounded-xl text-sm font-semibold /20 transition-all duration-200 ease-in-out hover:bg-primary/90 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon icon="material-symbols:{isLoading ? 'progress-activity' : 'save'}" className="text-[20px]" width="20" height="20" />
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-8 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto pb-24">

                    {/* Main Form Card */}
                    <div className="bg-card rounded-2xl transition-colors overflow-hidden p-6">
                        <form className="divide-y divide-border" onSubmit={handleSubmit}>
                            {/* Section 1: Dados Cadastrais */}
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center justify-between gap-3 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center /20 transition-all">
                                            <Icon icon="material-symbols:badge" className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Dados Cadastrais</h3>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60 font-mono tracking-wide">Código auto-gerado</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="title">
                                            Nome do Cargo <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="area">
                                            Área de Atuação<span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="area" name="area" type="text" value={formData.area} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="reports_to">
                                            Reporta a <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="reports_to" name="reports_to" type="text" value={formData.reports_to} onChange={handleInputChange} required
                                        />
                                    </div>
                                    
                                </div>
                            </div>



                            {/* Section 3: Requisitos Detalhados */}
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center /20 transition-all">
                                        <Icon icon="material-symbols:clinical-notes" className="h-5 w-5" aria-hidden="true" />
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
                                            onChange={(items) => setFormData(prev => ({ ...prev, requirements_technical: items }))}
                                            icon="engineering"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">Requisitos Comportamentais</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: Liderança, Comunicação..."
                                            items={formData.requirements_behavioral}
                                            onChange={(items) => setFormData(prev => ({ ...prev, requirements_behavioral: items }))}
                                            icon="psychology"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">KPIs (Indicadores de Desempenho)</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: Tempo de resposta, Satisfação..."
                                            items={formData.kpis}
                                            onChange={(items) => setFormData(prev => ({ ...prev, kpis: items }))}
                                            icon="insights"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-foreground">Competências Obrigatórias</label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Ex: Resolução de conflitos..."
                                            items={formData.competencies}
                                            onChange={(items) => setFormData(prev => ({ ...prev, competencies: items }))}
                                            icon="stars"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Missão e Responsabilidades */}
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center /20 transition-all">
                                        <Icon icon="material-symbols:description" className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Escopo do Cargo</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="mission">
                                            Missão <span className="text-destructive">*</span>
                                        </label>
                                        <textarea
                                            className="block w-full h-24 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-3.5 text-sm resize-none placeholder:text-muted-foreground"
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

export default EditRole;
