import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-x-hidden min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-primary/10 p-3 rounded-xl mb-4">
                    <span className="material-symbols-outlined text-primary text-4xl filled">work</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center">Recrutamento Interno</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">Portal administrativo e de gestão</p>
            </div>
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col gap-1 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Esqueci minha senha</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Digite seu e-mail para receber as instruções de recuperação.</p>
                    </div>
                    <form className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">E-mail corporativo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                                </div>
                                <input className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors" id="email" name="email" placeholder="seu.nome@empresa.com" required type="email"/>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex gap-3 items-start">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] shrink-0 mt-0.5">info</span>
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                                Se o e-mail existir em nossa base de dados, enviaremos um link de redefinição válido por 30 minutos.
                            </p>
                        </div>
                        <button className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors" type="button">
                            Enviar link de redefinição
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-center">
                        <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Voltar para o login
                        </Link>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                        Problemas com o acesso? Contate o suporte de TI.
                    </p>
                </div>
            </div>
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-600">
                    © 2024 Sistema de Recrutamento. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </div>
  );
};

export default ForgotPassword;