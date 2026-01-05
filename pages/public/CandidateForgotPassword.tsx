import React from 'react';
import { Link } from 'react-router-dom';

const CandidateForgotPassword: React.FC = () => {
    return (
        <div className="font-display bg-slate-50 text-slate-900 antialiased flex flex-col min-h-[calc(100vh-80px)] relative transition-colors duration-200 ease-in-out">
            <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10">
                <div className="w-full max-w-[420px] bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden relative">
                    <div className="h-1.5 w-full bg-primary absolute top-0 left-0"></div>
                    <div className="p-8 pb-6">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="size-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/20">
                                <span className="material-symbols-outlined text-[36px] filled">lock_reset</span>
                            </div>
                            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight leading-tight">Recuperar Senha</h1>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[300px]">
                                Digite seu e-mail para receber as instruções de recuperação.
                            </p>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 block" htmlFor="email">E-mail cadastrado</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium outline-none"
                                        id="email"
                                        name="email"
                                        placeholder="seu@email.com.br"
                                        required
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start">
                                <span className="material-symbols-outlined text-blue-500 text-[20px] shrink-0 mt-0.5">info</span>
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Se o e-mail existir em nossa base de dados, enviaremos um link de redefinição válido por 30 minutos.
                                </p>
                            </div>

                            <button className="group w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider outline-none" type="submit">
                                <span>Enviar link</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">send</span>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-primary flex items-center justify-center gap-1.5 transition-colors duration-200">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Voltar para o login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateForgotPassword;
