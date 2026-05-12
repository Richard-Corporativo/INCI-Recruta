import { Icon } from "@iconify/react";
// @component UserModal | @tipo componente | @versao 1.0.0
// > Modal criar/editar usuários admin — role, permissões, status
// @api user?: User (edit mode), isOpen: bool, onClose: fn

import React, { useState } from 'react';
import { useUsers } from '@src/hooks/useUsers';
import BaseModal from '@src/components/shared/BaseModal';
import CustomSelect from '@src/components/ui/CustomSelect';

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
        company_name: '',
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
        setFormData({ name: '', email: '', password: '', company_name: '', role: 'manager', department: '' });
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[440px]">
            {/* Mode Selector */}
            <div className="flex border-b border-border bg-muted/20 transition-colors rounded-t-2xl overflow-hidden">
                <button
                    onClick={() => setMode('invite')}
                    className={`flex-1 h-12 text-[10px] font-semibold transition-all duration-200 ease-in-out uppercase tracking-wider outline-none focus-visible:bg-accent ${mode === 'invite' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                >
                    Convidar
                </button>
                <button
                    onClick={() => setMode('create')}
                    className={`flex-1 h-12 text-[10px] font-semibold transition-all duration-200 ease-in-out uppercase tracking-wider outline-none focus-visible:bg-accent ${mode === 'create' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                >
                    Criar Direto
                </button>
            </div>

            <div className="flex flex-col max-h-[85vh]">
                <div className="bg-card transition-colors p-6 pb-4">
                    <div className="flex flex-col items-center text-center transition-all">
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 border border-primary/20 transition-colors">
                            <Icon icon={`material-symbols:${mode === 'invite' ? 'person-add' : 'person-add-alt'}`} className="text-[28px]" width="28" height="28" />
                        </div>
                        <h1 className="text-xl font-semibold text-foreground tracking-tight transition-colors">
                            {mode === 'invite' ? 'Convidar Novo Usuário' : 'Criar Nova Conta'}
                        </h1>
                        <p className="text-xs text-muted-foreground font-semibold mt-1 leading-relaxed transition-colors">
                            {mode === 'invite'
                                ? 'Simula o envio de um convite de acesso por e-mail.'
                                : 'Provisiona o acesso imediatamente no sistema.'}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                    <form id="user-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">Nome completo</label>
                        <input
                            className="w-full h-10 px-3.5 bg-background border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring"
                            placeholder="Ex: João Silva"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">E-mail</label>
                            <input
                                className="w-full h-10 px-3.5 bg-background border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring"
                                placeholder="ana@empresa.com"
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">Empresa</label>
                            <input
                                className="w-full h-10 px-3.5 bg-background border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring"
                                placeholder="Ex: INCI Brasil"
                                required
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">Departamento</label>
                        <input
                            className="w-full h-10 px-3.5 bg-background border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring"
                            placeholder="Ex: TI, RH..."
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">
                                {mode === 'invite' ? 'Senha Prov.' : 'Definir Senha'}
                            </label>
                            <input
                                className="w-full h-10 px-3.5 bg-background border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-in-out hover:border-ring"
                                placeholder="••••••••"
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors">Tipo de Acesso</label>
                            <CustomSelect
                                value={formData.role}
                                onChange={(val) => setFormData({ ...formData, role: val as any })}
                                options={[
                                    { label: 'Gestor', value: 'manager' },
                                    { label: 'Administrador', value: 'admin' },
                                    { label: 'Recrutador', value: 'recruiter' }
                                ]}
                            />
                        </div>
                    </div>

                    </form>
                </div>

                <div className="p-6 pt-4 border-t border-border/50 bg-card/50 backdrop-blur-sm rounded-b-2xl">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 px-4 rounded-2xl border border-border text-foreground font-semibold text-sm hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Cancelar
                        </button>
                        <button 
                            form="user-form"
                            className="flex-[2] h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl border border-border/40 transition-all duration-200 ease-in-out active:scale-95 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                            type="submit"
                        >
                            <span>{mode === 'invite' ? 'Enviar Convite' : 'Criar Conta'}</span>
                            <Icon icon={`material-symbols:${mode === 'invite' ? 'send' : 'person-add'}`} className="text-[18px]" width="18" height="18" />
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UserModal;
