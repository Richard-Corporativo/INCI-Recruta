'use client';

// @page CandidateRegister | @tipo page-component | @versao 3.4.0
// > Cadastro candidato — Balha DS v10

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, useNavigate } from '@src/lib/router-compat';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";
import TermsModal from '@src/components/public/TermsModal';
import { analyticsService } from '@src/services/analytics.service';
import { getSafeNextPath, withNextParam } from '@src/lib/navigation';
import { PasswordStrengthIndicator } from '@src/components/ui/PasswordStrengthIndicator';

const CandidateRegister: React.FC = () => {
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const nextPath = getSafeNextPath(searchParams?.get('next'), '/candidate/dashboard');
    const { success, error: toastError } = useToast();
    const [userExists, setUserExists] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    React.useEffect(() => {
        analyticsService.trackEvent('candidate_registration_started');
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserExists(false);

        if (formData.password !== formData.confirmPassword) {
            toastError('As senhas não coincidem.');
            return;
        }

        if (!isTermsAccepted) {
            toastError('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        role: 'candidate',
                        terms_accepted: true,
                        terms_accepted_at: new Date().toISOString()
                    }
                }
            });

            if (error) {
                if (error.message.includes('already registered') || error.status === 422) {
                    setUserExists(true);
                    toastError('Este e-mail já possui uma conta cadastrada.');
                    return;
                }
                throw error;
            }

            analyticsService.trackEvent('candidate_registration_completed');

            // Se sessão foi criada imediatamente (email confirmation desligado), redireciona
            if (data.session) {
                success('Conta criada com sucesso!');
                navigate(nextPath);
            } else {
                // Email confirmation obrigatório — informa o usuário
                success('Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça login.');
                navigate('/login');
            }
        } catch (err: any) {
            toastError(err.message || 'Erro ao criar conta.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
                <Link to="/" className="outline-none group">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className="h-8 w-auto"
                    />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest mb-2 border border-border">
                            Novos Talentos
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Crie sua <br />
                            <span className="text-primary">conta</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Inicie sua jornada no ecossistema de inovação da INCI.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="seu@exemplo.com"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Senha</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Confirmar</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <PasswordStrengthIndicator password={formData.password} />

                                {/* Termos */}
                                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsTermsAccepted(!isTermsAccepted)}
                                            className={`mt-0.5 size-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                                                isTermsAccepted
                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                    : 'border-muted-foreground/30 bg-input hover:border-primary/50'
                                            }`}
                                        >
                                            {isTermsAccepted && <Icon icon="material-symbols:check" className="size-4" />}
                                        </button>
                                        <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                                            Li e concordo com os{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsTermsModalOpen(true)}
                                                className="text-primary font-bold hover:underline underline-offset-4"
                                            >
                                                Termos de Uso
                                            </button>
                                            {' '}e{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsTermsModalOpen(true)}
                                                className="text-primary font-bold hover:underline underline-offset-4"
                                            >
                                                Política de Privacidade
                                            </button>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {userExists && (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in zoom-in duration-300">
                                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-relaxed">
                                        E-mail já cadastrado.{' '}
                                        <Link to={withNextParam('/login', nextPath)} className="underline decoration-primary/30 hover:decoration-primary transition-all">
                                            Fazer login agora?
                                        </Link>
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-xl hover:bg-primary/95 active:scale-[0.98] transition-all duration-200 ease-in-out flex items-center justify-center gap-3 shadow-sm group"
                            >
                                {isLoading ? (
                                    <Icon icon="svg-spinners:ring-resize" className="size-6" />
                                ) : (
                                    <>
                                        <span>Criar Conta Agora</span>
                                        <Icon icon="material-symbols:person-add-rounded" className="size-5 transition-transform group-hover:scale-110" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Já possui conta?{' '}
                                <Link to={withNextParam('/login', nextPath)} className="text-primary hover:text-secondary transition-colors font-bold uppercase tracking-widest ml-1">
                                    Fazer login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                type="terms"
                onAgree={() => {
                    setIsTermsAccepted(true);
                    setIsTermsModalOpen(false);
                }}
            />
        </div>
    );
};

export default CandidateRegister;
