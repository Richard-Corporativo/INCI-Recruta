import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRoles } from '../hooks/useRoles';
import StringListEditor from '../components/StringListEditor';

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { addRole } = useRoles();

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    department: '',
    area: '',
    seniority: 'Pleno',
    mission: '',
    responsibilities: '',
    requirements: '',
    status: 'Ativo'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (name: string, items: string[]) => {
    setFormData(prev => ({ ...prev, [name]: items.join('\n') }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRole({
      ...formData,
      open_positions: 0
    });
    navigate('/roles');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
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
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/roles')}
              className="px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-base text-sm font-semibold shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Criar Cargo
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1200px] mx-auto">

          {/* Main Form Card */}
          <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
            <form className="divide-y divide-border" onSubmit={handleSubmit}>
              {/* Section 1: Dados Cadastrais */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-sm">badge</span>
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Dados Cadastrais</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="title">
                      Nome do Cargo <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                      placeholder="Ex: Desenvolvedor Full Stack"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="code">
                      Código do Cargo <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="code" name="code" type="text" value={formData.code} onChange={handleInputChange} required
                      placeholder="Ex: TECH-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="area">
                      Área <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="area" name="area" type="text" value={formData.area} onChange={handleInputChange} required
                      placeholder="Ex: Engenharia"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="department">
                      Departamento <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="department" name="department" type="text" value={formData.department} onChange={handleInputChange} required
                      placeholder="Ex: Tecnologia da Informação"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Classificação */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-muted border border-border text-foreground">
                    <span className="material-symbols-outlined text-sm">category</span>
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Classificação</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Senioridade Padrão <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Júnior', 'Pleno', 'Sênior'].map((level) => (
                        <label key={level} className="cursor-pointer">
                          <input
                            className="peer sr-only" name="seniority" type="radio" value={level}
                            checked={formData.seniority === level}
                            onChange={handleInputChange}
                          />
                          <div className="flex items-center justify-center rounded-base border border-border bg-background py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all duration-200 ease-in-out">
                            {level}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Descrição do Cargo */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-sm">description</span>
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Descrição do Cargo</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="mission">
                      Missão <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 p-3 min-h-[100px] resize-none"
                      id="mission" name="mission" placeholder="Descreva o propósito principal deste cargo..." rows={3}
                      value={formData.mission} onChange={handleInputChange} required
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="responsibilities">
                      Responsabilidades <span className="text-destructive">*</span>
                    </label>
                    <StringListEditor
                      items={formData.responsibilities ? formData.responsibilities.split('\n') : []}
                      onChange={(items) => handleListChange('responsibilities', items)}
                      placeholder="Adicione uma responsabilidade..."
                      addButtonLabel="Adicionar responsabilidade"
                      icon="check_circle"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      O que esperamos de você (Requisitos) <span className="text-destructive">*</span>
                    </label>
                    <StringListEditor
                      items={formData.requirements ? formData.requirements.split('\n') : []}
                      onChange={(items) => handleListChange('requirements', items)}
                      placeholder="Adicione um requisito..."
                      addButtonLabel="Adicionar requisito"
                      icon="verified"
                    />
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
