'use client';

// @page EditUser | @tipo page-component | @versao 1.0.0
// > Edição de usuário — role, status, permissões
// @calls useUsers — fetchById/update, useParams — user id

import React, { useState } from 'react';
import { useNavigate, useParams } from '@src/lib/router-compat';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useUsers } from '@src/hooks/useUsers';
import { Icon } from "@iconify/react";

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { users, updateUser, isLoading: isUsersLoading } = useUsers();

  const user = users.find(u => u.id === id);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'recruiter',
    department: user?.department || 'Tecnologia',
    status: user?.status || 'active'
  });

  // Sync formData when user is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'recruiter',
        department: user.department || 'Tecnologia',
        status: user.status || 'active'
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    try {
      await updateUser(id, {
        name: formData.name,
        email: formData.email, // Passing email for visual update
        role: formData.role as any,
        status: formData.status as 'active' | 'suspended',
        department: formData.department
      });
      navigate('/settings');
    } catch (error) {
      console.error('Falha ao atualizar usuário:', error);
      alert('Ocorreu um erro ao salvar as alterações. Verifique se você tem permissão.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isUsersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="material-symbols:progress-activity" className="animate-spin text-primary h-5 w-5" aria-hidden="true" />
          <p className="text-muted-foreground font-medium">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  if (!user && !isUsersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
        <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <Icon icon="material-symbols:error" className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Usuário não encontrado</h2>
        <p className="text-muted-foreground mt-2 mb-6">Não foi possível localizar os dados deste colaborador no sistema.</p>
        <button onClick={() => navigate('/settings')} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-all">
          <Icon icon="material-symbols:arrow-back" className="h-5 w-5" aria-hidden="true" />
          Voltar para Configurações
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card -b - z-20 shrink-0 sticky top-0 p-6">
        <div className="mb-3">
          <Breadcrumbs
            items={[
              { label: 'Configurações', to: '/settings' },
              { label: 'Usuários', to: '/settings' },
              { label: 'Editar Usuário' }
            ]}
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary border border-primary/20">
              {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">{formData.name}</h1>
              <p className="text-muted-foreground text-sm font-medium">ID: {id} • Último acesso: {user?.lastAccess}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-xl hover:bg-accent transition-all duration-200 ease-in-out active:translate-y-[1px]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px]"
            >
              {isLoading ? (
                <Icon icon="material-symbols:progress-activity" className="animate-spin h-4 w-4" aria-hidden="true" />
              ) : (
                <Icon icon="material-symbols:save" className="h-5 w-5" aria-hidden="true" />
              )}
              {isLoading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-3xl mx-auto pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-2xl overflow-hidden p-6">
              <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center gap-2 h-14">
                <Icon icon="material-symbols:manage-accounts" className="text-primary h-5 w-5" aria-hidden="true" />
                <h2 className="text-foreground font-semibold text-lg">Dados de Acesso e Perfil</h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground" htmlFor="name">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground" htmlFor="email">E-mail Corporativo</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-semibold focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground" htmlFor="role">Perfil de Acesso</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-semibold capitalize focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 cursor-pointer"
                  >
                    <option value="admin">Administrador</option>
                    <option value="quality">Qualidade</option>
                    <option value="dp">DP</option>
                    <option value="manager">Gestor</option>
                    <option value="recruiter">Recrutador</option>
                  </select>
                  <p className="text-xs text-muted-foreground font-medium">
                    Define as permissões e visibilidade dentro do sistema.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground" htmlFor="department">Departamento/Setor Principal</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-semibold focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Produto">Produto</option>
                    <option value="Vendas">Vendas</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground">Status da Conta</label>
                  <div className="flex gap-4">
                    <label className={`flex flex-1 items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${formData.status === 'active' ? 'bg-primary/5 border-primary text-primary' : 'bg-background border-border text-muted-foreground hover:bg-accent'}`}>
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Icon icon="material-symbols:{formData.status === 'active' ? 'check-circle' : 'radio-button-unchecked'}" className="text-[20px]" width="20" height="20" />
                      <span className="text-sm font-semibold">Ativo</span>
                    </label>
                    <label className={`flex flex-1 items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${formData.status === 'suspended' ? 'bg-destructive/5 border-destructive text-destructive' : 'bg-background border-border text-muted-foreground hover:bg-accent'}`}>
                      <input
                        type="radio"
                        name="status"
                        value="suspended"
                        checked={formData.status === 'suspended'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Icon icon="material-symbols:{formData.status === 'suspended' ? 'report' : 'radio-button-unchecked'}" className="text-[20px]" width="20" height="20" />
                      <span className="text-sm font-semibold">Suspenso</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditUser;
