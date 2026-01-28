import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRoles } from '../hooks/useRoles';
import RequirementsSelector from '../components/RequirementsSelector';
import DynamicListInput from '../components/DynamicListInput';
import { DEPARTMENT_AREAS } from '../constants/departments';
import { useAuth } from '../hooks/useAuth';

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { addRole } = useRoles();
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (user && user.role === 'manager') {
      setIsAuthorized(false);
      navigate('/roles');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    revision_code: '01',
    department: '',
    area: '',
    level: 1,
    seniority: 'Pleno',
    mission: '',
    responsibilities: [] as string[],
    requirements: [] as string[],
    requirements_technical: [] as string[],
    requirements_behavioral: [] as string[],
    kpis: [] as string[],
    competencies: [] as string[],
    status: 'Ativo',
    experience_min: '',
    reports_to: 'Gestor da Área'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRole({
      ...formData,
      responsibilities: formData.responsibilities.join('\n'),
      requirements: formData.requirements.join('\n'),
      requirements_technical: formData.requirements_technical.join('\n'),
      requirements_behavioral: formData.requirements_behavioral.join('\n'),
      kpis: formData.kpis.join('\n'),
      competencies: formData.competencies.join('\n'),
      open_positions: 0
    });
    navigate('/roles');
  };

  if (!isAuthorized) return null;

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
        <div className="max-w-[1200px] mx-auto pb-12">

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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="code">
                        Código <span className="text-destructive">*</span>
                      </label>
                      <input
                        className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                        id="code" name="code" type="text" value={formData.code} onChange={handleInputChange} required
                        placeholder="Ex: TECH-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="revision_code">
                        Revisão <span className="text-destructive">*</span>
                      </label>
                      <input
                        className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                        id="revision_code" name="revision_code" type="text" value={formData.revision_code} onChange={handleInputChange} required
                        placeholder="01"
                      />
                    </div>
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
                    <label className="text-sm font-semibold text-foreground" htmlFor="reports_to">
                      Reporta a <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="reports_to" name="reports_to" type="text" value={formData.reports_to} onChange={handleInputChange} required
                      placeholder="Ex: Gerente de Operações"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="department">
                      Área de Atuação <span className="text-destructive">*</span>
                    </label>
                    <select
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="department" name="department" value={formData.department} onChange={handleInputChange} required
                    >
                      <option value="">Selecione uma área</option>
                      {DEPARTMENT_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
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
                      Senioridade <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Júnior', 'Pleno', 'Sênior'].map((level) => (
                        <label key={level} className="cursor-pointer">
                          <input
                            className="peer sr-only" name="seniority" type="radio" value={level}
                            checked={formData.seniority === level}
                            onChange={handleInputChange}
                          />
                          <div className="flex items-center justify-center rounded-base border border-border bg-background py-2.5 text-xs font-semibold text-muted-foreground hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all duration-200 ease-in-out">
                            {level}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="experience_min">
                      Experiência Mínima <span className="text-destructive">*</span>
                    </label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="experience_min" name="experience_min" type="text" value={formData.experience_min} onChange={handleInputChange} required
                      placeholder="Ex: 2+ anos"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Requisitos Detalhados */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-sm">clinical_notes</span>
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
                    <span className="material-symbols-outlined text-sm">description</span>
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Escopo do Cargo</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wider text-[11px]" htmlFor="mission">
                      Missão <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      className="block w-full h-24 rounded-md border border-border bg-background text-foreground font-medium transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-3.5 text-sm resize-none placeholder:text-muted-foreground"
                      id="mission" name="mission" placeholder="Descreva o propósito principal deste cargo..."
                      value={formData.mission} onChange={handleInputChange} required
                    ></textarea>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wider text-[11px]" htmlFor="responsibilities">
                      Responsabilidades <span className="text-destructive">*</span>
                    </label>
                    <DynamicListInput
                      label=""
                      placeholder="Digite uma responsabilidade e pressione Enter"
                      items={formData.responsibilities}
                      onChange={(items) => setFormData(prev => ({ ...prev, responsibilities: items }))}
                      icon="task_alt"
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
