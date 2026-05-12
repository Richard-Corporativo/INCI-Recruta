'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@src/hooks/useAuth';
import { Icon } from '@iconify/react';
import Avatar from '@src/components/atoms/Avatar/Avatar';
import { cn } from '@src/lib/utils';

interface SuperAdminSidebarProps {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
}

const navItems = [
    {
        name: 'Painel Global',
        icon: 'material-symbols:public',
        activeIcon: 'material-symbols:public',
        path: '/super-admin/dashboard',
        matchPaths: ['/super-admin/dashboard', '/super-admin/companies'],
    },
    {
        name: 'Dashboard',
        icon: 'material-symbols:dashboard-outline',
        activeIcon: 'material-symbols:dashboard',
        path: '/super-admin/overview',
    },
    {
        name: 'Cargos',
        icon: 'material-symbols:work-outline',
        activeIcon: 'material-symbols:work',
        path: '/super-admin/roles',
    },
    {
        name: 'Banco de Talentos',
        icon: 'material-symbols:group-outline',
        activeIcon: 'material-symbols:group',
        path: '/super-admin/talent-bank',
    },
    {
        name: 'Vagas',
        icon: 'material-symbols:description-outline',
        activeIcon: 'material-symbols:description',
        path: '/super-admin/jobs',
    },
    {
        name: 'Auditoria',
        icon: 'material-symbols:fact-check-outline',
        activeIcon: 'material-symbols:fact-check',
        path: '/super-admin/audit',
    },
    {
        name: 'Configurações',
        icon: 'material-symbols:settings-outline',
        activeIcon: 'material-symbols:settings',
        path: '/super-admin/settings',
    },
];

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ expanded, setExpanded }) => {
    const pathname = usePathname() || '/';
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = useCallback(() => {
        logout();
        router.push('/vagas');
    }, [logout, router]);

    return (
        <aside
            className={cn(
                'hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border h-full transition-all duration-300 overflow-visible relative',
                expanded ? 'w-64' : 'w-20'
            )}
        >
            {/* Logo + Badge */}
            <div
                className={cn(
                    'flex items-center border-b border-sidebar-border transition-all duration-150 shrink-0 h-16',
                    expanded ? 'px-6 justify-between' : 'px-4 justify-center'
                )}
            >
                <NextLink href="/vagas" className="outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-md shrink-0">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className={expanded ? 'h-8 w-auto transition-all' : 'h-5 w-auto object-contain transition-all'}
                    />
                </NextLink>
                {expanded && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md shrink-0">
                        Super Admin
                    </span>
                )}
            </div>

            {/* Profile Card */}
            {expanded && (
                <div className="flex gap-3 items-center p-4 mx-3 mt-4 rounded-2xl bg-muted/30 border border-border/40 transition-all duration-300 animate-in fade-in zoom-in-95">
                    <Avatar
                        size="md"
                        className="ring-2 ring-white"
                        fallback={user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'SA'}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-foreground text-sm font-semibold leading-tight truncate">{user?.name || 'Super Admin'}</p>
                        <p className="text-muted-foreground text-[9px] font-bold tracking-[0.15em] truncate uppercase mt-0.5">INCI Brasil</p>
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 flex flex-col gap-1 p-3 mt-2">
                {navItems.map((item) => {
                    const isActive = item.matchPaths
                        ? item.matchPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
                        : pathname === item.path || pathname.startsWith(item.path + '/');
                    return (
                        <NextLink
                            key={item.name}
                            href={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 outline-none border border-transparent',
                                expanded ? 'justify-start' : 'justify-center',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                            )}
                            title={!expanded ? item.name : undefined}
                        >
                            <Icon
                                icon={isActive ? item.activeIcon : item.icon}
                                className={cn('size-5 shrink-0', isActive && 'text-primary')}
                            />
                            {expanded && (
                                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                                    {item.name}
                                </span>
                            )}
                        </NextLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className={cn('border-t border-sidebar-border p-3', !expanded && 'flex flex-col items-center')}>
                <button
                    onClick={handleLogout}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-all duration-150 outline-none w-full',
                        expanded ? 'justify-start' : 'justify-center'
                    )}
                    title={!expanded ? 'Sair' : undefined}
                >
                    <Icon icon="material-symbols:logout-outline" className="size-5 shrink-0" />
                    {expanded && <span>Sair do Sistema</span>}
                </button>
            </div>
        </aside>
    );
};

export default SuperAdminSidebar;
