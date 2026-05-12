'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs } from '@src/hooks/useJobs';
import { useRoles } from '@src/hooks/useRoles';
import { useAuth } from '@src/context/AuthContext';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import JobForm from '@src/components/admin/JobForm';
import JobOptionDropdown from '@src/components/admin/JobOptionDropdown';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { Role } from '@src/types';

interface RoleDropdownProps {
    roles: Role[];
    value: string;
    onChange: (roleId: string) => void;
    isLoading: boolean;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ roles, value, onChange, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeRoles = roles.filter(r => r.status === 'Ativo');
    const filtered = activeRoles.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.department.toLowerCase().includes(search.toLowerCase())
    );
    const selected = activeRoles.find(r => r.id === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        else setSearch('');
    }, [isOpen]);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                disabled={isLoading}
                className="group flex h-11 w-full items-center rounded-xl border border-border bg-background px-3 text-left transition-all duration-200 ease-in-out hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <Icon icon="material-symbols:badge" className="size-4 shrink-0 text-muted-foreground" />
                <span className={`ml-2.5 flex-1 truncate text-sm font-semibold ${selected ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                    {isLoading ? 'Carregando cargos...' : selected ? `${selected.title} · ${selected.department}` : 'Selecionar um Cargo'}
                </span>
                <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-200 shadow-lg">
                    {/* Busca */}
                    <div className="border-b border-border/50 bg-muted/30 p-3">
                        <div className="flex h-9 items-center rounded-xl border border-border bg-background px-3 ring-primary/20 transition-all focus-within:ring-2">
                            <Icon icon="material-symbols:search" className="size-4 shrink-0 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar cargo ou departamento..."
                                className="ml-2 flex-1 bg-transparent text-xs font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    {/* Lista com scroll */}
                    <div className="max-h-60 overflow-y-auto" role="listbox">
                        {/* Opção vazia */}
                        <button
                            type="button"
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className="flex w-full items-center gap-2 border-b border-border/10 px-4 py-3 text-left transition-colors hover:bg-primary/5"
                            role="option"
                            aria-selected={!value}
                        >
                            <span className="text-xs font-semibold text-muted-foreground italic">Nenhum (preencher manualmente)</span>
                            {!value && <Icon icon="material-symbols:check-circle-rounded" className="ml-auto size-4 text-primary" />}
                        </button>

                        {filtered.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-muted-foreground">Nenhum cargo encontrado</div>
                        ) : (
                            filtered.map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => { onChange(role.id); setIsOpen(false); }}
                                    className="group flex w-full items-center justify-between border-b border-border/10 px-4 py-3 text-left transition-colors last:border-none hover:bg-primary/5"
                                    role="option"
                                    aria-selected={role.id === value}
                                >
                                    <span className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-xs font-bold text-foreground group-hover:text-primary truncate">{role.title}</span>
                                        <span className="text-[10px] text-muted-foreground">{role.department}</span>
                                    </span>
                                    {role.id === value
                                        ? <Icon icon="material-symbols:check-circle-rounded" className="ml-3 size-4 shrink-0 text-primary" />
                                        : <span className="ml-3 shrink-0 text-[9px] font-bold uppercase text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded border border-border/50">{role.code}</span>
                                    }
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const CreateJob: React.FC = () => {
    const router = useRouter();
    const { addJob } = useJobs();
    const { roles, isLoading: isLoadingRoles } = useRoles();
    const { user } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '', department: '', model: 'Híbrido', contract: 'CLT',
        positionsCount: 1, workSchedule: '', registrationDeadline: '',
        location: '', urgency: 'Média',
        salaryMin: '', salaryMax: '', context: '',
        seniority: 'Pleno', experienceMin: '',
        requirements: [] as string[], benefits: [] as string[],
        responsibilities: '',
        reports_to: '',
        role_id: '',
        slaSettings: { 'Triagem': { days: 2 }, 'Entrevista': { days: 3 }, 'Aprovação': { days: 1 } }
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const updateFormData = (updates: any) => setFormData(prev => ({ ...prev, ...updates }));

    const handleRoleChange = (roleId: string) => {
        setSelectedRoleId(roleId);
        const role = roles.find(r => r.id === roleId);
        if (role) {
            updateFormData({
                title: role.title,
                department: role.area || role.department,
                salaryMin: role.salary_min?.toString() || '',
                salaryMax: role.salary_max?.toString() || '',
                seniority: role.seniority || 'Pleno',
                experienceMin: role.experience_min || '',
                requirements: role.requirements ? role.requirements.split('\n') : [],
                context: role.mission || '',
                reports_to: role.reports_to || '',
                role_id: role.id
            });
        }
    };

    const buildJobPayload = (status: string, approvalStatus: string, workflowStatus: string) => ({
        title: formData.title,
        department: formData.department,
        model: formData.model,
        contract: formData.contract,
        location: formData.location,
        urgency: formData.urgency,
        context: formData.context,
        seniority: formData.seniority,
        requirements: formData.requirements,
        benefits: formData.benefits,
        role_id: formData.role_id || undefined,
        status,
        workflow_status: workflowStatus,
        approval_status: approvalStatus,
        manager_id: user?.id || '',
        registration_deadline: formData.registrationDeadline || undefined,
        positions_count: formData.positionsCount,
        work_schedule: formData.workSchedule || undefined,
        salary_min: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
        salary_max: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
        experience_min: formData.experienceMin || undefined,
        reports_to: formData.reports_to || undefined,
        sla_settings: formData.slaSettings,
        responsibilities: formData.responsibilities || undefined,
    } as any);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;
        setIsSaving(true);
        try {
            await addJob(buildJobPayload('Rascunho', 'Rascunho', 'draft'));
            toastSuccess('Rascunho salvo com sucesso!');
            router.push('/admin/jobs');
        } catch (err) {
            console.error(err);
            toastError('Erro ao salvar rascunho. Tente novamente.');
        } finally { setIsSaving(false); }
    };

    const handleApprove = async () => {
        if (!formData.title) return;
        setIsSaving(true);
        try {
            await addJob(buildJobPayload('Ativa', 'Aprovado', 'published'));
            toastSuccess('Vaga publicada com sucesso!');
            router.push('/admin/jobs');
        } catch (err) {
            console.error(err);
            toastError('Erro ao publicar vaga. Tente novamente.');
        } finally { setIsSaving(false); }
    };

    const steps = [
        { id: 1, label: 'Dados Gerais' },
        { id: 2, label: 'Benefícios' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ label: 'Vagas', to: '/admin/jobs' }, { label: 'Nova Vaga' }]} />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">Publicar nova vaga</h1>
                <p className="text-sm text-muted-foreground">Preencha os detalhes para iniciar o processo de recrutamento.</p>
            </div>

            {/* Progress bar stepper */}
            <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground px-1">
                    {steps.map(s => <span key={s.id} className={step >= s.id ? 'text-foreground' : ''}>{s.label}</span>)}
                </div>
                <div className="flex gap-2">
                    {steps.map(s => (
                        <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                </div>
            </div>

            {/* Step cards */}
            <form onSubmit={handleSubmit}>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            
                            {/* Role Selection */}
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <Icon icon="material-symbols:badge" className="text-primary size-5" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Cargo</span>
                                </div>
                                <RoleDropdown
                                    roles={roles}
                                    value={selectedRoleId}
                                    onChange={handleRoleChange}
                                    isLoading={isLoadingRoles}
                                />
                                <p className="text-[10px] text-muted-foreground italic">Ao selecionar um cargo, os campos abaixo serão preenchidos automaticamente.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Título da Vaga<span className="text-error ml-0.5">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Analista de RH Senior"
                                        required
                                        className="w-full h-12 rounded-xl border border-border bg-background px-4 outline-none text-sm font-semibold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/40"
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Modelo<span className="text-error ml-0.5">*</span>
                                    </span>
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
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Tipo de contrato<span className="text-error ml-0.5">*</span>
                                    </span>
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
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Localidade do escritório<span className="text-error ml-0.5">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Adicione a cidade"
                                        required
                                        className="w-full h-12 rounded-xl border border-border bg-background px-4 outline-none text-sm font-semibold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/40"
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Área / Departamento/Setor<span className="text-error ml-0.5">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Recursos Humanos"
                                        required
                                        className="w-full h-12 rounded-xl border border-border bg-background px-4 outline-none text-sm font-semibold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/40"
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Gestor(a)<span className="text-error ml-0.5">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="reports_to"
                                        value={formData.reports_to}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Gerente de Operações"
                                        required
                                        className="w-full h-12 rounded-xl border border-border bg-background px-4 outline-none text-sm font-semibold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/40"
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Prazo Inscrição
                                    </span>
                                    <input
                                        type="date"
                                        name="registrationDeadline"
                                        value={formData.registrationDeadline}
                                        onChange={handleInputChange}
                                        className="w-full h-12 rounded-xl border border-border bg-background px-4 outline-none text-sm font-semibold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/40"
                                    />
                                </label>
                            </div>

                            <div className="h-px bg-border/60 my-6" />

                            <JobForm 
                                formData={formData as any} 
                                handleInputChange={handleInputChange} 
                                updateFormData={updateFormData} 
                                showCoreFields={false}

                                showBenefits={false}
                                showUrgency={true}
                            />

                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={() => setStep(2)} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2">
                                    Próximo <Icon icon="material-symbols:east" className="size-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
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
                                showCoreFields={false}
                                showPositionsAndSchedule={false}
                                showSalary={false}
                                showClassification={false}
                                showContext={false}
                                showRequirements={false}
                                showUrgency={false}

                                showBenefits={true}
                            />
                            <div className="flex justify-between pt-4">
                                <button type="button" onClick={() => setStep(1)} className="h-12 px-8 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all flex items-center gap-2">
                                    <Icon icon="material-symbols:west" className="size-5" /> Voltar
                                </button>
                                <div className="flex gap-3">
                                    <button type="submit" disabled={isSaving}
                                        className="h-12 px-8 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all disabled:opacity-50">
                                        {isSaving ? 'Salvando...' : 'Salvar rascunho'}
                                    </button>
                                    <button type="button" disabled={isSaving} onClick={handleApprove}
                                        className="h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                                        {isSaving ? 'Publicando...' : 'Aprovar vaga'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateJob;
