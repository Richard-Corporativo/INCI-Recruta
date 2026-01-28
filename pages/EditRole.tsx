import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRoles } from '../hooks/useRoles';
import RequirementsSelector from '../components/RequirementsSelector';
import DynamicListInput from '../components/DynamicListInput';
import { JobService } from '../src/services/JobService';
import { DEPARTMENT_AREAS } from '../constants/departments';
import { useAuth } from '../hooks/useAuth';

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
        code: '',
        revision_code: '01',
        department: '',
        area: '',
        level: 1,
        seniority: 'Pleno',
        mission: '',
        responsibilities: [] as string[],
        requirements: [] as string[],
        requirements_technical: [] as string[],
        requirements_behavioral: [] as string[],
        kpis: [] as string[],
        competencies: [] as string[],
        status: 'Ativo',
        experience_min: '',
        reports_to: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const role = roles.find(r => r.id === id);
        if (role) {
            setFormData({
                title: role.title || '',
                code: role.code || '',
                revision_code: role.revision_code || '01',
                department: role.department || '',
                area: role.area || '',
                level: role.level || 1,
                seniority: role.seniority || 'Pleno',
                mission: role.mission || '',
                responsibilities: typeof role.responsibilities === 'string' ? role.responsibilities.split('\n').filter(Boolean) : (Array.isArray(role.responsibilities) ? role.responsibilities : []),
                requirements: typeof role.requirements === 'string' ? role.requirements.split('\n').filter(Boolean) : (Array.isArray(role.requirements) ? role.requirements : []),
                requirements_technical: typeof role.requirements_technical === 'string' ? role.requirements_technical.split('\n').filter(Boolean) : (Array.isArray(role.requirements_technical) ? role.requirements_technical : []),
                requirements_behavioral: typeof role.requirements_behavioral === 'string' ? role.requirements_behavioral.split('\n').filter(Boolean) : (Array.isArray(role.requirements_behavioral) ? role.requirements_behavioral : []),
                kpis: typeof role.kpis === 'string' ? role.kpis.split('\n').filter(Boolean) : (Array.isArray(role.kpis) ? role.kpis : []),
                competencies: typeof role.competencies === 'string' ? role.competencies.split('\n').filter(Boolean) : (Array.isArray(role.competencies) ? role.competencies : []),
                status: role.status || 'Ativo',
                experience_min: role.experience_min || '',
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
                    responsibilities: formData.responsibilities.join('\n'),
                    requirements: formData.requirements.join('\n'),
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
            <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0 transition-colors">
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
                            className="h-10 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center gap-2.5 h-10 px-6 bg-primary text-primary-foreground border border-border/40 rounded-base text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-200 ease-in-out hover:bg-primary/90 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">{isLoading ? 'progress_activity' : 'save'}</span>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-8 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto pb-24">

                    {/* Main Form Card */}
                    <div className="border border-border bg-card rounded-lg shadow-sm transition-colors overflow-hidden">
                        <form className="divide-y divide-border" onSubmit={handleSubmit}>
                            {/* Section 1: Dados Cadastrais */}
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">badge</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Dados Cadastrais</h3>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="code">
                                                Código <span className="text-destructive">*</span>
                                            </label>
                                            <input
                                                className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                                id="code" name="code" type="text" value={formData.code} onChange={handleInputChange} required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="revision_code">
                                                Revisão <span className="text-destructive">*</span>
                                            </label>
                                            <input
                                                className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                                id="revision_code" name="revision_code" type="text" value={formData.revision_code} onChange={handleInputChange} required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="area">
                                            Área <span className="text-destructive">*</span>
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
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="department">
                                            Área de Atuação <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="department" name="department" value={formData.department} onChange={handleInputChange} required
                                        >
                                            <option value="">Selecione uma área</option>
                                            {DEPARTMENT_AREAS.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Classificação */}
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">category</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground transition-colors uppercase tracking-tight">Classificação</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">
                                            Senioridade <span className="text-destructive">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 p-1 bg-muted/30 rounded-lg border border-border transition-colors">
                                            {['Júnior', 'Pleno', 'Sênior'].map((level) => (
                                                <label key={level} className="cursor-pointer">
                                                    <input
                                                        className="peer sr-only" name="seniority" type="radio" value={level}
                                                        checked={formData.seniority === level}
                                                        onChange={handleInputChange}
                                                    />
                                                    <div className="flex h-10 items-center justify-center rounded-md border border-transparent text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted transition-all duration-200 ease-in-out peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:shadow-sm">
                                                        {level}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="experience_min">
                                            Experiência Mínima <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            className="block w-full h-11 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-3.5 text-sm"
                                            id="experience_min" name="experience_min" type="text" value={formData.experience_min} onChange={handleInputChange} required
                                            placeholder="Ex: 2+ anos"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Requisitos Detalhados */}
                            <div className="p-6 md:p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
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
                                    <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">description</span>
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
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors" htmlFor="responsibilities">
                                            Responsabilidades <span className="text-destructive">*</span>
                                        </label>
                                        <DynamicListInput
                                            label=""
                                            placeholder="Digite uma responsabilidade e pressione Enter"
                                            items={formData.responsibilities}
                                            onChange={(items) => setFormData(prev => ({ ...prev, responsibilities: items }))}
                                            icon="task_alt"
                                        />
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
