'use client';

export function getPasswordStrength(password: string): number {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
}

interface Props {
    password: string;
}

export function PasswordStrengthIndicator({ password }: Props) {
    const strength = getPasswordStrength(password);

    if (!password) return null;

    return (
        <div className="pt-1 space-y-2">
            <div className="flex gap-1.5 h-1.5">
                {[...Array(4)].map((_, i) => {
                    const isActive = i < strength;
                    let bgColor = '#e2e8f0';
                    if (isActive) {
                        if (strength <= 1) bgColor = '#FF2C2C';
                        else if (strength === 2) bgColor = '#FFDE21';
                        else bgColor = '#008000';
                    }
                    return (
                        <div key={i} className="flex-1 h-full rounded-full bg-slate-100 relative overflow-hidden">
                            <div
                                className="absolute inset-0 transition-all duration-500 ease-out rounded-full"
                                style={{ backgroundColor: bgColor, width: isActive ? '100%' : '0%' }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end items-center px-0.5">
                <span
                    className="text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
                    style={{
                        color: strength <= 1 ? '#FF2C2C' : strength === 2 ? '#FFDE21' : '#008000'
                    }}
                >
                    {strength <= 1 ? 'Baixa' : strength === 2 ? 'Média' : 'Forte'}
                </span>
            </div>
        </div>
    );
}
