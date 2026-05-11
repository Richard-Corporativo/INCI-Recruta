'use client';
import { Icon } from "@iconify/react";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useRoles } from '@src/hooks/useRoles';
import DynamicListInput from '@src/components/shared/DynamicListInput';

const CreateRolePage: React.FC = () => {
  const router = useRouter();
  const { addRole } = useRoles();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    area: '',
    level: 1,
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
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRole({
      ...formData,
      status: formData.status as 'Ativo' | 'Inativo',
      requirements_technical: formData.requirements_technical.join('\n'),
      requirements_behavioral: formData.requirements_behavioral.join('\n'),
      kpis: formData.kpis.join('\n'),
      competencies: formData.competencies.join('\n'),
      open_positions: 0
    });
    router.push('/admin/roles');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20  shrink-0 sticky top-0">
        <div className="mb-3">
          <Breadcrumbs items={[
            { label: 'Cargos', to: '/admin/roles' },
            { label: 'Criar Cargo' }
          ]} />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Criar Novo Cargo</h1>
            <p className="text-muted-foreground text-sm mt-1">Preencha os detalhes abaixo para cadastrar uma nova função no sistema.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/roles')}
              className="px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-2xl hover:bg-accent transition-all duration-200 ease-in-out  active:translate-y-[1px]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-2xl text-sm font-semibold  transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px]"
            >
              <Icon icon="material-symbols:save" className="text-[20px]" width="20" height="20" />
              Criar Cargo
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1200px] mx-auto pb-12">

          {/* Main Form Card */}
          <div className="bg-card border border-border  rounded-2xl overflow-hidden">
            <form className="divide-y divide-border" onSubmit={handleSubmit}>
              {/* Section 1: Dados Cadastrais */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon icon="material-symbols:badge" className="text-sm" width="20" height="20" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Dados Cadastrais</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="title">
                      Nome do Cargo <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-2xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                      placeholder="Ex: Desenvolvedor Full Stack"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="area">
                      Área <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-2xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="area" name="area" type="text" value={formData.area} onChange={handleInputChange} required
                      placeholder="Ex: Engenharia"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="reports_to">
                      Reporta a <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-2xl border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="reports_to" name="reports_to" type="text" value={formData.reports_to} onChange={handleInputChange} required
                      placeholder="Ex: Gerente de Operações"
                    />
                  </div>
                  
                </div>
              </div>



              {/* Section 3: Requisitos Detalhados */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon icon="material-symbols:clinical-notes" className="text-sm" width="20" height="20" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Requisitos e Competências</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">Requisitos Técnicos</label>
                    <DynamicListInput
                      label=""
                      placeholder="Ex: React, SQL, Inglês..."
                      items={formData.requirements_technical}
                      onChange={(items) => setFormData(prev => ({ ...prev, requirements_technical: items }))}
                      icon="engineering"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">Requisitos Comportamentais</label>
                    <DynamicListInput
                      label=""
                      placeholder="Ex: Liderança, Comunicação..."
                      items={formData.requirements_behavioral}
                      onChange={(items) => setFormData(prev => ({ ...prev, requirements_behavioral: items }))}
                      icon="psychology"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">KPIs (Indicadores de Desempenho)</label>
                    <DynamicListInput
                      label=""
                      placeholder="Ex: Tempo de resposta, Satisfação..."
                      items={formData.kpis}
                      onChange={(items) => setFormData(prev => ({ ...prev, kpis: items }))}
                      icon="insights"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">Competências Obrigatórias</label>
                    <DynamicListInput
                      label=""
                      placeholder="Ex: Resolução de conflitos..."
                      items={formData.competencies}
                      onChange={(items) => setFormData(prev => ({ ...prev, competencies: items }))}
                      icon="stars"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Missão e Responsabilidades */}
              <div className="p-6 md:p-8 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon icon="material-symbols:description" className="text-sm" width="20" height="20" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Escopo do Cargo</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wider text-[11px]" htmlFor="mission">
                      Missão <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      className="block w-full h-24 rounded-2xl border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-3.5 text-sm resize-none placeholder:text-muted-foreground"
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

export default CreateRolePage;
