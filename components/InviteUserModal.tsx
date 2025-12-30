import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose }) => {
    const { addUser } = useUsers();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager' as 'admin' | 'manager' | 'recruiter',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            ...formData,
            status: 'active',
        });
        alert("Usuário convidado com sucesso!");
        onClose();
        setFormData({ name: '', email: '', password: '', role: 'manager' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-400 absolute top-0 left-0"></div>
                <div className="p-8 pb-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="size-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
                            <span className="material-symbols-outlined text-[32px]">person_add</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Convidar Novo Gestor</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            Envie um convite de acesso para o novo gestor.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nome completo</label>
                            <input
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                                placeholder="Nome completo"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">E-mail corporativo</label>
                            <input
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                                placeholder="nome@empresa.com"
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Senha Provisória</label>
                            <input
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Acesso</label>
                            <select
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            >
                                <option value="manager">Gestor</option>
                                <option value="admin">Administrador</option>
                                <option value="recruiter">Recrutador</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button className="flex-[2] bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2" type="submit">
                                <span>Convidar</span>
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InviteUserModal;
