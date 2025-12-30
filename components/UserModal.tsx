import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import BaseModal from './BaseModal';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (message: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { addUser } = useUsers();
    const [mode, setMode] = useState<'invite' | 'create'>('invite');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager' as 'admin' | 'manager' | 'recruiter',
        department: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            ...formData,
            status: 'active',
        });

        const message = mode === 'invite'
            ? "Convite enviado com sucesso!"
            : "Usuário criado com sucesso!";

        if (onSuccess) onSuccess(message);
        onClose();
        setFormData({ name: '', email: '', password: '', role: 'manager', department: '' });
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[440px]">
            {/* Mode Selector */}
            <div className="flex border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setMode('invite')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'invite' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Convidar
                </button>
                <button
                    onClick={() => setMode('create')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'create' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Criar Direto
                </button>
            </div>

            <div className="p-8 pt-6 pb-8">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="size-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-primary mb-3 shadow-sm border border-blue-100 dark:border-blue-800/30">
                        <span className="material-symbols-outlined text-[28px]">
                            {mode === 'invite' ? 'person_add' : 'person_add_alt'}
                        </span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {mode === 'invite' ? 'Convidar Novo Usuário' : 'Criar Nova Conta'}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {mode === 'invite'
                            ? 'Simula o envio de um convite de acesso por e-mail.'
                            : 'Provisiona o acesso imediatamente no sistema.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nome completo</label>
                        <input
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Ex: João Silva"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">E-mail</label>
                            <input
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="ana@empresa.com"
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Departamento</label>
                            <input
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Ex: TI, RH..."
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                {mode === 'invite' ? 'Senha Prov.' : 'Definir Senha'}
                            </label>
                            <input
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tipo de Acesso</label>
                            <select
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            >
                                <option value="manager">Gestor</option>
                                <option value="admin">Administrador</option>
                                <option value="recruiter">Recrutador</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button className="flex-[2] bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2" type="submit">
                            <span>{mode === 'invite' ? 'Enviar Convite' : 'Criar Conta'}</span>
                            <span className="material-symbols-outlined text-[18px]">
                                {mode === 'invite' ? 'send' : 'person_add'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
};

export default UserModal;
