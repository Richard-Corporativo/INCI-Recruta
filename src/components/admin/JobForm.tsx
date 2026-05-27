'use client';
// @component JobForm | @tipo componente | @versao 1.0.0
// > Formulário completo de criação/edição de vaga
// @api job?: Job (edit mode), onSubmit: fn, onCancel: fn
// @state formData — campos do formulário, errors — validação


import React, { ChangeEvent } from 'react';
import { Icon } from "@iconify/react";
import BenefitsSelector from '@src/components/shared/BenefitsSelector';
import SLAConfig from '@src/components/admin/SLAConfig';
import JobOptionDropdown from '@src/components/admin/JobOptionDropdown';
import RequirementsSelector from '@src/components/shared/RequirementsSelector';

export interface JobFormProps {
    formData: {
        model: string;
        contract: string;
        positionsCount?: number;
        workSchedule?: string;
        registrationDeadline?: string;
        location: string;
        urgency: string;
        salaryMin: string;
        salaryMax: string;
        context: string;
        mission: string;
        seniority: string;
        experienceMin: string;
        requirements: string[];
        requirementsTechnical: string[];
        requirementsBehavioral: string[];
        kpis: string[];
        competencies: string[];
        benefits: string[];
        slaSettings: Record<string, { days: number }>;
    };
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    updateFormData: (updates: Partial<JobFormProps['formData']>) => void;
    showPositionsAndSchedule?: boolean;
    showCoreFields?: boolean;
    showBenefits?: boolean;
    showClassification?: boolean;
    showContext?: boolean;
    showRequirements?: boolean;
    showUrgency?: boolean;
    showSalary?: boolean;
    showResponsibilitiesTab?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
    formData,
    handleInputChange,
    updateFormData,
    showPositionsAndSchedule = true,
    showCoreFields = true,
    showBenefits = true,
    showClassification = true,
    showContext = true,
    showUrgency = true,
    showSalary = true,
    showResponsibilitiesTab = false
}) => {
    return (
        <div className="flex flex-col gap-6">
            {showCoreFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Modelo de trabalho <span className="text-destructive">*</span></label>
                        <JobOptionDropdown
                            label="Selecionar modelo"
                            value={formData.model}
                            icon="material-symbols:work-outline-rounded"
                            onChange={(value) => updateFormData({ model: value })}
                            options={[
                                { label: 'Presencial', value: 'Presencial', badge: 'ON', icon: 'material-symbols:location-city-rounded' },
                                { label: 'Híbrido', value: 'Híbrido', badge: 'HY', icon: 'material-symbols:sync-alt-rounded' },
                                { label: 'Remoto', value: 'Remoto', badge: 'RM', icon: 'material-symbols:public-rounded' }
                            ]}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Tipo de contrato <span className="text-destructive">*</span></label>
                        <JobOptionDropdown
                            label="Selecionar contrato"
                            value={formData.contract}
                            icon="material-symbols:contract-outline-rounded"
                            onChange={(value) => updateFormData({ contract: value })}
                            options={[
                                { label: 'CLT (Efetivo)', value: 'CLT', badge: 'CLT', icon: 'material-symbols:badge-outline-rounded' },
                                { label: 'Pessoa Jurídica (PJ)', value: 'PJ', badge: 'PJ', icon: 'material-symbols:business-center-outline-rounded' },
                                { label: 'Estágio', value: 'Estágio', badge: 'EST', icon: 'material-symbols:school-outline-rounded' },
                                { label: 'Temporário', value: 'Temporário', badge: 'TMP', icon: 'material-symbols:event-repeat-rounded' }
                            ]}
                        />
                    </div>
                </div>
            )}

            {showPositionsAndSchedule && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Quantidade de vagas <span className="text-destructive">*</span></label>
                        <input
                            name="positionsCount"
                            value={formData.positionsCount || 1}
                            onChange={(e) => updateFormData({ positionsCount: parseInt(e.target.value) || 1 })}
                            className="w-full h-11 h-12 rounded-2xl border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                            type="number"
                            min="1"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Jornada/Carga horária <span className="text-destructive">*</span></label>
                        <input
                            name="workSchedule"
                            value={formData.workSchedule || ''}
                            onChange={handleInputChange}
                            className="w-full h-11 h-12 rounded-2xl border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                            placeholder="Ex: Escala 5x2 (44h semanais)"
                            type="text"
                        />
                    </div>
                </div>
            )}

            {showCoreFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Período de inscrição</label>
                        <input
                            name="registrationDeadline"
                            value={formData.registrationDeadline}
                            onChange={handleInputChange}
                            className="w-full h-12 rounded-2xl border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                            type="date"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors flex items-center gap-2">
                            <Icon icon="material-symbols:location-on" className="text-primary h-5 w-5" />
                            Localidade do escritório <span className="text-destructive">*</span>
                        </label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full h-12 rounded-2xl border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring placeholder:text-muted-foreground/40"
                            placeholder="Adicione a cidade"
                            type="text"
                        />
                    </div>
                </div>
            )}

            {(showUrgency || showSalary) && (
                <div className={`grid grid-cols-1 ${showUrgency && showSalary ? 'md:grid-cols-2' : ''} gap-6 p-6 bg-muted/20 rounded-2xl border border-border transition-colors`}>
                    {showUrgency && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Nível de urgência</label>
                            <JobOptionDropdown
                                label="Selecionar urgência"
                                value={formData.urgency}
                                icon="material-symbols:priority-high-rounded"
                                onChange={(value) => updateFormData({ urgency: value })}
                                options={[
                                    { label: 'Baixa', value: 'Baixa', badge: 'BX', icon: 'material-symbols:stat-minus-1-rounded' },
                                    { label: 'Média', value: 'Média', badge: 'MD', icon: 'material-symbols:stat-0-rounded' },
                                    { label: 'Alta', value: 'Alta', badge: 'AL', icon: 'material-symbols:stat-1-rounded' }
                                ]}
                            />
                        </div>
                    )}
                    {showSalary && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-semibold text-muted-foreground transition-colors">
                                Faixa salarial (Mensal)
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">R$</span>
                                    <input
                                        name="salaryMin"
                                        value={formData.salaryMin}
                                        onChange={handleInputChange}
                                        className="w-full h-10 pl-9 pr-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-in-out font-sans"
                                        type="number"
                                        placeholder="Ex: 1500"
                                    />
                                </div>
                                <span className="text-muted-foreground/50 transition-colors">—</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">R$</span>
                                    <input
                                        name="salaryMax"
                                        value={formData.salaryMax}
                                        onChange={handleInputChange}
                                        className="w-full h-10 pl-9 pr-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-in-out font-sans"
                                        type="number"
                                        placeholder="Ex: 3000"
                                    />
                                </div>
                            </div>
                            <p className="text-[9px] text-muted-foreground mt-1 italic font-medium">Insira o valor cheio sem pontos ou vírgulas (Ex: 1500).</p>
                        </div>
                    )}
                </div>
            )}
            
            {showClassification && (
                <div className="p-6 bg-muted/20 rounded-2xl border border-border transition-colors">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex size-8 items-center justify-center rounded-full bg-background border border-border text-foreground">
                            <Icon icon="material-symbols:category" className="text-sm h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="text-sm font-semibold text-foreground">Classificação da Vaga</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest transition-colors">
                                Senioridade <span className="text-destructive">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Júnior', 'Pleno', 'Sênior'].map((level) => (
                                    <label key={level} className="cursor-pointer">
                                        <input
                                            className="peer sr-only" name="seniority" type="radio" value={level}
                                            checked={formData.seniority === level}
                                            onChange={handleInputChange}
                                        />
                                        <div className="flex items-center justify-center rounded-2xl border border-border bg-background py-2 text-[10px] font-semibold text-muted-foreground hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all duration-200 ease-in-out">
                                            {level}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest transition-colors" htmlFor="experienceMin">
                                Experiência Mínima <span className="text-destructive">*</span>
                            </label>
                            <input
                                className="block w-full h-10 rounded-2xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 px-3 placeholder:text-muted-foreground/40"
                                id="experienceMin" name="experienceMin" type="text" value={formData.experienceMin} onChange={handleInputChange} required
                                placeholder="Ex: 2+ anos"
                            />
                        </div>
                    </div>
                </div>
            )}

            {showResponsibilitiesTab && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Requisitos Necessários</label>
                            <RequirementsSelector
                                selectedRequirements={formData.requirementsTechnical}
                                onChange={(items) => updateFormData({ requirementsTechnical: items })}
                                placeholder="Ex: React, Node.js, SQL..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Competências Comportamentais</label>
                            <RequirementsSelector
                                selectedRequirements={formData.competencies}
                                onChange={(items) => updateFormData({ competencies: items })}
                                placeholder="Ex: Liderança, Proatividade..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Requisitos Desejáveis</label>
                            <RequirementsSelector
                                selectedRequirements={formData.requirementsBehavioral}
                                onChange={(items) => updateFormData({ requirementsBehavioral: items })}
                                placeholder="Ex: Inglês avançado, MBA..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Indicadores de Desempenho (KPIs)</label>
                            <RequirementsSelector
                                selectedRequirements={formData.kpis}
                                onChange={(items) => updateFormData({ kpis: items })}
                                placeholder="Ex: Churn rate, NPS..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Icon icon="material-symbols:list-alt-outline" className="text-primary size-4" />
                            Principais Atividades e Responsabilidades
                        </label>
                        <textarea
                            name="responsibilities"
                            value={(formData as any).responsibilities || ''}
                            onChange={handleInputChange}
                            className="w-full h-40 rounded-2xl border border-border bg-background p-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium resize-none hover:border-ring placeholder:text-muted-foreground/40"
                            placeholder="Descreva as tarefas diárias e responsabilidades do cargo... (Dica: Use uma linha para cada atividade)"
                        />
                        <p className="text-[10px] text-muted-foreground italic">Dica: Cada linha escrita aqui aparecerá como um item de lista na página da vaga.</p>
                    </div>
                </div>
            )}

            {showContext && (
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">
                            Missão da Vaga <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            name="mission"
                            value={(formData as any).mission || ''}
                            onChange={handleInputChange}
                            className="w-full h-32 rounded-2xl border border-border bg-background p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium resize-none hover:border-ring placeholder:text-muted-foreground"
                            placeholder="Qual o objetivo principal desta posição?"
                        />
                    </div>

                </div>
            )}

            {showBenefits && (
                <div className="space-y-6">
                    <SLAConfig
                        settings={formData.slaSettings}
                        onChange={(settings) => updateFormData({ slaSettings: settings })}
                    >
                        <BenefitsSelector
                            selectedBenefits={formData.benefits}
                            onChange={(items) => updateFormData({ benefits: items })}
                        />
                    </SLAConfig>
                </div>
            )}
        </div>
    );
};

export default JobForm;
