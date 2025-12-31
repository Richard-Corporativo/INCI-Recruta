import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    return (
        <div className="font-display bg-background text-foreground transition-colors duration-200 antialiased overflow-hidden min-h-screen flex items-center justify-center">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[100px]"></div>
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[80px]"></div>
            </div>
            <main className="w-full max-w-md p-6 relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined filled">work</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-foreground leading-tight">Recrutamento</span>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Interno</span>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center size-14 rounded-full bg-muted border border-border text-foreground mb-4 shadow-inner">
                            <span className="material-symbols-outlined text-[28px]">lock_reset</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Redefinir senha</h1>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            Sua nova senha deve ser diferente das senhas utilizadas anteriormente.
                        </p>
                    </div>
                    <form className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-foreground" htmlFor="new-password">
                                Nova senha
                            </label>
                            <div className="relative group">
                                <input className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-base text-sm focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 ease-in-out text-foreground placeholder:text-muted-foreground" id="new-password" placeholder="••••••••" type="password" defaultValue="Senh@Fort" />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-all duration-200 focus:outline-none focus:bg-muted" title="Mostrar senha" type="button">
                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                            </div>
                            <div className="mt-4 bg-muted/30 rounded-lg p-3 border border-border">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Força da senha</span>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Boa</span>
                                </div>
                                <div className="flex gap-1 h-1.5 mb-3 w-full">
                                    <div className="flex-1 bg-emerald-500 rounded-full"></div>
                                    <div className="flex-1 bg-emerald-500 rounded-full"></div>
                                    <div className="flex-1 bg-emerald-500 rounded-full"></div>
                                    <div className="flex-1 bg-background rounded-full"></div>
                                </div>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                        <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                                        <span>Mínimo de 8 caracteres</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                        <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                                        <span>Pelo menos uma letra maiúscula</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                        <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                                        <span>Pelo menos um número</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                        <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
                                        <span>Pelo menos um caractere especial (!@#$%)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-foreground" htmlFor="confirm-password">
                                Confirmar nova senha
                            </label>
                            <div className="relative group">
                                <input className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-base text-sm focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 ease-in-out text-foreground placeholder:text-muted-foreground" id="confirm-password" placeholder="••••••••" type="password" />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-[20px]">lock_clock</span>
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-all duration-200 focus:outline-none focus:bg-muted" title="Mostrar senha" type="button">
                                    <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                                </button>
                            </div>
                        </div>
                        <button className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-base shadow-lg shadow-primary/20 transition-all duration-200 ease-in-out active:translate-y-[1px] flex items-center justify-center gap-2" type="button">
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            Salvar nova senha
                        </button>
                    </form>
                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out group">
                            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Voltar para o login
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center opacity-60">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        © 2024 Sistema Interno de RH. Todos os direitos reservados.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;