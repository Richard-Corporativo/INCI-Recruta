'use client';

// @page CompanyRegister | @tipo page-component | @versao 2.0.0
// > Cadastro Empresa — Balha DS v10.0.0

import React, { useState } from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

const CompanyRegister: React.FC = () => {
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const [userExists, setUserExists] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        cnpj: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserExists(false);

        if (formData.password !== formData.confirmPassword) {
            toastError('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        try {
            const cleanCnpj = formData.cnpj.replace(/\D/g, '');
            const { data, error } = await supabase.auth.signUp({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        company_name: formData.companyName,
                        cnpj: cleanCnpj,
                        // Marcação para que o AuthContext crie a empresa no primeiro login
                        // (caso confirmação de email esteja ativa)
                        pending_company_creation: true,
                        role: 'owner',
                        status: 'active'
                    }
                }
            });

            if (error) {
                if (error.message.includes('already registered') || error.status === 422) {
                    setUserExists(true);
                    toastError('Este e-mail já possui uma conta.');
                    return;
                }
                throw error;
            }

            // Sessão criada imediatamente — cria empresa via RPC e redireciona
            if (data.session) {
                const { error: rpcError } = await supabase.rpc('create_company_with_owner', {
                    p_name: formData.companyName,
                    p_cnpj: cleanCnpj || null
                });

                if (rpcError) {
                    toastError(`Conta criada, mas falhou ao criar empresa: ${rpcError.message}`);
                    navigate('/login?type=company');
                    return;
                }

                success('Empresa registrada com sucesso!');
                navigate('/admin/dashboard');
            } else {
                // Email confirmation obrigatório — a empresa será criada no primeiro login (AuthContext)
                success('Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça login.');
                navigate('/login?type=company');
            }
        } catch (err: any) {
            toastError(err.message || 'Erro ao criar conta de empresa.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
                <Link to="/" className="outline-none group">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className="h-8 w-auto"
                    />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2 border border-primary/20">
                            Portal da Empresa
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Expanda sua <br />
                            <span className="text-primary">Equipe</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Crie sua conta corporativa para gerenciar talentos.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome da Empresa</label>
                                    <input
                                        type="text"
                                        placeholder="Razão social ou Nome Fantasia"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">CNPJ</label>
                                    <input
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                                        maxLength={18}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Seu Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Gestor de RH / Responsável"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        placeholder="rh@suaempresa.com"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Senha</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Confirmar</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full h-12 px-4 bg-input border border-border rounded-lg text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {userExists && (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in zoom-in duration-300">
                                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-relaxed">
                                        E-mail já cadastrado.{' '}
                                        <Link to="/login?type=company" className="underline decoration-primary/30 hover:decoration-primary transition-all">
                                            Fazer login business?
                                        </Link>
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-xl hover:bg-primary/95 active:scale-[0.98] transition-all duration-200 ease-in-out flex items-center justify-center gap-3 shadow-sm group"
                            >
                                {isLoading ? (
                                    <Icon icon="svg-spinners:ring-resize" className="size-6" />
                                ) : (
                                    <span>Registrar Empresa</span>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Já possui conta?{' '}
                                <Link to="/login?type=company" className="text-primary hover:text-secondary transition-colors font-bold uppercase tracking-widest ml-1">
                                    Fazer login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyRegister;
