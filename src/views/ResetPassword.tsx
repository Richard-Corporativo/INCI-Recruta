'use client';

// @page ResetPassword | @tipo page-component | @versao 9.6.0
// > Redefinição de senha — Semantic Tokens

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, useNavigate } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { PasswordStrengthIndicator, getPasswordStrength } from '@src/components/ui/PasswordStrengthIndicator';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const searchParams = useSearchParams();
    const code = searchParams?.get('code');
    const isCompanyView = searchParams?.get('type') === 'company';
    const loginPath = isCompanyView ? '/login?type=company' : '/login';
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(true);

    // Troca o código da URL por uma sessão ativa ou verifica se já existe
    useEffect(() => {
        const handleSessionExchange = async () => {
            try {
                // Se houver código, tenta trocar
                if (code) {
                    await supabase.auth.exchangeCodeForSession(code);
                }
                
                // Verifica se agora temos uma sessão ativa
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session && code) {
                    toastError('O link de recuperação é inválido ou expirou.');
                }
            } catch (error) {
                console.error('Session error:', error);
            } finally {
                // Sempre libera a tela após a tentativa, para não travar o usuário
                setIsValidating(false);
            }
        };

        handleSessionExchange();
    }, [code]);

    const strength = getPasswordStrength(password);
    const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;
    const canSubmit = password && confirmPassword && passwordsMatch && strength >= 2 && !isSubmitting && !isValidating;

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);

        try {
            // 1. Atualizar a senha no Auth
            const { data: { user }, error } = await supabase.auth.updateUser({ 
                password: password 
            });

            if (error) {
                if (error.message.includes('same as the old one')) {
                    toastError('A nova senha não pode ser igual à anterior.');
                } else if (error.message.includes('token') || error.message.includes('session')) {
                    toastError('Sua sessão expirou. Solicite um novo e-mail de recuperação.');
                } else {
                    toastError(error.message || 'Erro ao redefinir senha.');
                }
                return;
            }

            // 2. Registrar log de auditoria se houver usuário
            if (user) {
                await supabase.from('audit_logs').insert({
                    action: 'PASSWORD_RESET',
                    user_id: user.id,
                    user_email: user.email,
                    resource_type: 'user',
                    resource_id: user.id,
                    details: { 
                        method: 'recovery_link',
                        timestamp: new Date().toISOString()
                    }
                });
            }

            success('Sua senha foi redefinida com sucesso.');
            
            // Redireciona para o Dashboard correto
            const targetDashboard = isCompanyView ? '/admin/dashboard' : '/candidate/dashboard';
            
            setTimeout(() => {
                navigate(targetDashboard);
            }, 1000);

        } catch (err) {
            console.error('Reset error:', err);
            toastError('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
                <div className="space-y-4 text-center">
                    <Icon icon="svg-spinners:ring-resize" className="size-10 text-primary mx-auto" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        Validando link de recuperação...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-10">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest mb-2 border border-border">
                            Segurança
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Nova Senha
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Defina uma nova credencial forte para proteger seus dados.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="password">
                                        Nova Senha
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    
                                    <PasswordStrengthIndicator password={password} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="confirmPassword">
                                        Confirmar Nova Senha
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Repita a nova senha"
                                        className={`w-full h-12 px-4 bg-input border rounded-md text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 ${
                                            !passwordsMatch ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    {!passwordsMatch && (
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-top-1">
                                            As senhas não coincidem
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button 
                                className={`w-full h-14 font-bold text-[13px] uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-3 shadow-sm group ${
                                    canSubmit 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/95 active:scale-[0.98]' 
                                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                                }`} 
                                type="submit"
                                disabled={!canSubmit}
                            >
                                {isSubmitting ? (
                                    <Icon icon="svg-spinners:ring-resize" className="size-6" />
                                ) : (
                                    <>
                                        <span>Redefinir e Entrar</span>
                                        <Icon icon="material-symbols:check-circle-rounded" className={`size-5 transition-transform ${canSubmit ? 'group-hover:scale-110' : ''}`} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-8 border-t border-border text-center">
                            <Link to={loginPath} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
                                Cancelar e voltar ao login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;
