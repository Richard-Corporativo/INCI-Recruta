import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    return (
        <div className="font-display bg-background text-foreground transition-colors duration-200 antialiased overflow-x-hidden min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary/10 p-3 rounded-xl mb-4 text-primary">
                        <span className="material-symbols-outlined text-4xl filled">work</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight text-center">Recrutamento Interno</h1>
                    <p className="text-muted-foreground text-sm mt-1 text-center font-medium">Portal administrativo e de gestão</p>
                </div>
                <div className="bg-card border border-border shadow-xl rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="text-xl font-bold text-foreground">Esqueci minha senha</h2>
                            <p className="text-sm text-muted-foreground font-medium">Digite seu e-mail para receber as instruções de recuperação.</p>
                        </div>
                        <form className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-foreground" htmlFor="email">E-mail corporativo</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-muted-foreground text-[20px]">mail</span>
                                    </div>
                                    <input className="block w-full pl-10 pr-3 py-2.5 border bg-background border-border rounded-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 ease-in-out sm:text-sm" id="email" name="email" placeholder="seu.nome@empresa.com" required type="email" />
                                </div>
                            </div>
                            <div className="bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 items-start">
                                <span className="material-symbols-outlined text-blue-500 text-[20px] shrink-0 mt-0.5">info</span>
                                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                    Se o e-mail existir em nossa base de dados, enviaremos um link de redefinição válido por 30 minutos.
                                </p>
                            </div>
                            <button className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-base shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out active:translate-y-[1px]" type="button">
                                Enviar link de redefinição
                            </button>
                        </form>
                        <div className="mt-6 flex items-center justify-center">
                            <Link to="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-all duration-200 ease-in-out">
                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                Voltar para o login
                            </Link>
                        </div>
                    </div>
                    <div className="bg-muted border-t border-border px-8 py-5 flex justify-center">
                        <p className="text-xs text-muted-foreground font-medium text-center">
                            Problemas com o acesso? <span className="text-foreground hover:text-primary transition-colors cursor-pointer underline">Contate o suporte de TI</span>.
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center opacity-60">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        © 2024 Sistema de Recrutamento. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;