'use client';

// @page CreateRole | @tipo page-component | @versao 1.0.0
// > Formulário de criação de cargo/perfil — permissões, escopo
// @calls useRoles — create, Breadcrumbs — navegação

import React, { useState, useEffect } from 'react';
import { useNavigate } from '@src/lib/router-compat';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useRoles } from '@src/hooks/useRoles';
import RequirementsSelector from '@src/components/shared/RequirementsSelector';
import DynamicListInput from '@src/components/shared/DynamicListInput';
import { DEPARTMENT_AREAS } from '@src/constants/departments';
import { useAuth } from '@src/hooks/useAuth';
import type { Role } from '@src/types';
import { Icon } from "@iconify/react";

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { addRole } = useRoles();
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'manager') {
      setIsAuthorized(false);
      navigate('/roles');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    area: '',
    level: '1', // banco é text
    mission: '',
    requirements_technical: [] as string[],
    requirements_behavioral: [] as string[],
    kpis: [] as string[],
    competencies: [] as string[],
    status: 'Ativo',
    reports_to: 'Gestor da Área'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // level é text no banco — sem parseInt
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const success = await addRole({
        ...formData,
        level: parseInt(formData.level) || 1,
        status: formData.status as Role['status'],
        requirements_technical: formData.requirements_technical,
        requirements_behavioral: formData.requirements_behavioral,
        kpis: formData.kpis,
        competencies: formData.competencies,
        open_positions: 0
      });
      if (success) {
        navigate('/roles');
      } else {
        setSaveError('Não foi possível salvar o cargo. Verifique sua conexão e tente novamente.');
      }
    } catch {
      setSaveError('Erro inesperado ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card -b - z-20 shrink-0 sticky top-0 p-6">
        <div className="mb-3">
          <Breadcrumbs items={[
            { label: 'Cargos', to: '/roles' },
            { label: 'Criar Cargo' }
          ]} />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Criar Novo Cargo</h1>
            <p className="text-muted-foreground text-sm mt-1">Preencha os detalhes abaixo para cadastrar uma nova função no sistema.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {saveError && (
              <p className="text-sm text-destructive">{saveError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/roles')}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-xl hover:bg-accent transition-all duration-200 ease-in-out active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Icon icon={isSaving ? "material-symbols:progress-activity" : "material-symbols:save"} className={`h-5 w-5 ${isSaving ? 'animate-spin' : ''}`} aria-hidden="true" />
                {isSaving ? 'Salvando...' : 'Criar Cargo'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1200px] mx-auto pb-12">

          {/* Main Form Card */}
          <div className="bg-card rounded-2xl overflow-hidden p-6">
            <form className="divide-y divide-border" onSubmit={handleSubmit}>
              {/* Section 1: Dados Cadastrais */}
              {/* Seção de Dados Cadastrais removida conforme solicitação */}



              {/* Section 3: Requisitos Detalhados removida conforme solicitação */}


              {/* Section 4: Missão e Responsabilidades */}
              <div className="p-6 md:p-8 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon icon="material-symbols:description" className="text-sm h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Missão do Cargo</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">

                    <textarea
                      className="block w-full h-24 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-3.5 text-sm resize-none placeholder:text-muted-foreground"
                      id="mission" name="mission" placeholder="Descreva o propósito principal deste cargo..."
                      value={formData.mission} onChange={handleInputChange} required
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateRole;
