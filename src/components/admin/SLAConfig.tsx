// @component SLAConfig | @tipo componente | @versao 2.0.0
// > Seção de Benefícios da vaga com card estilizado

import React from 'react';
import { Icon } from "@iconify/react";

interface SLAConfigProps {
    settings: Record<string, { days: number; owner?: string }>;
    onChange: (settings: Record<string, { days: number; owner?: string }>) => void;
    children?: React.ReactNode;
}

const SLAConfig: React.FC<SLAConfigProps> = ({ children }) => {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-200">
            <div className="p-6 border-b border-border bg-muted/5">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon icon="material-symbols:redeem-rounded" className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="text-foreground font-semibold text-lg tracking-tight">Benefícios</h3>
                        <p className="text-xs text-muted-foreground font-medium">Adicione os benefícios oferecidos para esta vaga.</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default SLAConfig;
