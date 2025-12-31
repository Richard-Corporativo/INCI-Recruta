import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import { useRoles } from '../hooks/useRoles';
import { Role } from '../types';

interface JobFormData {
  roleTitle: string;
  roleCode: string;
  department: string;
  location: string;
  model: string;
  contract: string;
  urgency: string;
  salaryMin: string;
  salaryMax: string;
  context: string;
  mission: string;
  responsibilities: string;
  roleId?: string;
  seniority?: string;
}

const CreateJob: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { addJob } = useJobs();
  const { roles } = useRoles();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    roleTitle: '',
    roleCode: '',
    department: '',
    location: 'São Paulo',
    model: 'Híbrido',
    contract: 'CLT (Efetivo)',
    urgency: 'Média',
    salaryMin: '',
    salaryMax: '',
    context: '',
    mission: '',
    responsibilities: '',
    seniority: 'Pleno'
  });

  useEffect(() => {
    if (searchTerm) {
      setFilteredRoles(roles.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setIsDropdownOpen(true);
    } else {
      setFilteredRoles(roles);
    }
  }, [searchTerm, roles]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      roleTitle: role.title,
      roleCode: role.code,
      department: role.department,
      mission: role.mission || '',
      responsibilities: role.responsibilities || '',
      roleId: role.id,
      seniority: role.seniority || 'Pleno'
    }));
    setSearchTerm(role.title);
    setIsDropdownOpen(false);
  };

  const handlePublish = () => {
    const newJob = {
      title: formData.roleTitle,
      context: formData.context || 'Nova oportunidade',
      department: formData.department,
      location: formData.location,
      model: formData.model as any,
      contract: formData.contract as any,
      urgency: formData.urgency as any,
      status: 'Ativa' as const,
      salary_min: Number(formData.salaryMin) || 0,
      salary_max: Number(formData.salaryMax) || 0,
      mission: formData.mission,
      candidates_count: 0
    };

    addJob(newJob);
    navigate('/jobs');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
        <div className="mb-3">
          <Breadcrumbs
            items={[
              { label: 'Vagas', to: '/jobs' },
              { label: 'Criar Nova Vaga' }
            ]}
          />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Criar Nova Vaga</h1>
            <p className="text-muted-foreground text-sm mt-1">Defina os detalhes da nova oportunidade estratégica no sistema.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1200px] mx-auto pb-24">

          {/* Progress Bar */}
          <div className="bg-card border-border shadow-sm rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-0.5">
                  Passo {step} de 3
                </p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {step === 1 ? 'Selecionar Cargo' : step === 2 ? 'Contexto da Vaga' : 'Revisão'}
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Select Role */}
          {step === 1 && (
            <div className="bg-card border-border shadow-sm rounded-lg overflow-hidden flex flex-col">
              <div className="p-6 md:p-8 border-b border-border">
                <h3 className="text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out h3">Qual cargo você deseja contratar?</h3>
                <div className="relative group mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Selecione um Cargo do Catálogo <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                      className="block w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                      placeholder="Digite o nome do cargo ou código..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && filteredRoles.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {filteredRoles.map(role => (
                          <div
                            key={role.id}
                            className="px-4 py-3 hover:bg-muted cursor-pointer flex justify-between items-center border-b border-border/50 last:border-0"
                            onClick={() => handleSelectRole(role)}
                          >
                            <div>
                              <div className="font-bold text-foreground text-sm">{role.title}</div>
                              <div className="text-xs text-muted-foreground">{role.department} • {role.code}</div>
                            </div>
                            <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => navigate('/roles/create')}
                    className="text-sm font-bold text-primary hover:underline flex items-center justify-end gap-1 ml-auto"
                  >
                    + Criar Novo Cargo no Catálogo
                  </button>
                </div>
              </div>

              {selectedRole ? (
                <div className="bg-muted/10 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Preview do Cargo</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>
                      Ativo
                    </span>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-foreground font-bold h4">{selectedRole.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">Código: <span className="font-mono text-foreground">{selectedRole.code}</span></p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-1.5 rounded-md self-start">
                          <span className="material-symbols-outlined text-[18px]">domain</span>
                          {selectedRole.department}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">Senioridade / Família</span>
                          <p className="text-sm font-medium text-foreground">{selectedRole.seniority || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">Reporta a</span>
                          <p className="text-sm font-medium text-foreground">Gestor da Área</p>
                        </div>
                      </div>
                      {selectedRole.mission && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">Missão do Cargo</span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedRole.mission}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground italic bg-muted/20">
                  Selecione um cargo acima para visualizar os detalhes.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Context */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-card border-border shadow-sm rounded-lg overflow-hidden h-fit sticky top-0">
                  <div className="p-4 bg-slate-50 dark:bg-[#253240] border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-slate-500">lock</span>
                      <h2 className="text-foreground font-bold hover:text-primary transition-all duration-200 ease-in-out h2">Conteúdo fixo do Cargo</h2>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex gap-3 items-start">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm mt-0.5">info</span>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                        Essas informações vêm do <span className="font-semibold">Catálogo de Cargos</span> e não podem ser alteradas aqui.
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    <details className="group open" open>
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span>Missão do Cargo</span>
                        <span className="transition group-open:rotate-180">
                          <span className="material-symbols-outlined text-slate-400">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-sm text-slate-600 dark:text-slate-400 px-4 pb-4 animate-fadeIn leading-relaxed">
                        {formData.mission}
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span>Responsabilidades</span>
                        <span className="transition group-open:rotate-180">
                          <span className="material-symbols-outlined text-slate-400">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-sm text-slate-600 dark:text-slate-400 px-4 pb-4 leading-relaxed">
                        <ul className="list-disc pl-5 space-y-1">
                          {formData.responsibilities ? (
                            formData.responsibilities.split('\n').map((item, index) => (
                              <li key={index}>{item.replace(/^- /, '')}</li>
                            ))
                          ) : (
                            <li>Nenhuma responsabilidade definida no cargo.</li>
                          )}
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-card border-border shadow-sm p-6 relative rounded-lg">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-xl"></div>
                  <div className="mb-6">
                    <h2 className="text-foreground font-bold h2">Contexto da Vaga</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Personalize os detalhes desta abertura específica.</p>
                  </div>
                  <form className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Modelo de Trabalho <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select name="model" value={formData.model} onChange={handleInputChange} className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                            <option>Híbrido</option>
                            <option>Presencial</option>
                            <option>Remoto</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Contrato <span className="text-red-500">*</span></label>
                        <select name="contract" value={formData.contract} onChange={handleInputChange} className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                          <option>CLT (Efetivo)</option>
                          <option>Pessoa Jurídica (PJ)</option>
                          <option>Estágio</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Período de Inscrição</label>
                        <div className="relative">
                          <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" type="date" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                          Localidade do Escritório
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" placeholder="Cidade (ex: São Paulo)" type="text" />
                          </div>
                          <div>
                            <select className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white">
                              <option>SP</option>
                              <option>RJ</option>
                              <option>MG</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Nível de Urgência</label>
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Baixa' }))} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.urgency === 'Baixa' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} type="button">Baixa</button>
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Média' }))} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.urgency === 'Média' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} type="button">Média</button>
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Alta' }))} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.urgency === 'Alta' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400'}`} type="button">Alta</button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex justify-between">
                          Faixa Salarial (Mensal)
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">R$</span>
                            <input name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-9 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" type="text" />
                          </div>
                          <span className="text-slate-400">-</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">R$</span>
                            <input name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-9 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-900 dark:text-white">
                        Contexto do Projeto / Motivo da Vaga <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea name="context" value={formData.context} onChange={handleInputChange} className="w-full min-h-[140px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white resize-none" placeholder="Explique por que essa vaga existe agora..."></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cargo Selecionado</h2>
                <div className="bg-card border-border shadow-sm rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12 text-primary">
                      <span className="material-symbols-outlined text-2xl">badge</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-slate-900 dark:text-white text-base font-semibold">{formData.roleTitle}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">ID: {formData.roleCode} • {formData.department}</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    Ver detalhes do cargo
                  </button>
                </div>
              </section>

              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 shrink-0 mt-0.5">warning</span>
                <div className="flex flex-col gap-1">
                  <p className="text-amber-900 dark:text-amber-100 font-medium text-sm">Atenção Importante</p>
                  <p className="text-amber-800 dark:text-amber-200/80 text-sm">
                    Após publicar, o conteúdo do Cargo permanece como referência padrão.
                  </p>
                </div>
              </div>

              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contexto da Vaga</h2>
                  <button onClick={() => setStep(2)} className="text-sm font-medium text-primary hover:underline">Editar informações</button>
                </div>
                <div className="bg-card border-border shadow-sm rounded-lg overflow-hidden shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Título da Vaga</span>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.roleTitle}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Localização</span>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.location} ({formData.model})</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Faixa Salarial</span>
                      <p className="text-slate-900 dark:text-white font-medium">R$ {formData.salaryMin} - R$ {formData.salaryMax}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Urgência</span>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.urgency}</p>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Justificativa</span>
                      <p className="text-slate-900 dark:text-white font-medium leading-relaxed">
                        {formData.context || "Nenhuma justificativa inserida."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-card border-t border-border p-4 md:px-12 md:py-5 flex items-center justify-end gap-4 z-20 shrink-0 sticky bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => step === 1 ? navigate('/jobs') : setStep(step - 1)}
          className="flex items-center justify-center gap-2 px-5 h-10 rounded-base border border-border bg-background text-foreground font-bold hover:bg-accent transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px]"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Voltar
        </button>
        <div className="flex items-center gap-3">
          {step === 3 ? (
            <>
              <button className="hidden sm:flex items-center justify-center gap-2 px-5 h-10 rounded-base text-muted-foreground font-bold hover:bg-accent transition-all duration-200 ease-in-out">
                <span className="material-symbols-outlined text-xl">save</span>
                Salvar como rascunho
              </button>
              <button onClick={handlePublish} className="flex items-center justify-center gap-2 px-6 h-10 rounded-base bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm transition-all duration-200 ease-in-out active:translate-y-[1px]">
                <span className="material-symbols-outlined text-xl">publish</span>
                Salvar vaga
              </button>
            </>
          ) : (
            <button onClick={() => setStep(step + 1)} className="flex items-center justify-center gap-2 px-6 h-10 rounded-base bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm transition-all duration-200 ease-in-out active:translate-y-[1px]">
              {step === 1 ? 'Continuar' : 'Revisar e publicar'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CreateJob;