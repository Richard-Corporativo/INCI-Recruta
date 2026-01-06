import React, { ReactNode } from 'react';
import { JOB_BENEFITS_OPTIONS } from '../constants';

interface BenefitsSelectorProps {
    selectedBenefits: string[];
    onChange: (benefits: string[]) => void;
}

const getBenefitIcon = (benefit: string): string => {
    const lower = benefit.toLowerCase();
    if (lower.includes('alimentação') || lower.includes('refeição')) return 'restaurant';
    if (lower.includes('saúde') || lower.includes('médico')) return 'favorite';
    if (lower.includes('odontológico') || lower.includes('dental')) return 'dentistry';
    if (lower.includes('gym') || lower.includes('academia') || lower.includes('fitness')) return 'fitness_center';
    if (lower.includes('home office') || lower.includes('remoto')) return 'home';
    if (lower.includes('flexível') || lower.includes('horário')) return 'schedule';
    if (lower.includes('aniversário') || lower.includes('day off')) return 'cake';
    if (lower.includes('seguro') || lower.includes('vida')) return 'health_and_safety';
    if (lower.includes('creche') || lower.includes('filhos')) return 'child_care';
    if (lower.includes('transporte')) return 'directions_bus';
    if (lower.includes('plr') || lower.includes('lucros') || lower.includes('bônus')) return 'payments';
    if (lower.includes('educação') || lower.includes('estudo') || lower.includes('curso')) return 'school';
    return 'stars'; // default
};

const BenefitsSelector: React.FC<BenefitsSelectorProps> = ({ selectedBenefits, onChange }) => {

    const toggleBenefit = (benefit: string) => {
        if (selectedBenefits.includes(benefit)) {
            onChange(selectedBenefits.filter(b => b !== benefit));
        } else {
            onChange([...selectedBenefits, benefit]);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                Pacote de Vantagens (Selecione)
            </label>
            <div className="flex flex-wrap gap-3">
                {JOB_BENEFITS_OPTIONS.map((benefit) => {
                    const isSelected = selectedBenefits.includes(benefit);
                    const icon = getBenefitIcon(benefit);

                    return (
                        <button
                            key={benefit}
                            type="button"
                            onClick={() => toggleBenefit(benefit)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${isSelected
                                    ? 'bg-primary/5 border-primary shadow-sm'
                                    : 'bg-background border-border hover:border-primary/50 hover:bg-muted/5'
                                }`}
                        >
                            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}>
                                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                            </div>
                            <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {benefit}
                            </span>
                            {isSelected && (
                                <div className="ml-auto text-primary">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BenefitsSelector;
