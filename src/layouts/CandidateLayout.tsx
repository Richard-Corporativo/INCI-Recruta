// @component CandidateLayout | @tipo layout | @versao 4.0.0
// > Layout portal candidato — Balha v10: sidebar colapsável, header sticky, scroll zero
// @state sidebarExpanded, termsModal, isLoggingOut
// @action handleLogout, toggleSidebar
// @rule Força light mode, sidebar 64px/256px, scroll zero no content

'use client';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from '@src/lib/router-compat';
import TermsModal from '@src/components/public/TermsModal';
import { useAuth } from '@src/context/AuthContext';
import { Icon } from "@iconify/react";
import { cn } from '@src/lib/utils';

const CandidateLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
        isOpen: false,
        type: 'terms'
    });

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    React.useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }, []);

    const navItems = [
        { to: '/candidate/settings', label: 'Meu perfil', icon: 'person' },
        { to: '/candidate/applications', label: 'Candidaturas', icon: 'business-center' },
        { to: '/candidate/saved-jobs', label: 'Favoritas', icon: 'star' },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background transition-colors duration-150">
            {/* Desktop Sidebar — colapsável */}
            <aside
                className={cn(
                    "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-full transition-all duration-300 overflow-visible relative",
                    sidebarExpanded ? 'w-64' : 'w-20'
                )}
            >
                {/* Logo */}
                <div className={cn(
                    "flex items-center border-b border-sidebar-border transition-all duration-150 shrink-0 h-16",
                    sidebarExpanded ? 'px-6 justify-start' : 'px-4 justify-center'
                )}>
                    <Link to="/vagas" className="outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-md shrink-0">
                        <img
                            src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                            alt="INCI Recruta"
                            className={sidebarExpanded ? 'h-8 w-auto' : 'h-5 w-auto object-contain'}
                        />
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 flex flex-col gap-1 p-3 mt-2">
                    {navItems.map((item) => {
                        const isActive = (location.pathname || '') === item.to;
                        const isFavorites = item.to === '/candidate/saved-jobs';
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 outline-none border border-transparent",
                                    sidebarExpanded ? 'justify-start' : 'justify-center',
                                    isActive
                                        ? 'bg-muted text-primary shadow-sm border-border'
                                        : 'text-muted-foreground hover:bg-muted/40 hover:border-border/30 hover:text-foreground'
                                )}
                                title={!sidebarExpanded ? item.label : undefined}
                            >
                                <Icon 
                                    icon={isFavorites ? 'ph:star-fill' : `material-symbols:${isActive ? item.icon + '-rounded' : item.icon}`} 
                                    className={cn("size-5 shrink-0 transition-colors", isActive && "text-primary")} 
                                    aria-hidden="true" 
                                />
                                {sidebarExpanded && <span className="text-[11px] font-bold uppercase tracking-wider truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className={cn(
                    "border-t border-sidebar-border p-3",
                    !sidebarExpanded && "flex flex-col items-center"
                )}>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 hover:bg-error/10 hover:text-error transition-all duration-150 outline-none w-full",
                            sidebarExpanded ? 'justify-start' : 'justify-center'
                        )}
                        title={!sidebarExpanded ? 'Sair' : undefined}
                    >
                        <Icon
                            icon={isLoggingOut ? "material-symbols:progress-activity" : "material-symbols:logout"}
                            className="size-5 shrink-0"
                        />
                        {sidebarExpanded && <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>}
                    </button>
                </div>

                    {sidebarExpanded && (
                        <div className="mt-4 pt-4 border-t border-sidebar-border flex justify-center gap-6 text-[10px] text-muted-foreground tracking-[0.2em] font-semibold">
                            <button
                                onClick={() => setTermsModal({ isOpen: true, type: 'terms' })}
                                className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            >
                                Termos
                            </button>
                            <button
                                onClick={() => setTermsModal({ isOpen: true, type: 'privacy' })}
                                className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            >
                                Privacidade
                            </button>
                        </div>
                    )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="hidden md:flex items-center justify-between h-16 px-8 bg-background border-b border-border shrink-0">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarExpanded(!sidebarExpanded)}
                            className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 active:scale-95"
                            title={sidebarExpanded ? "Recolher menu" : "Expandir menu"}
                        >
                            <Icon 
                                icon="material-symbols:menu-open" 
                                className={cn(
                                    "size-5 transition-all duration-300",
                                    !sidebarExpanded && "rotate-180"
                                )} 
                            />
                        </button>

                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
                            <Link to="/candidate/dashboard" className="hover:text-foreground transition-colors">Portal</Link>
                            {location.pathname !== '/candidate/dashboard' && (
                                <>
                                    <Icon icon="material-symbols:chevron-right" className="size-4 text-border" />
                                    <span className="text-foreground">
                                        {navItems.find(item => item.to === location.pathname)?.label || 'Detalhes'}
                                    </span>
                                </>
                            )}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Painel do Candidato</span>
                    </div>
                </header>

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-6 bg-card border-b border-border shrink-0">
                    <Link to="/vagas" className="outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-md shrink-0">
                        <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-7 w-auto" />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                        title="Sair"
                    >
                        <Icon icon="material-symbols:logout" className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Page Content — scroll zero, grid de cards */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto w-full px-4 md:px-10 lg:px-14 py-8 md:py-10">
                        {children}
                    </div>
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe-area z-20">
                    <div className="flex justify-around items-center p-3">
                        {navItems.map((item) => {
                            const isActive = (location.pathname || '') === item.to;
                            const isFavorites = item.to === '/candidate/saved-jobs';
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex flex-col items-center gap-1.5 p-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded ${isActive ? 'text-primary' : (isFavorites ? 'text-secondary' : 'text-muted-foreground')}`}
                                >
                                    <Icon icon={`material-symbols:${item.icon}`} className="h-5 w-5" aria-hidden="true" />
                                    <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-destructive transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded"
                        >
                            <Icon icon="material-symbols:logout" className="h-5 w-5" aria-hidden="true" />
                            <span className="text-[10px] font-semibold tracking-tight">Sair</span>
                        </button>
                    </div>
                </nav>
            </main>

            <TermsModal
                isOpen={termsModal.isOpen}
                type={termsModal.type}
                onClose={() => setTermsModal(prev => ({ ...prev, isOpen: false }))}
                onAgree={() => { }}
            />

            <style>{`.pb-safe-area { padding-bottom: env(safe-area-inset-bottom); }`}</style>
        </div>
    );
};

export default CandidateLayout;
