// @component ExperienceListEditor | @tipo componente | @versao 1.0.0
// > Editor de experiência profissional do candidato — add/edit/remove entries
// @api experience: Experience[], onChange: fn

'use client';
import React, { useState } from 'react';
import { Experience } from '@src/types';
import { Icon } from "@iconify/react";

interface ExperienceListEditorProps {
    experiences: Experience[];
    onChange: (experiences: Experience[]) => void;
}

const ExperienceListEditor: React.FC<ExperienceListEditorProps> = ({ experiences = [], onChange }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<Partial<Experience>>({});

    const handleAddNew = () => {
        setFormState({
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setEditingId(null);
        setIsAdding(true);
    };

    const handleEdit = (exp: Experience) => {
        setFormState({ ...exp });
        setEditingId(exp.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        onChange(experiences.filter(e => e.id !== id));
    };

    const handleSave = () => {
        if (!formState.company || !formState.role) return;

        if (editingId) {
            // Update existing
            const updated = experiences.map(e => e.id === editingId ? { ...e, ...formState } as Experience : e);
            onChange(updated);
        } else {
            // Add new
            const newExp: Experience = {
                ...(formState as Experience),
                id: crypto.randomUUID()
            };
            onChange([...experiences, newExp]);
        }
        setIsAdding(false);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="p-6 rounded-xl bg-card hover:bg-muted transition-colors group relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-foreground">{exp.role}</h4>
                                <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {exp.startDate} - {exp.endDate || 'Atualmente'}
                                </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(exp)} type="button" className="p-1.5 hover:bg-muted rounded-md text-primary">
                                    <Icon icon="material-symbols:edit" className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button onClick={() => handleDelete(exp.id)} type="button" className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive">
                                    <Icon icon="material-symbols:delete" className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                        {exp.description && (
                            <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-2">{exp.description}</p>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border text-muted-foreground font-semibold text-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <Icon icon="material-symbols:add" className="h-5 w-5" aria-hidden="true" />
                    Adicionar Experiência
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-background w-full max-w-lg rounded-3xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Icon icon="material-symbols:work-history" className="size-4 text-primary" />
                                {editingId ? 'Editar Experiência' : 'Nova Experiência'}
                            </h3>
                            <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                                <Icon icon="material-symbols:close" className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground">Empresa</label>
                                    <input
                                        type="text"
                                        value={formState.company}
                                        onChange={e => setFormState({ ...formState, company: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                                        placeholder="Ex: Google"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground">Cargo</label>
                                    <input
                                        type="text"
                                        value={formState.role}
                                        onChange={e => setFormState({ ...formState, role: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                                        placeholder="Ex: Senior Developer"
                                    />
                                </div>
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
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground">Fim</label>
                                    <input
                                        type="month"
                                        value={formState.endDate}
                                        onChange={e => setFormState({ ...formState, endDate: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm text-muted-foreground"
                                    />
                                    <span className="text-[10px] text-muted-foreground pl-1">Deixe em branco se for atual.</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">Descrição</label>
                                <textarea
                                    rows={4}
                                    value={formState.description}
                                    onChange={e => setFormState({ ...formState, description: e.target.value })}
                                    className="w-full p-3 rounded-md border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none"
                                    placeholder="Descreva suas principais responsabilidades e conquistas..."
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-muted/20 flex justify-end gap-3 border-t border-border">
                            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-md transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">Salvar Experiência</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceListEditor;
