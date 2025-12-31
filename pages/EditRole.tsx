import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRoles } from '../hooks/useRoles';

const EditRole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { roles, updateRole } = useRoles();

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        department: '',
        area: '',
        seniority: 'Pleno',
        mission: '',
        responsibilities: '',
        status: 'Ativo'
    });

    useEffect(() => {
        const role = roles.find(r => r.id === id);
        if (role) {
            setFormData({
                title: role.title || '',
                code: role.code || '',
                department: role.department || '',
                area: role.area || '',
                seniority: role.seniority || 'Pleno',
                mission: role.mission || '',
                responsibilities: role.responsibilities || '',
                status: role.status || 'Ativo'
            });
        }
    }, [roles, id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            updateRole(id, formData);
            navigate('/roles');
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
            {/* Header */}
            <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
                <div className="mb-3">
                    <Breadcrumbs items={[
                        { label: 'Cargos', to: '/roles' },
                        { label: 'Editar Cargo' }
                    ]} />
                </div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Editar Cargo</h1>
                        <p className="text-muted-foreground text-sm mt-1">Atualize os detalhes do cargo selecionado abaixo.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/roles')}
                            className="px-4 py-2 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-base text-sm font-bold shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
                <div className="max-w-[1200px] mx-auto">

                    {/* Main Form Card */}
                    <div className="border border-border bg-card rounded-xl shadow-sm">
                        <form className="divide-y divide-border" onSubmit={handleSubmit}>
                            {/* Section 1: Dados Cadastrais */}
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary">
                                        <span className="material-symbols-outlined text-sm">badge</span>
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out">Dados Cadastrais</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out" htmlFor="title">
                                            Nome do Cargo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="block w-full rounded-lg border-border bg-white dark:bg-surface-dark text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                                            id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out" htmlFor="code">
                                            Código do Cargo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="block w-full rounded-lg border-border bg-white dark:bg-surface-dark text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                                            id="code" name="code" type="text" value={formData.code} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out" htmlFor="area">
                                            Área <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="block w-full rounded-lg border-border bg-white dark:bg-surface-dark text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                                            id="area" name="area" type="text" value={formData.area} onChange={handleInputChange} required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out" htmlFor="department">
                                            Departamento <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="block w-full rounded-lg border-border bg-white dark:bg-surface-dark text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                                            id="department" name="department" type="text" value={formData.department} onChange={handleInputChange} required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Classificação */}
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="flex size-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined text-sm">category</span>
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-all duration-200 ease-in-out">Classificação</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 ease-in-out">
                                            Senioridade Padrão <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Júnior', 'Pleno', 'Sênior'].map((level) => (
                                                <label key={level} className="cursor-pointer">
                                                    <input
                                                        className="peer sr-only" name="seniority" type="radio" value={level}
                                                        checked={formData.seniority === level}
                                                        onChange={handleInputChange}
                                                    />
                                                    <div className="flex items-center justify-center rounded-lg border border-border bg-card py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                                                        {level}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 ease-in-out" htmlFor="status">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="block w-full rounded-lg border-border bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                                            id="status" name="status" value={formData.status} onChange={handleInputChange} required
                                        >
                                            <option value="Ativo">Ativo</option>
                                            <option value="Inativo">Inativo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Descrição do Cargo */}
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined text-sm">description</span>
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-all duration-200 ease-in-out">Descrição do Cargo</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 ease-in-out" htmlFor="mission">
                                            Missão <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="block w-full rounded-lg border-border bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                                            id="mission" name="mission" placeholder="Descreva o propósito principal deste cargo..." rows={3}
                                            value={formData.mission} onChange={handleInputChange} required
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 ease-in-out" htmlFor="responsibilities">
                                            Responsabilidades <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="block w-full rounded-lg border-border bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                                            id="responsibilities" name="responsibilities" placeholder="Liste as principais atividades..." rows={6}
                                            value={formData.responsibilities} onChange={handleInputChange} required
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
