import React, { useState } from 'react';

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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Adicionar habilidade</label>
                <div className="relative">
                    <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={addCustomSkill}
                        placeholder="Digite e pressione Enter..."
                        className="w-full h-12 rounded-lg border border-border bg-background px-4 pl-11 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-muted-foreground">add_circle</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                    <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary bg-primary/5 text-primary text-xs font-bold hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all group"
                    >
                        {skill}
                        <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                ))}
                {selectedSkills.length === 0 && (
                    <span className="text-sm text-muted-foreground italic">Nenhuma habilidade selecionada.</span>
                )}
            </div>

            <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-muted-foreground">Sugestões</label>
                <div className="flex flex-wrap gap-2">
                    {COMMON_SKILLS.filter(s => !selectedSkills.includes(s)).map((skill) => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground text-xs font-medium hover:border-primary/50 hover:text-primary transition-colors"
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillsSelector;
