import React, { useState, useCallback } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import TermsModal from '../components/candidate/TermsModal';
import { useAuth } from '../context/AuthContext';

const PublicLayout: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
        isOpen: false,
        type: 'terms'
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/vagas');
    };

    const handleCloseModal = useCallback(() => {
        setTermsModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleOpenTerms = useCallback((type: 'terms' | 'privacy') => {
        setTermsModal({ isOpen: true, type });
        setIsMobileMenuOpen(false); // Close mobile menu if open
    }, []);

    React.useEffect(() => {
        // Enforce light mode on public pages to prevent admin theme leakage
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }, []);

    return (
        <div className="bg-background text-foreground font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-200 ease-in-out">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-border bg-card px-4 lg:px-10 py-4 sticky top-0 z-50 transition-colors">
                <div className="flex items-center gap-4 text-foreground">
                    <Link to="/vagas" className="flex items-center gap-3 hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 group">
                        <div className="size-9 text-primary transition-transform group-hover:scale-110 duration-200">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold leading-tight tracking-tight">INCI Recruta</h2>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-1 justify-end gap-10">
                    <div className="flex items-center gap-10">
                        <Link className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary focus-visible:text-primary transition-colors duration-200 ease-in-out" to="/vagas">Vagas</Link>
                        <a className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary focus-visible:text-primary transition-colors duration-200 ease-in-out" href="mailto:contato@incibrasil.com">Contato</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to={user?.role === 'candidate' ? "/candidate/dashboard" : "/admin/dashboard"}>
                                    <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 border border-border bg-background text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out text-sm font-semibold uppercase tracking-tight">
                                        <span>Meu Painel</span>
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 transition-all duration-200 ease-in-out text-sm font-semibold uppercase tracking-tight"
                                >
                                    <span>Sair</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 border border-border bg-background text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out text-sm font-semibold uppercase tracking-tight">
                                        <span>Entrar</span>
                                    </button>
                                </Link>
                                <Link to="/cadastro">
                                    <button className="flex min-w-[130px] cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-primary text-primary-foreground border border-border/40 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out text-sm font-semibold active:scale-95 uppercase tracking-tight">
                                        <span>Cadastre-se</span>
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-lg transition-colors duration-200 ease-in-out z-50 relative"
                >
                    <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                </button>

                {/* Mobile Navigation Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 top-[73px] bg-background z-40 lg:hidden flex flex-col p-6 animate-in slide-in-from-right-10 duration-200">
                        <nav className="flex flex-col gap-6">
                            <Link
                                to="/vagas"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-semibold uppercase tracking-wider text-foreground py-2 border-b border-border"
                            >
                                Vagas
                            </Link>
                            <a
                                href="mailto:contato@incibrasil.com"
                                className="text-lg font-semibold uppercase tracking-wider text-foreground py-2 border-b border-border"
                            >
                                Contato
                            </a>
                            <div className="flex flex-col gap-4 mt-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link to={user?.role === 'candidate' ? "/candidate/dashboard" : "/admin/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                                            <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-5 border border-border bg-background text-foreground hover:bg-accent transition-all text-sm font-semibold uppercase tracking-tight">
                                                <span>Meu Painel</span>
                                            </button>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all text-sm font-semibold uppercase tracking-tight"
                                        >
                                            <span>Sair</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-5 border border-border bg-background text-foreground hover:bg-accent transition-all text-sm font-semibold uppercase tracking-tight">
                                                <span>Entrar</span>
                                            </button>
                                        </Link>
                                        <Link to="/cadastro" onClick={() => setIsMobileMenuOpen(false)}>
                                            <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-primary-foreground border border-border/40 hover:bg-primary/90 transition-all text-sm font-semibold uppercase tracking-tight">
                                                <span>Cadastre-se</span>
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            <footer className="mt-auto border-t border-border bg-card py-12 px-8 lg:px-20 transition-colors duration-200 ease-in-out">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 text-foreground">
                        <div className="size-8 text-primary">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"></path></svg>
                        </div>
                        <span className="font-semibold text-xl uppercase tracking-tight">INCI Recruta</span>
                    </div>
                    <div className="flex gap-10 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                        <button
                            onClick={() => handleOpenTerms('terms')}
                            className="hover:text-primary transition-colors focus-visible:underline outline-none"
                        >
                            Termos
                        </button>
                        <button
                            onClick={() => handleOpenTerms('privacy')}
                            className="hover:text-primary transition-colors focus-visible:underline outline-none"
                        >
                            Privacidade
                        </button>
                        <a className="hover:text-primary transition-colors focus-visible:underline outline-none" href="mailto:contato@incibrasil.com">Contato</a>
                    </div>

                    <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.2em]">© 2024 INCI Recruta. Todos os direitos reservados.</p>
                </div>

                <TermsModal
                    isOpen={termsModal.isOpen}
                    type={termsModal.type}
                    onClose={handleCloseModal}
                    onAgree={() => { }}
                />
            </footer>
        </div>
    );
};

export default PublicLayout;
