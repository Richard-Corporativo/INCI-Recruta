// @component PublicLayout | @tipo layout | @versao 1.0.0
// > Layout rotas públicas — header, footer, nav mobile
// @state isMobileMenuOpen — menu mobile
// @action handleLogout — encerra sessão e navega para /vagas
// @rule Força light mode, full-page routes sem header/footer
// @calls AuthContext.tsx — useAuth, logout
// @calls router-compat.tsx — Link, useNavigate, useLocation

'use client';
import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from '@src/lib/router-compat';
import PrivacyTab from '@src/components/public/PrivacyTab';
import { useAuth } from '@src/context/AuthContext';
import { Icon } from "@iconify/react";
import TermsModal from '@src/components/public/TermsModal';
import PrivacyPortalModal from '@src/components/public/PrivacyPortalModal';

const PublicLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // List of routes that should have NO header/footer (Full Page Experience)
    const isFullPage = useMemo(() => {
        const fullPages = [
            '/login', 
            '/cadastro', 
            '/cadastro/candidato', 
            '/cadastro/empresa', 
            '/recuperar-senha', 
            '/verificar-email'
        ];
        return fullPages.includes(location.pathname || '');
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/vagas');
    };

    React.useEffect(() => {
        setMounted(true);
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }, []);

    if (isFullPage) {
        return (
            <div className="bg-background min-h-screen flex flex-col antialiased" suppressHydrationWarning>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground font-sans overflow-x-hidden min-h-screen flex flex-col antialiased" suppressHydrationWarning>
            {/* Tactical Navigation Console - Balha 10.0 Dual Portal */}
            <header className="h-20 bg-background border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                    <Link to="/vagas" className="outline-none group">
                        <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-10 w-auto object-contain" />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-8 border-r border-border pr-8">
                            {['Vagas', 'Quem somos?', 'Planos'].map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item === 'Vagas' ? "/vagas" : item === 'Planos' ? "#plans" : "https://incibrasil.com.br/"}
                                    target={item === 'Quem somos?' ? "_blank" : undefined}
                                    rel={item === 'Quem somos?' ? "noopener noreferrer" : undefined}
                                    className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-all relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
                                </a>
                            ))}
                        </div>
                        
                        <div className="flex items-center">
                            {mounted && (
                                <>
                                    {isAuthenticated && user ? (
                                        <div className="flex items-center gap-4">
                                            {/* Tactical Dashboard Router - Detecta role e direciona para o portal correto */}
                                            {user.role === 'candidate' ? (
                                                <Link to="/candidate/dashboard">
                                                    <button className="h-11 px-6 bg-gradient-to-r from-[#3857EF] to-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                                        Painel do Candidato
                                                    </button>
                                                </Link>
                                            ) : (
                                                <Link to="/admin/dashboard">
                                                    <button className="h-11 px-6 bg-gradient-to-r from-[#3857EF] to-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                                        Painel da Empresa
                                                    </button>
                                                </Link>
                                            )}
                                            
                                            <button
                                                onClick={handleLogout}
                                                className="size-11 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-all border border-border hover:bg-muted"
                                                title="Sair"
                                            >
                                                <Icon icon="ion:exit-outline" className="size-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="flex items-center px-6">
                                                <div className="flex items-center gap-6">
                                                    <Link to="/login" className="h-11 px-5 rounded-lg bg-gradient-to-r from-[#3857EF] to-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center">
                                                        Login Candidato
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Vertical Divider */}
                                            <div className="w-px h-12 bg-border opacity-60" />

                                            <div className="flex items-center px-6">
                                                <div className="flex items-center gap-6">
                                                    <Link to="/login?type=company" className="h-11 px-5 rounded-lg bg-gradient-to-r from-[#3857EF] to-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center">
                                                        Login Empresa
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden size-11 flex items-center justify-center bg-primary text-primary-foreground rounded-lg"
                    >
                        <Icon icon={isMobileMenuOpen ? "material-symbols:close" : "material-symbols:menu"} className="size-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Navigation - Balha 10.0 Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 bg-background z-50 lg:hidden flex flex-col p-8 space-y-8 animate-in slide-in-from-top-4 duration-300 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <Link to="/vagas" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-semibold tracking-tight uppercase">Vagas</Link>
                        <a href="https://incibrasil.com.br/" target="_blank" rel="noopener noreferrer" className="text-3xl font-semibold tracking-tight uppercase text-muted-foreground">Quem somos?</a>
                        <a href="#plans" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-semibold tracking-tight uppercase text-muted-foreground">Planos</a>
                    </div>
                    
                    <div className="space-y-8 pt-8 border-t border-border">
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Área do Candidato</p>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="h-12 border border-border flex items-center justify-center rounded-lg text-xs font-bold uppercase">Entrar</Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Área da Empresa</p>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/login?type=company" onClick={() => setIsMobileMenuOpen(false)} className="h-12 border border-primary/20 text-primary flex items-center justify-center rounded-lg text-xs font-bold uppercase">Acesso</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Balha 9.1 Footer */}
            <footer className="bg-muted/30 border-t border-border py-8 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-6 lg:col-span-1">
                        <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-8 w-auto mb-3" />
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide max-w-xs leading-relaxed">
                            INCI Recruta <br/>
                            Plataforma de recrutamento
                        </p>
                    </div>
                    
                    <div className="space-y-6 lg:col-start-3">
                        <p className="text-[12px] font-semibold text-foreground uppercase tracking-widest border-b border-border pb-3">SUPORTE</p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => setIsTermsOpen(true)}
                                className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-all text-left"
                            >
                                Termos de Uso
                            </button>
                            <button 
                                onClick={() => setIsPrivacyOpen(true)}
                                className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-all text-left"
                            >
                                Política de Privacidade
                            </button>
                            <a 
                                href="https://incibrasil.com.br/" 
                                target="_blank" 
                                className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-all"
                            >
                                Ajuda e Suporte
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4 lg:col-start-4">
                        <p className="text-[12px] font-semibold text-foreground uppercase tracking-widest border-b border-border pb-3">ENDEREÇOS COMERCIAIS</p>
                        <div className="flex flex-col gap-2 md:items-end">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                COPYRIGHT ©2026. INCI - INSTITUTO NACIONAL DE APERFEIÇOAMENTO PROFISSIONAL <br/>
                                <span className="font-semibold">CNPJ: 36.692.668/0001-94</span>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Privacy Tab */}
            {!isFullPage && <PrivacyTab />}

            {/* Legal Modals */}
            <TermsModal 
                isOpen={isTermsOpen} 
                onClose={() => setIsTermsOpen(false)} 
                type="terms"
                onAgree={() => {}} 
            />
            <PrivacyPortalModal 
                isOpen={isPrivacyOpen} 
                onClose={() => setIsPrivacyOpen(false)} 
            />
        </div>
    );
};

export default PublicLayout;
