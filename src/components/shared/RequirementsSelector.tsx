// @component RequirementsSelector | @tipo componente | @versao 1.0.0
// > Seletor de requisitos para vaga — técnico e comportamental
// @api requirements: string[], onChange: fn, categories: string[]

'use client';
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

// Common technical and soft skills for recruitment context
const COMMON_REQUIREMENTS = [
    "Ensino Superior Completo",
    "Inglês Avançado",
    "Inglês Fluente",
    "Híbrido",
    "Remoto",
    "Presencial",
    "Disponibilidade para viagens",
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "Java",
    "SQL",
    "AWS",
    "Docker",
    "Scrum",
    "Kanban",
    "Liderança",
    "Proatividade",
    "Comunicação",
    "Trabalho em Equipe"
];

interface RequirementsSelectorProps {
    selectedRequirements: string[];
    onChange: (requirements: string[]) => void;
}

const RequirementsSelector: React.FC<RequirementsSelectorProps> = ({ selectedRequirements, onChange }) => {
    const [customReq, setCustomReq] = useState('');

    const toggleRequirement = (req: string) => {
        if (selectedRequirements.includes(req)) {
            onChange(selectedRequirements.filter(r => r !== req));
        } else {
            onChange([...selectedRequirements, req]);
        }
    };

    const addCustomRequirement = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && customReq.trim()) {
            e.preventDefault();
            if (!selectedRequirements.includes(customReq.trim())) {
                onChange([...selectedRequirements, customReq.trim()]);
            }
            setCustomReq('');
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-2">
                <Icon icon="material-symbols:checklist" className="h-5 w-5" aria-hidden="true" />
                Requisitos e Qualificações
            </label>

            <div className="flex flex-col gap-3">
                {/* Custom Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={customReq}
                        onChange={(e) => setCustomReq(e.target.value)}
                        onKeyDown={addCustomRequirement}
                        placeholder="Digite um requisito personalizado e pressione Enter..."
                        className="w-full h-10 px-3 pl-9 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                    <Icon icon="material-symbols:add" className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" aria-hidden="true" />
                </div>

                {/* Selected & Common Tags */}
                <div className="flex flex-wrap gap-2">
                    {/* Render selected customization first if not in common list to ensure visibility */}
                    {selectedRequirements.filter(r => !COMMON_REQUIREMENTS.includes(r)).map((req) => (
                        <button
                            key={req}
                            type="button"
                            onClick={() => toggleRequirement(req)}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-xl border border-primary bg-primary/10 text-primary text-sm font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors group"
                        >
                            {req}
                            <Icon icon="material-symbols:close" className="h-5 w-5" aria-hidden="true" />
                        </button>
                    ))}

                    {/* Common Suggestions */}
                    {COMMON_REQUIREMENTS.map((req) => {
                        const isSelected = selectedRequirements.includes(req);
                        return (
                            <button
                                key={req}
                                type="button"
                                onClick={() => toggleRequirement(req)}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all text-sm font-semibold ${isSelected
                                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                        : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                    }`}
                            >
                                {req}
                                {isSelected && <Icon icon="material-symbols:check" className="h-5 w-5" aria-hidden="true" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RequirementsSelector;
