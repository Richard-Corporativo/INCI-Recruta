import React, { useState } from 'react';

const COMMON_LANGUAGES = [
    "Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Chinês", "Japonês"
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
        <div className="space-y-4">
            <div className="flex gap-2">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                >
                    {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="h-10 px-4 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                    Adicionar
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedLanguages.map(entry => (
                    <div key={entry} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card shadow-sm text-sm font-medium">
                        <span>{entry}</span>
                        <button type="button" onClick={() => handleRemove(entry)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <span className="material-symbols-outlined text-[16px]">close</span>
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
