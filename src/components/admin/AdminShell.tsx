'use client';

// @component AdminShell | @tipo layout-client | @versao 1.0.0
// > Shell visual do painel administrativo — Sidebar, header, breadcrumbs
// > Separado do layout server para permitir interatividade client-side

import { useState } from 'react';
import Sidebar from '@src/components/shared/Sidebar';
import QuickViewDrawer from '@src/components/admin/QuickViewDrawer';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@src/lib/utils';

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';
    const [expanded, setExpanded] = useState(true);

    const getBreadcrumbLabel = () => {
        if (pathname.includes('/agenda')) return 'Agenda';
        if (pathname.includes('/jobs')) return 'Vagas';
        if (pathname.includes('/audit')) return 'Auditoria';
        if (pathname.includes('/roles')) return 'Cargos';
        if (pathname.includes('/talent-bank')) return 'Banco de Talentos';
        if (pathname.includes('/settings')) return 'Configurações';
        if (pathname.includes('/analytics')) return 'Analytics';
        return 'Início';
    };

    return (
        <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-150">
            <Sidebar expanded={expanded} setExpanded={setExpanded} />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-sidebar-border bg-card/50 backdrop-blur-md flex items-center px-6 shrink-0 z-40">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="group flex h-9 w-9 items-center justify-center rounded-2xl bg-card hover:bg-muted transition-all duration-300 active:scale-95"
                    >
                        <Icon
                            icon="material-symbols:menu-open"
                            className={cn(
                                "size-5 text-muted-foreground group-hover:text-primary transition-all duration-300",
                                !expanded && "rotate-180"
                            )}
                        />
                    </button>

                    <div className="ml-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        <span>Painel Admin</span>
                        <Icon icon="material-symbols:chevron-right" className="size-4" />
                        <span className="text-foreground">{getBreadcrumbLabel()}</span>
                    </div>
                </header>

                {/* Content */}
                {pathname.includes('/kanban') ? (
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {children}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 lg:py-8">
                            {children}
                        </div>
                    </div>
                )}
            </main>
            <QuickViewDrawer />
        </div>
    );
}
