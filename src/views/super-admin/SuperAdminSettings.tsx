'use client';

import { Icon } from '@iconify/react';

export default function SuperAdminSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configurações</h1>
                <p className="text-sm text-muted-foreground mt-1">Configurações globais da plataforma INCI Recruta.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon icon="material-symbols:settings-outline-rounded" className="size-8 text-primary/60" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Em breve</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                    As configurações globais da plataforma estão sendo desenvolvidas e estarão disponíveis em breve.
                </p>
            </div>
        </div>
    );
}
