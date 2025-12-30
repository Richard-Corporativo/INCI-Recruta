import React from 'react';
import { Link } from 'react-router-dom';

const TwoFactorAuth: React.FC = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-hidden min-h-screen flex flex-col relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl"></div>
        </div>
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto">
            <div className="w-full max-w-[440px] bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-3 border-b border-blue-100 dark:border-blue-800/50 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined filled text-primary text-sm">shield</span>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">Ambiente Seguro</span>
                </div>
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                            <span className="material-symbols-outlined text-[32px] text-slate-700 dark:text-slate-200">lock_person</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verificação em Duas Etapas</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Detectamos que seu perfil possui privilégios de <span className="font-semibold text-slate-700 dark:text-slate-200">Admin/Qualidade</span>.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Para continuar, confirme sua identidade.
                        </p>
                    </div>
                    <form action="#" className="flex flex-col gap-6" method="POST">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="verification-code">
                                Código de verificação
                            </label>
                            <div className="relative group">
                                <input autoComplete="one-time-code" autoFocus className="tracking-[0.75em] text-center w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm" id="verification-code" maxLength={6} name="code" placeholder="• • • • • •" type="text"/>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">key</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mt-2">
                                <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">info</span>
                                Use o código gerado pelo seu app autenticador ou enviado para o seu e-mail corporativo.
                            </p>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Expira em 04:59</span>
                            </div>
                            <button className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary rounded" type="button">
                                Reenviar código
                            </button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98]" type="button">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            Validar Acesso
                        </button>
                    </form>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center max-w-sm">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Está tendo problemas? Entre em contato com o suporte de TI em <a className="text-primary hover:underline" href="#">suporte@empresa.com</a>
                </p>
            </div>
        </main>
    </div>
  );
};

export default TwoFactorAuth;