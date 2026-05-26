// @component EducationListEditor | @tipo componente | @versao 1.0.0
// > Editor de formação acadêmica do candidato — add/edit/remove entries
// @api education: Education[], onChange: fn

'use client';
import React, { useState } from 'react';
import { Education } from '@src/types';
import { Icon } from "@iconify/react";

interface EducationListEditorProps {
    educationList: Education[];
    onChange: (education: Education[]) => void;
}

const EducationListEditor: React.FC<EducationListEditorProps> = ({ educationList = [], onChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<Partial<Education>>({});
    const [isCurrent, setIsCurrent] = useState(false);

    const handleAddNew = () => {
        setFormState({
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setEditingId(null);
        setIsCurrent(false);
        setIsAdding(true);
    };

    const handleEdit = (edu: Education) => {
        setFormState({ ...edu });
        setEditingId(edu.id);
        setIsCurrent(!edu.endDate);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        onChange(educationList.filter(e => e.id !== id));
    };

    const handleSave = () => {
        if (!formState.institution || !formState.degree) return;

        const dataToSave = isCurrent ? { ...formState, endDate: '' } : formState;

        if (editingId) {
            // Update existing
            const updated = educationList.map(e => e.id === editingId ? { ...e, ...dataToSave } as Education : e);
            onChange(updated);
        } else {
            // Add new
            const newEdu: Education = {
                ...(dataToSave as Education),
                id: crypto.randomUUID()
            };
            onChange([...educationList, newEdu]);
        }
        setIsAdding(false);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {educationList.map((edu) => (
                    <div key={edu.id} className="p-6 rounded-xl bg-card hover:bg-muted transition-colors group relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                                <p className="text-sm font-medium text-muted-foreground">{edu.institution}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {edu.startDate} - {edu.endDate || 'Atualmente'}
                                </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(edu)} type="button" className="p-1.5 hover:bg-muted rounded-md text-primary">
                                    <Icon icon="material-symbols:edit" className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button onClick={() => handleDelete(edu.id)} type="button" className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive">
                                    <Icon icon="material-symbols:delete" className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border text-muted-foreground font-semibold text-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <Icon icon="material-symbols:add" className="h-5 w-5" aria-hidden="true" />
                    Adicionar Formação
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-background w-full max-w-lg rounded-3xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Icon icon="material-symbols:school" className="size-4 text-primary" />
                                {editingId ? 'Editar Formação' : 'Nova Formação'}
                            </h3>
                            <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                                <Icon icon="material-symbols:close" className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Instituição</label>
                                <input
                                    type="text"
                                    value={formState.institution}
                                    onChange={e => setFormState({ ...formState, institution: e.target.value })}
                                    className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                                    placeholder="Ex: USP"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Grau / Curso</label>
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
                                    <label className="text-xs font-semibold text-muted-foreground">Início</label>
                                    <input
                                        type="month"
                                        value={formState.startDate}
                                        onChange={e => setFormState({ ...formState, startDate: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm text-muted-foreground"
                                    />
                                </div>
                                {!isCurrent && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground">Fim</label>
                                        <input
                                            type="month"
                                            value={formState.endDate}
                                            onChange={e => setFormState({ ...formState, endDate: e.target.value })}
                                            className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm text-muted-foreground"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Estou cursando */}
                            <label className="flex items-center gap-3 cursor-pointer mt-1">
                                <div className={`size-5 rounded border-2 flex items-center justify-center transition-all duration-200 ease-in-out shrink-0 ${
                                    isCurrent ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background'
                                }`}>
                                    {isCurrent && <Icon icon="material-symbols:check" className="size-3" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={isCurrent} onChange={() => {
                                    setIsCurrent(prev => !prev);
                                    if (!isCurrent) setFormState(prev => ({ ...prev, endDate: '' }));
                                }} />
                                <span className="text-xs font-semibold text-foreground">Estou cursando</span>
                            </label>
                        </div>
                        <div className="p-4 bg-muted/20 flex justify-end gap-3 border-t border-border">
                            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-md transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">Salvar Formação</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationListEditor;
