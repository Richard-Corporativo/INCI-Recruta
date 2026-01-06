import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import TermsModal from '../components/candidate/TermsModal';
import { useAuth } from '../context/AuthContext';

const CandidateLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
        isOpen: false,
        type: 'terms'
    });

    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent double-click

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
        // Enforce light mode on candidate pages to prevent admin theme leakage
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background transition-colors duration-200 ease-in-out">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col bg-sidebar border-r border-sidebar-border h-full transition-colors">
                <div className="p-8 pb-10 flex items-center gap-4 group">
                    <Link to="/candidate/dashboard" className="flex items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 group">
                        <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 duration-200">
                            <span className="material-symbols-outlined text-3xl">hexagon</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-sidebar-foreground leading-tight tracking-tight">INCI Brasil</h1>
                            <p className="text-[10px] font-semibold text-muted-foreground tracking-widest mt-0.5">Candidato</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <Link
                        to="/candidate/applications"
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-base font-semibold text-xs tracking-wider transition-all duration-200 ease-in-out group outline-none focus-visible:ring-2 focus-visible:ring-ring ${window.location.pathname === '/candidate/applications'
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">business_center</span>
                        <span>Candidaturas</span>
                    </Link>
                    <Link
                        to="/candidate/dashboard"
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-base font-semibold text-xs tracking-wider transition-all duration-200 ease-in-out group outline-none focus-visible:ring-2 focus-visible:ring-ring ${window.location.pathname === '/candidate/dashboard'
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">person</span>
                        <span>Meu perfil</span>
                    </Link>
                    <Link
                        to="/candidate/settings"
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-base font-semibold text-xs tracking-wider transition-all duration-200 ease-in-out group outline-none focus-visible:ring-2 focus-visible:ring-ring ${window.location.pathname === '/candidate/settings'
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">settings</span>
                        <span>Ajustes</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-sidebar-border bg-muted/5 transition-colors">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full gap-4 px-4 py-3.5 rounded-base text-xs font-semibold tracking-wider text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[24px]">{isLoggingOut ? 'progress_activity' : 'logout'}</span>
                        <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
                    </button>

                    <div className="mt-6 pt-6 border-t border-sidebar-border flex justify-center gap-8 text-[10px] text-muted-foreground tracking-[0.2em] font-semibold">
                        <button onClick={() => setTermsModal({ isOpen: true, type: 'terms' })} className="hover:text-primary transition-colors outline-none focus-visible:underline">Termos</button>
                        <button onClick={() => setTermsModal({ isOpen: true, type: 'privacy' })} className="hover:text-primary transition-colors outline-none focus-visible:underline">Privacidade</button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">hexagon</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-foreground">INCI Brasil</span>
                    </div>
                    <button className="p-2 text-foreground hover:text-primary transition-colors outline-none">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto pb-24 md:pb-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto w-full px-4 md:px-10 lg:px-14 py-8 md:py-12">
                        <Outlet />
                    </div>
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe-area z-20">
                    <div className="flex justify-around items-center p-3">
                        <Link
                            to="/candidate/applications"
                            className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${window.location.pathname === '/candidate/applications' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[24px]">business_center</span>
                            <span className="text-[10px] font-semibold tracking-tight">Vagas</span>
                        </Link>
                        <Link
                            to="/candidate/dashboard"
                            className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${window.location.pathname === '/candidate/dashboard' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[24px]">person</span>
                            <span className="text-[10px] font-semibold tracking-tight">Perfil</span>
                        </Link>
                        <Link
                            to="/candidate/settings"
                            className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${window.location.pathname === '/candidate/settings' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[24px]">settings</span>
                            <span className="text-[10px] font-semibold tracking-tight">Ajustes</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-destructive transition-colors outline-none"
                        >
                            <span className="material-symbols-outlined text-[24px]">logout</span>
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

            <style>
                {`
                .pb-safe-area {
                    padding-bottom: env(safe-area-inset-bottom);
                }
                `}
            </style>
        </div>
    );
};

export default CandidateLayout;
