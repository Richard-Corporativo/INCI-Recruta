// @component SkillsSelector | @tipo componente | @versao 1.0.0
// > Seletor de habilidades para candidato/vaga — add/remove tags
// @api skills: string[], onChange: fn, placeholder?: string

'use client';
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

const COMMON_SKILLS = [
    "Comunicação", "Liderança", "Trabalho em Equipe", "Resolução de Problemas",
    "Inglês Avançado", "Gerenciamento de Tempo", "Criatividade", "Adaptabilidade",
    "React", "Node.js", "TypeScript", "Python", "SQL", "Excel Avançado",
    "Gestão de Projetos", "Vendas", "Atendimento ao Cliente", "Negociação",
    "Marketing Digital", "SEO", "Design Thinking", "Scrum", "Kanban"
];

interface SkillsSelectorProps {
    selectedSkills: string[];
    onChange: (skills: string[]) => void;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({ selectedSkills = [], onChange }) => {
    const [customSkill, setCustomSkill] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            onChange(selectedSkills.filter(s => s !== skill));
        } else {
            onChange([...selectedSkills, skill]);
        }
    };

    const addCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && customSkill.trim()) {
            e.preventDefault();
            const newSkill = customSkill.trim();
            if (!selectedSkills.includes(newSkill)) {
                onChange([...selectedSkills, newSkill]);
            }
            setCustomSkill('');
        }
    };

    const available = COMMON_SKILLS.filter(s => !selectedSkills.includes(s));

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Adicionar habilidade</label>
                <div className="relative">
                    <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={addCustomSkill}
                        placeholder="Digite e pressione Enter..."
                        className="w-full h-12 rounded-lg border border-border bg-background px-4 pl-10 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                    <Icon icon="material-symbols:add-circle" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {selectedSkills.map((skill) => (
                    <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary bg-primary/5 text-primary text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                    >
                        {skill}
                        <Icon icon="material-symbols:close" className="h-4 w-4" aria-hidden="true" />
                    </button>
                ))}
                {selectedSkills.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">Nenhuma habilidade selecionada.</span>
                )}
            </div>

            {available.length > 0 && (
                <div className="border-t border-border pt-2">
                    <button
                        type="button"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Icon
                            icon="material-symbols:expand-more"
                            className={`size-4 transition-transform duration-150 ${showSuggestions ? 'rotate-180' : ''}`}
                        />
                        {showSuggestions ? 'Ocultar sugestões' : `Ver sugestões (${available.length})`}
                    </button>
                    {showSuggestions && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {available.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className="px-2.5 py-1 rounded-lg border border-border bg-background text-muted-foreground text-xs font-medium hover:border-primary/50 hover:text-primary transition-colors"
                                >
                                    +{skill}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillsSelector;
