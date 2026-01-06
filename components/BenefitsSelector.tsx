import React from 'react';

export const AVAILABLE_BENEFITS = [
    { id: 'health_plan', label: 'Plano de Saúde', icon: 'favorite', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
    { id: 'dental_plan', label: 'Plano Odontológico', icon: 'dentistry', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { id: 'meal_voucher', label: 'Vale Alimentação', icon: 'restaurant', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: 'food_voucher', label: 'Vale Refeição', icon: 'lunch_dining', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'transport_voucher', label: 'Vale Transporte', icon: 'directions_bus', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'home_office', label: 'Home Office', icon: 'home_work', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'flexible_hours', label: 'Horário Flexível', icon: 'schedule', color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'gympass', label: 'Gympass', icon: 'fitness_center', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'life_insurance', label: 'Seguro de Vida', icon: 'health_and_safety', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'child_care', label: 'Auxílio Creche', icon: 'child_care', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
    { id: 'education', label: 'Auxílio Educação', icon: 'school', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { id: 'plr', label: 'PLR / Bônus', icon: 'attach_money', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 'birthday_off', label: 'Day Off no Aniversário', icon: 'cake', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
];

interface BenefitsSelectorProps {
    selectedBenefits: string[];
    onChange: (benefits: string[]) => void;
}

const BenefitsSelector: React.FC<BenefitsSelectorProps> = ({ selectedBenefits = [], onChange }) => {

    const toggleBenefit = (label: string) => {
        if (selectedBenefits.includes(label)) {
            onChange(selectedBenefits.filter(b => b !== label));
        } else {
            onChange([...selectedBenefits, label]);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_BENEFITS.map((benefit) => {
                    const isSelected = selectedBenefits.includes(benefit.label);
                    return (
                        <div
                            key={benefit.id}
                            onClick={() => toggleBenefit(benefit.label)}
                            className={`
                                cursor-pointer relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                                ${isSelected
                                    ? `bg-white border-primary ring-1 ring-primary shadow-sm`
                                    : 'bg-white border-border hover:border-primary/50 hover:bg-muted/30'
                                }
                            `}
                        >
                            <div className={`
                                size-10 rounded-lg flex items-center justify-center transition-colors
                                ${isSelected ? `${benefit.bg} ${benefit.color}` : 'bg-muted text-muted-foreground'}
                            `}>
                                <span className="material-symbols-outlined text-[20px]">{benefit.icon}</span>
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {benefit.label}
                            </span>
                            {isSelected && (
                                <div className="absolute top-2 right-2 size-2 bg-primary rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BenefitsSelector;
