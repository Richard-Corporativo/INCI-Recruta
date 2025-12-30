import React from 'react';
import { Link } from 'react-router-dom';

const RequestAccess: React.FC = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-x-hidden">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"></div>
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-400/5 dark:bg-blue-400/10 blur-3xl"></div>
            </div>
            <div className="w-full max-w-[480px] bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col">
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 mb-5 ring-1 ring-red-100 dark:ring-red-800/30 shadow-sm">
                        <span className="material-symbols-outlined text-[32px]">lock_person</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acesso Negado</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Sua conta ainda não foi habilitada no sistema.
                    </p>
                </div>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-blue-400 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Solicitar Acesso</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Preencha seus dados para liberação</p>
                        </div>
                    </div>
                    <form action="#" className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide" htmlFor="name">Nome Completo</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">badge</span>
                                <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" id="name" placeholder="Ex: Ana Silva" required type="text"/>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide" htmlFor="email">E-mail Corporativo</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">mail</span>
                                <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" id="email" placeholder="nome@empresa.com" required type="email"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide" htmlFor="department">Área</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">apartment</span>
                                    <input className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" id="department" placeholder="Ex: RH" required type="text"/>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide" htmlFor="manager">Gestor</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">supervisor_account</span>
                                    <input className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" id="manager" placeholder="Nome" required type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group" type="submit">
                                <span>Enviar Solicitação</span>
                                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                        <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center justify-center gap-2 group">
                            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                            Voltar para o Login
                        </Link>
                    </div>
                </div>
            </div>
            <p className="mt-8 text-xs text-slate-400 dark:text-slate-600 text-center font-medium">
                © 2024 Internal Recruitment System.
            </p>
        </div>
    </div>
  );
};

export default RequestAccess;