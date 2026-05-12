'use client';
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import CustomSelect from '@src/components/ui/CustomSelect';

const COMMON_LANGUAGES = [
    "Português", "Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Chinês", "Japonês",
    "Árabe", "Russo", "Coreano", "Hindi", "Bengali", "Panjabi", "Javanês", "Telugu", 
    "Marathi", "Vietnamita", "Tâmil", "Urdu", "Turco", "Polonês", "Ucraniano", "Grego",
    "Holandês", "Sueco", "Norueguês", "Dinamarquês", "Finlandês", "Indonésio", "Malaio",
    "Tailandês", "Hebraico", "Persa", "Tcheco", "Romeno", "Húngaro", "Slovaco", "Búlgaro",
    "Croata", "Sérvio", "Albanês", "Lituano", "Letão", "Estoniano", "Africâner", "Amárico",
    "Azerbaijano", "Cazaque", "Uzbeque", "Nepalês"
];

const LEVELS = ["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"];

interface LanguagesSelectorProps {
    selectedLanguages: string[]; // Stored as "Language - Level"
    onChange: (languages: string[]) => void;
}

const LanguagesSelector: React.FC<LanguagesSelectorProps> = ({ selectedLanguages = [], onChange }) => {
    const [language, setLanguage] = useState(COMMON_LANGUAGES[0]);
    const [level, setLevel] = useState(LEVELS[1]);

    const handleAdd = () => {
        const entry = `${language} - ${level}`;
        if (!selectedLanguages.includes(entry)) {
            onChange([...selectedLanguages, entry]);
        }
    };

    const handleRemove = (entry: string) => {
        onChange(selectedLanguages.filter(l => l !== entry));
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Idioma e Nível</label>
                <div className="flex items-center gap-2 relative w-full">
                    <CustomSelect
                        className="flex-[2]"
                        value={language}
                        onChange={setLanguage}
                        options={COMMON_LANGUAGES}
                        placeholder="Idioma"
                    />

                    <CustomSelect
                        className="flex-[1.5]"
                        value={level}
                        onChange={setLevel}
                        options={LEVELS}
                        placeholder="Nível"
                    />

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="h-12 px-5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shrink-0 flex items-center gap-2 active:scale-95"
                    >
                        <Icon icon="material-symbols:add-rounded" className="size-4" />
                        Adicionar
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedLanguages.map(entry => (
                    <div key={entry} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold">
                        <span>{entry}</span>
                        <button type="button" onClick={() => handleRemove(entry)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Icon icon="material-symbols:close" className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                ))}
                {selectedLanguages.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Nenhum idioma selecionado.</p>
                )}
            </div>
        </div>
    );
};

export default LanguagesSelector;
