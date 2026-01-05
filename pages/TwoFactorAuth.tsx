import React from 'react';
import { Link } from 'react-router-dom';

const TwoFactorAuth: React.FC = () => {
    return (
        <div className="font-display bg-background text-foreground transition-colors duration-200 antialiased overflow-hidden min-h-screen flex flex-col relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl"></div>
            </div>
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto">
                <div className="w-full max-w-[440px] bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                    <div className="bg-primary/5 px-6 py-3 border-b border-border flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined filled text-primary text-sm">shield</span>
                        <span className="text-xs font-semibold text-primary">Ambiente seguro</span>
                    </div>
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-4 bg-muted border border-border rounded-full mb-4 shadow-inner ring-1 ring-border">
                                <span className="material-symbols-outlined text-[32px] text-foreground">lock_person</span>
                            </div>
                            <h1 className="text-xl font-semibold text-foreground mb-2">Verificação em duas etapas</h1>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                Detectamos que seu perfil possui privilégios de <span className="font-semibold text-foreground">Admin/Qualidade</span>.
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">
                                Para continuar, confirme sua identidade.
                            </p>
                        </div>
                        <form action="#" className="flex flex-col gap-6" method="POST">
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-foreground" htmlFor="verification-code">
                                    Código de verificação
                                </label>
                                <div className="relative group">
                                    <input autoComplete="one-time-code" autoFocus className="text-center w-full bg-background border border-border rounded-base py-3 px-4 text-2xl font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 ease-in-out shadow-inner" id="verification-code" maxLength={6} name="code" placeholder="• • • • • •" type="text" />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">key</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-start gap-1.5 mt-2 font-medium leading-relaxed">
                                    <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">info</span>
                                    Use o código gerado pelo seu app autenticador ou enviado para o seu e-mail corporativo.
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                                    <span className="text-xs font-semibold text-muted-foreground">Expira em 04:59</span>
                                </div>
                                <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded" type="button">
                                    Reenviar código
                                </button>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-base shadow-lg shadow-primary/20 transition-all duration-200 ease-in-out active:translate-y-[1px]" type="button">
                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                Validar acesso
                            </button>
                        </form>
                        <div className="mt-8 pt-6 border-t border-border text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                Voltar para o login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center max-w-sm opacity-60">
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        Está tendo problemas? Entre em contato com o suporte de TI em <span className="text-foreground hover:text-primary transition-colors cursor-pointer underline">suporte@empresa.com</span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TwoFactorAuth;
