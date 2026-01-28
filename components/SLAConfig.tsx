import React from 'react';

interface SLAConfigProps {
    settings: Record<string, { days: number; owner?: 'Qualidade' | 'Gestor' }>;
    onChange: (settings: Record<string, { days: number; owner?: 'Qualidade' | 'Gestor' }>) => void;
}

const COLUMNS = [
    { id: 'received', label: 'Inscrição', defaultOwner: 'Qualidade' },
    { id: 'screening', label: 'Triagem', defaultOwner: 'Qualidade' },
    { id: 'technical', label: 'Entrevista Téc.', defaultOwner: 'Qualidade' },
    { id: 'hr_interview', label: 'Entrevista RH', defaultOwner: 'Qualidade' },
    { id: 'manager_interview', label: 'Entrevista Gest.', defaultOwner: 'Gestor' },
    { id: 'finalist', label: 'Finalista', defaultOwner: 'Gestor' },
];

const SLAConfig: React.FC<SLAConfigProps> = ({ settings, onChange }) => {
    const handleChange = (id: string, field: 'days' | 'owner', value: any) => {
        onChange({
            ...settings,
            [id]: {
                ...(settings[id] || {}),
                [field]: value
            }
        });
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6 transition-colors shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <div>
                    <h3 className="text-foreground font-semibold text-base transition-colors">Regras da Vaga (SLA & Responsáveis)</h3>
                    <p className="text-xs text-muted-foreground font-medium">Defina prazos e donos de cada etapa do processo.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {COLUMNS.map(col => {
                    const currentOwner = settings[col.id]?.owner || col.defaultOwner;
                    const currentDays = settings[col.id]?.days || 2;

                    return (
                        <div key={col.id} className="flex flex-col gap-2 p-3 bg-muted/20 border border-border rounded-lg hover:border-border/80 transition-colors">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">{col.label}</label>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${currentOwner === 'Qualidade' ? 'bg-purple-500/10 text-purple-600 border-purple-200' : 'bg-orange-500/10 text-orange-600 border-orange-200'}`}>
                                    {currentOwner}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        min="1"
                                        value={currentDays}
                                        onChange={(e) => handleChange(col.id, 'days', parseInt(e.target.value) || 1)}
                                        className="w-full h-8 pl-2 pr-8 rounded border border-border bg-background text-sm font-semibold focus:ring-1 focus:ring-primary outline-none"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">dias</span>
                                </div>

                                <select
                                    value={currentOwner}
                                    onChange={(e) => handleChange(col.id, 'owner', e.target.value)}
                                    className="h-8 w-24 px-2 rounded border border-border bg-background text-xs font-medium focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                                    title="Responsável pela etapa"
                                >
                                    <option value="Qualidade">Qualidade</option>
                                    <option value="Gestor">Gestor</option>
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SLAConfig;
