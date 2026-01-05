import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

const VerifyEmail: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { success, error, info } = useToast();
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        if (!user?.email) return;
        setIsResending(true);
        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: user.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/#/login`
                }
            });
            if (resendError) throw resendError;
            success('E-mail de verificação reenviado com sucesso!');
        } catch (err: any) {
            error('Erro ao reenviar e-mail: ' + err.message);
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckStatus = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
            success('E-mail verificado! Redirecionando...');
            window.location.reload(); // Refresh to update AuthContext
        } else {
            info('O e-mail ainda não foi confirmado. Verifique sua caixa de entrada.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-display">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="h-1.5 w-full bg-primary"></div>
                <div className="p-8 text-center flex flex-col items-center">
                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                        <span className="material-symbols-outlined text-[44px] filled">mark_email_read</span>
                    </div>

                    <h1 className="text-2xl font-semibold text-slate-900 mb-3">Confirme seu e-mail (opcional)</h1>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        Enviamos um link de confirmação para <strong className="text-slate-900">{user?.email}</strong>.
                        <br />
                        <span className="text-slate-500 text-xs mt-2 block">A confirmação é opcional. Você já pode acessar sua conta!</span>
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => navigate('/candidate/dashboard')}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            <span>Ir para o Dashboard</span>
                        </button>

                        <button
                            onClick={handleCheckStatus}
                            className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition-all duration-200 active:scale-95"
                        >
                            Verificar se confirmei
                        </button>

                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-600 font-medium rounded-md border border-slate-300 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Reenviando...' : 'Reenviar e-mail'}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                        >
                            Sair e fazer login novamente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
