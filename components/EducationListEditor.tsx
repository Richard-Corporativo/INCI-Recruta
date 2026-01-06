import React, { useState } from 'react';
import { Education } from '../types';

interface EducationListEditorProps {
    educationList: Education[];
    onChange: (education: Education[]) => void;
}

const EducationListEditor: React.FC<EducationListEditorProps> = ({ educationList = [], onChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<Partial<Education>>({});

    const handleAddNew = () => {
        setFormState({
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setEditingId(null);
        setIsAdding(true);
    };

    const handleEdit = (edu: Education) => {
        setFormState({ ...edu });
        setEditingId(edu.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        onChange(educationList.filter(e => e.id !== id));
    };

    const handleSave = () => {
        if (!formState.institution || !formState.degree) return;

        if (editingId) {
            // Update existing
            const updated = educationList.map(e => e.id === editingId ? { ...e, ...formState } as Education : e);
            onChange(updated);
        } else {
            // Add new
            const newEdu: Education = {
                id: crypto.randomUUID(),
                ...formState as Education
            };
            onChange([...educationList, newEdu]);
        }
        setIsAdding(false);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {educationList.map((edu) => (
                    <div key={edu.id} className="p-5 rounded-xl border border-border bg-card hover:border-sidebar-primary/50 transition-colors group relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-foreground">{edu.degree}</h4>
                                <p className="text-sm font-medium text-muted-foreground">{edu.institution}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {edu.startDate} - {edu.endDate || 'Atualmente'}
                                </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(edu)} type="button" className="p-1.5 hover:bg-muted rounded-md text-primary">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button onClick={() => handleDelete(edu.id)} type="button" className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border text-muted-foreground font-semibold text-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    Adicionar Formação
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-bold text-foreground">{editingId ? 'Editar Formação' : 'Nova Formação'}</h3>
                            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Instituição</label>
                                <input
                                    type="text"
                                    value={formState.institution}
                                    onChange={e => setFormState({ ...formState, institution: e.target.value })}
                                    className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                                    placeholder="Ex: USP"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground">Grau / Curso</label>
                                <input
                                    type="text"
                                    value={formState.degree}
                                    onChange={e => setFormState({ ...formState, degree: e.target.value })}
                                    className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                                    placeholder="Ex: Ciência da Computação"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Início</label>
                                    <input
                                        type="month"
                                        value={formState.startDate}
                                        onChange={e => setFormState({ ...formState, startDate: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm text-muted-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Fim</label>
                                    <input
                                        type="month"
                                        value={formState.endDate}
                                        onChange={e => setFormState({ ...formState, endDate: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm text-muted-foreground"
                                    />
                                    <span className="text-[10px] text-muted-foreground pl-1">Deixe em branco se for atual.</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/20 flex justify-end gap-3 border-t border-border">
                            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg shadow-primary/20">Salvar Formação</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationListEditor;
